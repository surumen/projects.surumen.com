// store/appSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { settings } from '../../app.config'

interface AppState {
  version: string
  skin: string
  acceptedCookies: boolean
}

const initialState: AppState = {
  version: settings.app.version,
  skin: settings.theme.skin,
  acceptedCookies: false,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeSkin: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.skin = action.payload
    },
    acceptCookies: (state) => {
      state.acceptedCookies = true
    },
  },
})

export const { changeSkin, acceptCookies } = appSlice.actions
export default appSlice.reducer
