import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const approvalsSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = approvalsSlice.actions;
export default approvalsSlice.reducer;
