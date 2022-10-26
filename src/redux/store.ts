import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tagReducer from './tagSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tag: tagReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
