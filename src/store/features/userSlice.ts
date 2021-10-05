import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface UserState {
  currentUser: IUser
}

// Define the initial state using that type
const initialState: UserState = {
  currentUser: {
    email: '',
    isLoading: true
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload
    },
  },
})

export const { setCurrentUser } = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer