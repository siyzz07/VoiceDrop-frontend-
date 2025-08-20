import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

type iniState = {
  token: any;
  isAuthenticated: any;
};

const initialState: iniState = {
  token: token ? token : null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {loginSuccess,logout}=authSlice.actions
export default authSlice.reducer