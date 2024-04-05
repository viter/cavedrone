import { createSlice } from '@reduxjs/toolkit';
import s from '@/lib/settings';

export interface VerticalSpeedState {
  value: number;
}

const initialState: VerticalSpeedState = {
  value: 0,
};

export const verticalSpeedSlice = createSlice({
  name: 'verticalSpeed',
  initialState,
  reducers: {
    vincrement: (state) => {
      state.value += s.VERTICAL_SPEED;
    },
    vdecrement: (state) => {
      state.value -= s.VERTICAL_SPEED;
    },
    resetVerticalSpeed: (state) => {
      state.value = 0;
    },
  },
});

export const { vincrement, vdecrement, resetVerticalSpeed } = verticalSpeedSlice.actions;

export default verticalSpeedSlice.reducer;
