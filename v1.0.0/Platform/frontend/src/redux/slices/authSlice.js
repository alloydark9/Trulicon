import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../../services/authService";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  authChecked: false,
};

export const register = createAsyncThunk(
  "/auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await registerUser(userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "/auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await loginUser(userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const logout = createAsyncThunk("/auth/logout", async (_, thunkAPI) => {
  try {
    const response = await logoutUser();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Logout failed",
    );
  }
});

export const getUser = createAsyncThunk("/auth/me", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const response = await getCurrentUser(token);

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Error while getting the user",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
        localStorage.setItem("token", action.payload.data.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log(action.payload);
        state.isAuthenticated = true;
        state.authChecked = true;
        localStorage.setItem("token", action.payload.data.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user cases
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authChecked = true;
      });
  },
});
export const { clearError } = authSlice.actions;

export default authSlice.reducer;
