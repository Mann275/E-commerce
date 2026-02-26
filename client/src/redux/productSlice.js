import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    singleProduct: null,
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSingleProduct: (state, action) => {
            state.singleProduct = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
});

export const { setLoading, setProducts, setSingleProduct, setError } = productSlice.actions;
export default productSlice.reducer;
