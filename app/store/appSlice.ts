// import node module libraries
import { createSlice } from '@reduxjs/toolkit'

// import app config file
import { settings } from '../../app.config';

const initialState = {
  version: settings.app.version,
  skin: settings.theme.skin,
  acceptedCookies: false,
}
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeSkin: (state, action) => {
      // @ts-ignore
      document.querySelector('html').setAttribute('data-theme', action.payload);
      state.skin = action.payload;
    },
    acceptCookies: (state, action) => {
      state.acceptedCookies = true;
    }
  },
})

export const {
  changeSkin,
  acceptCookies
} = appSlice.actions

export default appSlice.reducer