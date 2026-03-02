import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { wishlistService } from "../services";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) return { wishlist: { items: [] } };

      const data = await wishlistService.getWishlist();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

export const syncAddToWishlist = createAsyncThunk(
  "wishlist/syncAddToWishlist",
  async (product, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) return rejectWithValue("Not authenticated");

      const data = await wishlistService.addToWishlist(product._id);
      return data;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.message || "Failed to sync wishlist",
        product,
      });
    }
  },
);

export const syncRemoveFromWishlist = createAsyncThunk(
  "wishlist/syncRemoveFromWishlist",
  async (product, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) return rejectWithValue("Not authenticated");

      const data = await wishlistService.removeFromWishlist(product._id);
      return data;
    } catch (error) {
      return rejectWithValue({
        error:
          error.response?.data?.message || "Failed to remove from wishlist",
        product,
      });
    }
  },
);

const initialState = {
  wishlistItems: [],
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existingIndex = state.wishlistItems.findIndex(
        (item) => item._id === action.payload._id,
      );
      if (existingIndex === -1) {
        state.wishlistItems.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      // Updated to expect full product object for rollback mechanisms, or just matching by ID
      const idToRemove = action.payload._id || action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== idToRemove,
      );
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.isLoading = false;
      // Map populated items
      if (action.payload?.wishlist?.items) {
        state.wishlistItems = action.payload.wishlist.items
          .map((item) => item.productId)
          .filter((item) => item && item._id);
      }
    });
    builder.addCase(fetchWishlist.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(syncAddToWishlist.rejected, (state, action) => {
      toast.error(action.payload?.error || "Failed to add to wishlist");
      // Rollback
      const product = action.payload.product;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== product._id,
      );
    });

    builder.addCase(syncRemoveFromWishlist.rejected, (state, action) => {
      toast.error(action.payload?.error || "Failed to remove from wishlist");
      // Rollback
      const product = action.payload.product;
      state.wishlistItems.push(product);
    });
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
