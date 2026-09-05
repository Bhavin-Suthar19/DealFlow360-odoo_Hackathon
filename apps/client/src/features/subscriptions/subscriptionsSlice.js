import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
