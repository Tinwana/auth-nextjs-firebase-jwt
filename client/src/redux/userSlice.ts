import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: boolean | string;
}

// Define the initial state using that type
const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action: PayloadAction<boolean | string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    signUpStart: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state) => {
      state.loading = false;
      state.error = false;
    },
    signUpFailure: (state, action: PayloadAction<boolean | string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logOut: (state) => {
      state.loading = false;
      state.error = false;
      state.currentUser = null;
    },
  },
});

export const {
  signInStart,
  signInFailure,
  signInSuccess,
  signUpFailure,
  signUpStart,
  signUpSuccess,
  logOut,
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state;

export default userSlice.reducer;
