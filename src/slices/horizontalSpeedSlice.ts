import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import s from '@/lib/settings';

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
      state.value += s.HORUZONTAL_SPEED;
    },
    decrement: (state) => {
      state.value -= s.HORUZONTAL_SPEED;
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
