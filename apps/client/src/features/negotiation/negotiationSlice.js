import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const negotiationSlice = createSlice({
  name: 'negotiation',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = negotiationSlice.actions;
export default negotiationSlice.reducer;
