import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getUsers,
  getUser,
  getUserBySearch,
  updateUser,
  deleteUser,
} from "../../services/userService";

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const getAllUsers = createAsyncThunk("/users", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const response = await getUsers(token);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Registration failed",
    );
  }
});

export const getUserById = createAsyncThunk(
  "/users/:id",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await getUser(id, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const getBySearch = createAsyncThunk(
  "/users/search",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await getUserBySearch(token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const updateOneUser = createAsyncThunk(
  "/users/:id",
  async (userData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await updateUser(userData, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const deleteOneUser = createAsyncThunk(
  "/users/:id",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await deleteUser(token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAlUsers cases
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.users = [];
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.users = [];
      })
      // getUserById cases
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedUser = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.data.user;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedUser = null;
      })
      // getBySearch cases
      .addCase(getBySearch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.users = [];
      })
      .addCase(getBySearch.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.users;
      })
      .addCase(getBySearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.users = [];
      });
  },
});

export default userSlice.reducer;
