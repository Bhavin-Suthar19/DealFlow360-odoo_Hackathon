import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = billingSlice.actions;
export default billingSlice.reducer;
