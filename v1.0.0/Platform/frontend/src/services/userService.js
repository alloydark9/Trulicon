import axiosInstance from "../config/axiosInstance";

export const getUsers = (token) => {
  return axiosInstance.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUser = (id, token) => {
  return axiosInstance.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserBySearch = (token) => {
  return axiosInstance.get("/users/search", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = (id, userdata, token) => {
  return axiosInstance.patch(`/users/${id}`, userdata, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUser = (id, token) => {
  return axiosInstance.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
