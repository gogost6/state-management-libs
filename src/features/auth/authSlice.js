import { createSlice } from "@reduxjs/toolkit";

const parseStored = () => {
  try {
    const item = localStorage.getItem("auth");
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const stored = parseStored();

const authSlice = createSlice({
  name: "auth",
  initialState: stored || { accessToken: null, refreshToken: null },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      );
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => !!state.auth.accessToken;
export const selectCurrentUserEmail = (state) => {
  const token = state.auth.accessToken;
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.sub ?? null;
  } catch {
    return null;
  }
};
export default authSlice.reducer;
