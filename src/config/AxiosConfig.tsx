import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Add access token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- SIMPLE REFRESH TOKEN LOGIC ----

let isRefreshing = false;

API.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;

          console.log('token expired');
          
          
          const res = await axios.post(
            `${ import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
          console.log('res :>> ', res);
          const newToken = res.data.accessToken;
          localStorage.setItem("token", newToken);

          isRefreshing = false;
        }

        originalRequest.headers.Authorization =
          "Bearer " + localStorage.getItem("token");

        return API(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;

        localStorage.removeItem("token");
        localStorage.removeItem('userName')
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
