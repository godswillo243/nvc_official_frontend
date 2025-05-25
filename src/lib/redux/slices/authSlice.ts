import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state

interface IUser {
  name: string;
  email: string;
  password: string;
  nin: string;
  phone_number: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: null | IUser;
}

// Define the initial state using that type
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser | null>) => {
      if (action.payload === null) {
        state.isAuthenticated = false;
        state.user = null;
        return;
      }
      state.user = action.payload;
    },
  },
});

export const { setIsAuthenticated } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default authSlice.reducer;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
