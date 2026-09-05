import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const upsellSlice = createSlice({
  name: 'upsell',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = upsellSlice.actions;
export default upsellSlice.reducer;
