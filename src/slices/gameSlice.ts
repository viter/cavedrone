import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
  gameState: {
    loading: boolean;
    loadingUpdate: number;
    start: boolean;
    over: boolean;
    win: boolean;
    name: string;
    level: number;
  };
}

const initialState: GameState = {
  gameState: {
    loading: false,
    loadingUpdate: 0,
    start: false,
    over: false,
    win: false,
    name: '',
    level: 5,
  },
};

export const scoreSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameStart: (state, action: PayloadAction<boolean>) => {
      state.gameState.over = false;
      state.gameState.win = false;
      state.gameState.start = action.payload;
    },
    setGameOver: (state, action: PayloadAction<boolean>) => {
      state.gameState.start = false;
      state.gameState.over = action.payload;
    },
    setGameWin: (state, action: PayloadAction<boolean>) => {
      state.gameState.win = action.payload;
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.gameState.name = action.payload;
    },
    setGameLevel: (state, action: PayloadAction<number>) => {
      state.gameState.level = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.gameState.loading = action.payload;
    },
    updateLoad: (state) => {
      state.gameState.loadingUpdate++;
    },
    resetUpdateLoad: (state) => {
      state.gameState.loadingUpdate = 0;
    },
  },
});

export const {
  setGameStart,
  setGameOver,
  setGameWin,
  setPlayerName,
  setGameLevel,
  setIsLoading,
  updateLoad,
  resetUpdateLoad,
} = scoreSlice.actions;

export default scoreSlice.reducer;
