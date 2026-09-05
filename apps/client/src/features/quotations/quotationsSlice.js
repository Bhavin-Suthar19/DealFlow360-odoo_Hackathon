import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const quotationsSlice = createSlice({
  name: 'quotations',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = quotationsSlice.actions;
export default quotationsSlice.reducer;
