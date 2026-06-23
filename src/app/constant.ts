import axios from "axios";

const MENU_API_BASE_URL =
  process.env.NEXT_PUBLIC_MENU_API_BASE_URL ?? "http://localhost:3000";
const TRANSLATE_API_BASE_URL =
  process.env.NEXT_PUBLIC_TRANSLATE_API_BASE_URL ?? "http://localhost:8000";

const CHATBOT_API_BASE_URL =
  process.env.NEXT_PUBLIC_MENU_API_BASE_URL ?? "http://localhost:8000";

export const API_BACKEND = axios.create({
  baseURL: MENU_API_BASE_URL,
});

export const API_TRANSLATE = axios.create({
  baseURL: TRANSLATE_API_BASE_URL,
});

export const API_CHATBOT = axios.create({
  baseURL: CHATBOT_API_BASE_URL,
});
