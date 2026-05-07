  import axiosClient from "axios";
import { getToken } from "@/src/services/auth-storage";

const axios = axiosClient.create({
  baseURL: "http://192.168.1.52:8000/api",
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