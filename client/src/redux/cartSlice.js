import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { cartService } from "../services";

// --- Async Thunks for Cart Synchronization using cartService ---

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) return { cart: { items: [] } };

      const data = await cartService.getCart();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// For optimistic updates, the UI first dispatches the local reducer, then calls these thunks.
// If the thunk fails, it will trigger the rejected case where we can rollback.

export const syncAddToCart = createAsyncThunk(
  "cart/syncAddToCart",
  async (product, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) return rejectWithValue("Not authenticated");

      // We only send the minimum data needed by the backend
      const data = await cartService.addToCart(
        product._id,
        product.quantity || 1,
      );
      return data;
    } catch (error) {
      // Pass the original product back so we can rollback
      return rejectWithValue({
        error: error.response?.data?.message || "Failed to sync cart",
        product,
      });
    }
  },
);

export const syncRemoveFromCart = createAsyncThunk(
  "cart/syncRemoveFromCart",
  async (product, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) return rejectWithValue("Not authenticated");

      const data = await cartService.removeFromCart(product._id);
      return data;
    } catch (error) {
      return rejectWithValue({
        error:
          error.response?.data?.message || "Failed to remove from cart sync",
        product,
      });
    }
  },
);

export const syncUpdateQuantity = createAsyncThunk(
  "cart/syncUpdateQuantity",
  async ({ id, quantity, originalQuantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) return rejectWithValue("Not authenticated");

      const data = await cartService.updateCartItem(id, quantity);
      return data;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.message || "Failed to sync quantity",
        id,
        originalQuantity,
      });
    }
  },
);

export const syncClearCart = createAsyncThunk(
  "cart/syncClearCart",
  async (originalCartItems, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) return rejectWithValue("Not authenticated");

      const data = await cartService.clearCart();
      return data;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.message || "Failed to clear cart",
        originalCartItems,
      });
    }
  },
);

// --- Cart Slice ---

const initialState = {
  cartItems: [],
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Optimistic UI updates
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id,
      );
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity +=
          action.payload.requestedQuantity || 1;
      } else {
        const tempProduct = {
          ...action.payload,
          quantity: action.payload.requestedQuantity || 1,
          stock: action.payload.quantity,
        };
        state.cartItems.push(tempProduct);
      }
    },
    // Used for rolling back addToCart if API fails
    rollbackAddToCart: (state, action) => {
      const product = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === product._id,
      );
      if (itemIndex >= 0) {
        // We either reduce the quantity back, or remove entirely if it was 1
        state.cartItems[itemIndex].quantity -= product.quantity || 1;
        if (state.cartItems[itemIndex].quantity <= 0) {
          state.cartItems.splice(itemIndex, 1);
        }
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id,
      );
    },
    // Rollback for remove
    rollbackRemoveFromCart: (state, action) => {
      const product = action.payload;
      // Re-insert product
      state.cartItems.push(product);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.cartItems.findIndex((item) => item._id === id);
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity = quantity;
      }
    },
    // Rollback for update
    rollbackUpdateQuantity: (state, action) => {
      const { id, originalQuantity } = action.payload;
      const itemIndex = state.cartItems.findIndex((item) => item._id === id);
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity = originalQuantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    rollbackClearCart: (state, action) => {
      state.cartItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.cart?.items) {
        // Normalize backend structure to frontend structure
        state.cartItems = action.payload.cart.items
          .filter((item) => item.productId) // Ensure product exists
          .map((item) => ({
            ...(item.productId || {}), // Contains full product object
            sellerId: item.productId?.userId, // Map userId to sellerId for order processing
            quantity: item.quantity, // Cart amount
            stock: item.productId?.quantity || 0, // Original DB inventory
          }))
          .filter((item) => item && item._id);
      }
    });
    builder.addCase(fetchCart.rejected, (state) => {
      state.isLoading = false;
    });

    // Handle Failures for Rollbacks
    builder.addCase(syncAddToCart.rejected, (state, action) => {
      const errorMsg = action.payload?.error || "Failed to sync cart";
      if (
        errorMsg.toLowerCase().includes("out of stock") ||
        errorMsg.toLowerCase().includes("not available")
      ) {
        toast.warning(errorMsg);
      } else {
        toast.error(errorMsg);
      }
      // Revert UI automatically handled by dispatching rollback in components, OR we can do it here directly:
      // Note: doing roolback here directly limits the slice to only the payload data.
      const product = action.payload.product;
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === product._id,
      );
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity -= product.quantity || 1;
        if (state.cartItems[itemIndex].quantity <= 0) {
          state.cartItems.splice(itemIndex, 1);
        }
      }
    });

    builder.addCase(syncRemoveFromCart.rejected, (state, action) => {
      toast.error(action.payload?.error || "Failed to remove from cart");
      const product = action.payload.product;
      state.cartItems.push(product); // Rollback
    });

    builder.addCase(syncUpdateQuantity.rejected, (state, action) => {
      toast.error(action.payload?.error || "Failed to update quantity");
      const { id, originalQuantity } = action.payload;
      const itemIndex = state.cartItems.findIndex((item) => item._id === id);
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity = originalQuantity;
      }
    });

    builder.addCase(syncClearCart.rejected, (state, action) => {
      toast.error(action.payload?.error || "Failed to clear cart");
      state.cartItems = action.payload.originalCartItems;
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  rollbackAddToCart,
  rollbackRemoveFromCart,
  rollbackUpdateQuantity,
  rollbackClearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
