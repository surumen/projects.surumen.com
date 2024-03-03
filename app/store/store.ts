import { configureStore } from '@reduxjs/toolkit';
import appSlice from '@/store/appSlice';
import matchMadnessBracketSlice from '@/store/marchMadnessBracketSlice';

export const store = configureStore({
  reducer: {
      app: appSlice,
      matchMadness: matchMadnessBracketSlice,
      //chat:appSlice,
      //calendar:calendarSlice,
      //mail:appSlice,
  },
})