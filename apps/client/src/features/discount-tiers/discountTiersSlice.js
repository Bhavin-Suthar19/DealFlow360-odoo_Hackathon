import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const discountTiersSlice = createSlice({
  name: 'discountTiers',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = discountTiersSlice.actions;
export default discountTiersSlice.reducer;
