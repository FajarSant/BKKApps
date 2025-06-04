import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;

      let token: string = "";

      if (pathname.startsWith("/admin")) {
        token = localStorage.getItem("admin_token") ?? "";
      } else if (pathname.startsWith("/Id")) {
        token =
          localStorage.getItem("siswa_token") ??
          localStorage.getItem("alumni_token") ??
          "";
      } else {
        token = localStorage.getItem("bkk_token") ?? "";
      }

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const pathname = window.location.pathname;

      const adminToken = localStorage.getItem("admin_token");
      const siswaToken = localStorage.getItem("siswa_token");
      const alumniToken = localStorage.getItem("alumni_token");

      const isAdmin = pathname.startsWith("/admin");
      const isSiswaOrAlumni = pathname.startsWith("/Id");

      const noToken =
        (isAdmin && !adminToken) ||
        (isSiswaOrAlumni && !siswaToken && !alumniToken) ||
        (!isAdmin && !isSiswaOrAlumni);

      if (noToken) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
