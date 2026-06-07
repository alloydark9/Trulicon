import { joinVault, createVault, getVault } from "../../services/vaultService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  currentVault: null,
  vaultState: "",
  loading: false,
  error: null,
};

export const vaultCreate = createAsyncThunk(
  "/vaults/create",
  async (vaultData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await createVault(vaultData, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Vault Creation failed",
      );
    }
  },
);

export const vaultJoin = createAsyncThunk(
  "/vaults/join",
  async (vaultData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await joinVault(vaultData, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Vault Joining failed",
      );
    }
  },
);

export const getVaultByCode = createAsyncThunk(
  "/vaults/:code",
  async (vaultData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await getVault(vaultData, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Vault Joining failed",
      );
    }
  },
);

const vaultSlice = createSlice({
  name: "vault",
  initialState,
  reducers: {
    setVault: (state, action) => {
      state.currentVault = action.payload;
    },

    clearVault: (state) => {
      state.currentVault = null;
      state.vaultState = "";
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // vaultCreate cases
      .addCase(vaultCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vaultCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.vaultState = "created";
        state.currentVault = action.payload.data.vault;
      })
      .addCase(vaultCreate.rejected, (state, action) => {
        state.loading = false;
        state.vaultState = "";
        state.error = action.payload;
      })

      // joinCreate cases
      .addCase(vaultJoin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vaultJoin.fulfilled, (state, action) => {
        state.loading = false;
        state.vaultState = "active";
        state.currentVault = action.payload.data.vault;
      })
      .addCase(vaultJoin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getVaultByCode cases
      .addCase(getVaultByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVaultByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVault = action.payload.data.vault;
      })
      .addCase(getVaultByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setVault, clearVault, setLoading, setError } =
  vaultSlice.actions;

export default vaultSlice.reducer;
