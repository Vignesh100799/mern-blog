import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: null,
    error: null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.currentUser = null
            state.loading = false
            state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true
            state.error = null
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
        },
        updateFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteStart: (state) => {
            state.loading = true
            state.error = null
        },
        deleteSuccess: (state, action) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        signOutSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        }

    }
})

export const {
    signInFailure,
    signOutSuccess,
    signInStart,
    signInSuccess,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteStart,
    deleteSuccess,
    deleteFailure
} = userSlice.actions


export default userSlice.reducer