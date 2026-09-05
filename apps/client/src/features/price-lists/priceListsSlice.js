import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const priceListsSlice = createSlice({
  name: 'priceLists',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = priceListsSlice.actions;
export default priceListsSlice.reducer;
