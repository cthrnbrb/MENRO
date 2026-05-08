  import axiosClient from "axios";
import { getToken } from "@/src/services/auth-storage";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://192.168.1.16:8000/api";

const axios = axiosClient.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

axios.interceptors.request.use(async (req) => {
  const token = await getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default axios;