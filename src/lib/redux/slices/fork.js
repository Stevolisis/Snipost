// lib/redux/slices/forkSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  forks: [],
  loading: false,
  error: null
}

export const forkSlice = createSlice({
  name: 'fork',
  initialState,
  reducers: {
    fetchForksStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchForksSuccess: (state, action) => {
      state.forks = action.payload
      state.loading = false
    },
    fetchForksFailure: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    // createForkStart: (state) => {
    //   state.loading = true
    // },
    // createForkSuccess: (state, action) => {
    //   state.forks = [action.payload, ...state.forks]
    //   state.loading = false
    // },
    // createForkFailure: (state, action) => {
    //   state.error = action.payload
    //   state.loading = false
    // }
  }
})

export const {
  fetchForksStart,
  fetchForksSuccess,
  fetchForksFailure,
//   createForkStart,
//   createForkSuccess,
//   createForkFailure
} = forkSlice.actions



// Thunk action to create fork
// export const createFork = (contentType, contentId) => async (dispatch) => {
//   try {
//     dispatch(createForkStart())
//     const response = await api.post(`/fork-content/${contentType}/${contentId}`, {})
//     dispatch(createForkSuccess(response.data.forkedContent))
//     toast.success('Fork created successfully!')
//     return response.data.forkedContent
//   } catch (error) {
//     dispatch(createForkFailure(error.message))
//     toast.error(error.response?.data?.message || 'Failed to create fork')
//     throw error
//   }
// }

export default forkSlice.reducer