import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthAPI } from '../Services/userAuthAPI'
import userReducer from '../Slices/userSlice'


export const store = configureStore({
  reducer: {
    [userAuthAPI.reducerPath]: userAuthAPI.reducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthAPI.middleware),
})

setupListeners(store.dispatch)