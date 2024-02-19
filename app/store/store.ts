import { configureStore } from '@reduxjs/toolkit';
import appSlice from '@/store/appSlice';

export const store = configureStore({
  reducer: {
      app:appSlice,
      //chat:appSlice,
      //calendar:calendarSlice,
      //mail:appSlice,
  },
})