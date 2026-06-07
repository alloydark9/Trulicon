import axiosInstance from "../config/axiosInstance";

export const createVault = (vaultData, token) => {
    if (!token || token === "null" || token === "undefined") {
    return Promise.reject(new Error("Invalid token"));
  }
  return axiosInstance.post("/vaults/create", vaultData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const joinVault = (vaultData, token) => {
  if (!token || token === "null" || token === "undefined") {
    return Promise.reject(new Error("Invalid token"));
  }
  return axiosInstance.post("/vaults/join", vaultData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getVault = (vaultData, token) => {
  if (!token || token === "null" || token === "undefined") {
    return Promise.reject(new Error("Invalid token"));
  }
  return axiosInstance.get(`/vaults/${vaultData.code}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};