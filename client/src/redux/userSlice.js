
import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("accesstoken");
    if (userStr && token) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Failed to parse user from local storage:", error);
  }
  return null;
};

const initialUser = getUserFromLocalStorage();

const initialState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
