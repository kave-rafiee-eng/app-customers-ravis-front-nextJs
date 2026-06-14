import axios from "axios";

export const MENU_API_BASE_URL = "http://localhost:3000";
export const TRANSLATE_API_BASE_URL = "http://localhost:8000";
// baseURL: "http://10.240.195.179:3000",
export const API_MENU = axios.create({
  baseURL: MENU_API_BASE_URL,
});
export const API_TRANSLATE = axios.create({
  baseURL: TRANSLATE_API_BASE_URL,
});

export const END_POINT_MENU_ADVANCE = "/menu-advance";
