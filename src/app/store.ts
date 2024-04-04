import { configureStore } from '@reduxjs/toolkit';
import horizontalSpeedReducer from '../slices/horizontalSpeedSlice';
import verticalSpeedReducer from '../slices/verticalSpeedSlice';
import scoreReducer from '../slices/scoreSlice';
import gameReducer from '../slices/gameSlice';

export const store = configureStore({
  reducer: {
    horizontalSpeed: horizontalSpeedReducer,
    verticalSpeed: verticalSpeedReducer,
    score: scoreReducer,
    game: gameReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
