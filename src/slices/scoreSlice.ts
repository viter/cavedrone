import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ScoreState {
  value: number;
}

const initialState: ScoreState = {
  value: 0,
};

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    updateScore: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    resetScore: (state) => {
      state.value = 0;
    },
  },
});

export const { updateScore, resetScore } = scoreSlice.actions;

export default scoreSlice.reducer;
