import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface AppState {
  allApps: IIntegrationApp[]
  allIntegrationUsers: IIntegrationUser[]
}

// Define the initial state using that type
const initialState: AppState = {
  allApps: [],
  allIntegrationUsers: []
}

export const appSlice = createSlice({
  name: 'integrationApp',
  initialState,
  reducers: {
    setAllApps: (state, action: PayloadAction<IIntegrationApp[]>) => {
      state.allApps = action.payload
    },
    setIntegrationUsers: (state, action: PayloadAction<IIntegrationUser[]>) => {
      state.allIntegrationUsers = action.payload
    }
  },
})

export const { setAllApps } = appSlice.actions
export const { setIntegrationUsers } = appSlice.actions

export const allApps = (state: RootState) => state.app

export default appSlice.reducer