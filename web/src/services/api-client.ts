import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3333";

export const api = axios.create({
  baseURL: API_URL,
});
