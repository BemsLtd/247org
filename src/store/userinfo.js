import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    updateUserDetails: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const { updateUserDetails } = userSlice.actions;

export default userSlice.reducer;
