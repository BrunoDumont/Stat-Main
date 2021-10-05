import { configureStore } from '@reduxjs/toolkit'
import userReducer from "@/store/features/userSlice";
import appReducer from "@/store/features/integrationAppSlice";
import alertReducer from "@/store/features/alertSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    alert: alertReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
