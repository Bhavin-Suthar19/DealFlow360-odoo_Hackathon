import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
};

export const warehousesSlice = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = warehousesSlice.actions;
export default warehousesSlice.reducer;
