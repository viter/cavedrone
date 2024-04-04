import { createSlice } from '@reduxjs/toolkit';

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
      state.value += 2;
    },
    vdecrement: (state) => {
      state.value -= 2;
    },
    resetVerticalSpeed: (state) => {
      state.value = 0;
    },
  },
});

export const { vincrement, vdecrement, resetVerticalSpeed } = verticalSpeedSlice.actions;

export default verticalSpeedSlice.reducer;
