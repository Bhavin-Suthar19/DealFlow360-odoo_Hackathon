import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const fulfillmentSlice = createSlice({
  name: 'fulfillment',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = fulfillmentSlice.actions;
export default fulfillmentSlice.reducer;
