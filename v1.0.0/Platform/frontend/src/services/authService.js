import axiosInstance from "../config/axiosInstance";

export const registerUser = (userData) => {
  return axiosInstance.post("/auth/sign-up", userData);
};

export const loginUser = (userData) => {
  return axiosInstance.post("/auth/sign-in", userData);
};

export const logoutUser = () => {
  return axiosInstance.post("/auth/sign-out");
};
export const getCurrentUser = (token) => {
  if (!token || token === "null" || token === "undefined") {
    return Promise.reject(new Error("Invalid token"));
  }

  return axiosInstance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
