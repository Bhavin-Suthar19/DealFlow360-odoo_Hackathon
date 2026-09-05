import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/apiSlice';

// Extend the base api with auth endpoints (already added in authApi)
// This slice will handle auth state based on RTK Query mutation results.

const initialState = {
  user: null, // { id, name, email, role, teamId }
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      // Persist token for apiSlice to attach to future requests
      if (token) localStorage.setItem('token', token);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCredentials, clearAuth, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;

// Optional: attach listeners to authApi mutations to automatically update state
// (Not required for this task, handled manually in UI components.)
