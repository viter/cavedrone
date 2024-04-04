import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface HorizontalSpeedState {
  value: number;
}

const initialState: HorizontalSpeedState = {
  value: 0,
};

export const horizontalSpeedSlice = createSlice({
  name: 'horizontalSpeed',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 0.5;
    },
    decrement: (state) => {
      state.value -= 0.5;
    },
    resetHorizontalSpeed: (state) => {
      state.value = 0;
    },
    setHorizontalSpeed: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, resetHorizontalSpeed, setHorizontalSpeed } =
  horizontalSpeedSlice.actions;

export default horizontalSpeedSlice.reducer;
