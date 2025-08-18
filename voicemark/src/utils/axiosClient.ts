import axios from "axios";

const backendUrl = "https://web-app-be-dylr.onrender.com";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isServer = typeof window === "undefined";

// Create an instance of axios
const API = axios.create({
  baseURL: backendUrl,
  withCredentials: true
});

// class ClientSessionToken {
//   private token: string = "";
//   set value(token: string) {
//     if (isServer) {
//       throw new Error("Cannot set token");
//     }
//     this.token = token;
//   }

//   get value() {
//     return this.token;
//   }
// }

// export const clientSessionToken = new ClientSessionToken();
// // Request interceptor
// API.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
//   try {
//     if (!isServer) {
//       if (clientSessionToken.value) {
//         config.headers.Authorization = `Bearer ${clientSessionToken.value}`;
//       } else {
//         config.headers.Authorization = ``;
//       }
//     }

//     const baseUrl = config.baseURL;

//     if (!baseUrl) {
//       config.baseURL = "https://localhost:3000";
//     }

//     return config;
//   } catch (error) {
//     if (!isServer) {
//       console.error("Request interceptor error:", error);
//     }
//     return Promise.reject(error);
//   }
// });


export default API;