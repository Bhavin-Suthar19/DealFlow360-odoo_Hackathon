import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const approvalChainsSlice = createSlice({
  name: 'approvalChains',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = approvalChainsSlice.actions;
export default approvalChainsSlice.reducer;
