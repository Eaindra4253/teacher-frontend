import { useAuthStore } from "@/stores/auth.store";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconX } from "@tabler/icons-react";
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Check for the dummy API environment variable
const isDummyApi = import.meta.env.VITE_DUMMY_API === "true";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Request Interceptor: Add dummy flag and pass through
    if (isDummyApi) {
      config.headers['X-Dummy-Request'] = 'true';
    }

    const { auth } = useAuthStore.getState();

    if (auth?.accessToken) {
      config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
      config.headers["Accept"] = "application/json";
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json; charset=utf-8";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Response Interceptor: Handle dummy logic first
    if (response.config.headers?.['X-Dummy-Request'] === 'true') {
      const url = response.config.url;
      const data = response.config.data;

      return new Promise<AxiosResponse<LoginResponse | any>>((resolve, reject) => {
        setTimeout(() => {
          if (url?.includes("/auth/login")) {
            // Check credentials from the request body
            if (data?.email === "thiha@gmail.com" && data?.password === "thiha123") {
              // RESOLVE the promise on SUCCESSFUL dummy login
              resolve({
                ...response,
                data: {
                  accessToken: "dummy-jwt-token-for-testing",
                  user: {
                    id: 1,
                    username: "thiha",
                    email: "thiha@gmail.com",
                    password: "thiha123",
                    status: "ACTIVE",
                    role: "ADMIN",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                },
                status: 200,
                statusText: "OK",
              });
            } else {
              // REJECT the promise on a FAILED dummy login
              reject({
                ...response,
                response: {
                  ...response,
                  status: 401,
                  data: { message: "Invalid credentials" },
                },
              });
            }
          } else {
            // Default mock response for other endpoints
            resolve({ ...response, data: {} });
          }
        }, 1000); // 1-second delay
      });
    }

    // Pass through to real API response handling
    return response;
  },
  (error: AxiosError) => {
    // This block handles REAL API errors.
    // DUMMY API errors are handled by the reject() call in the response interceptor.
    
    // Check if the error is from the dummy API, and if so, don't run this block
    if (isDummyApi && error.config?.headers?.['X-Dummy-Request'] === 'true') {
        // The mock logic in the interceptor already handled the rejection.
        // We can just re-reject the promise here.
        return Promise.reject(error);
    }
    
    if (error.response && error.response.status === 401) {
      if (error.response.config.url?.includes("login")) {
        notifications.show({
          id: "unauthorized",
          title: "Unauthorized",
          message: "Invalid email or password",
          color: "red",
          icon: <IconX size={16} />,
        });
      } else {
        // This is the session expired toast that was showing up
        const clearUser = useAuthStore.getState().removeAuthUser;
        clearUser();
        notifications.show({
          id: "session-expired",
          title: "Session Expired",
          message: "Please login again",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;