import axios from "axios";
import appConfig from "./config.json";
import { SERVER } from "../../env";

enum LOCAL_OR_SERVER {
  SERVER = "SERVER",
  LOCAL = "LOCAL",
}

const RUN_FROM: LOCAL_OR_SERVER =
  SERVER == true ? LOCAL_OR_SERVER.SERVER : LOCAL_OR_SERVER.LOCAL;

const MENU_API_BASE_URL =
  RUN_FROM == LOCAL_OR_SERVER.LOCAL
    ? appConfig.local_backendBaseUrl
    : appConfig.server_backendBaseUrl;
const TRANSLATE_API_BASE_URL =
  RUN_FROM == LOCAL_OR_SERVER.LOCAL
    ? appConfig.local_translateApiBaseUrl
    : appConfig.server_translateApiBaseUrl;
const CHATBOT_API_BASE_URL =
  RUN_FROM == LOCAL_OR_SERVER.LOCAL
    ? appConfig.local_chatBotBaseUrl
    : appConfig.server_chatBotBaseUrl;
export const CHATBOT_WS_URL =
  RUN_FROM == LOCAL_OR_SERVER.LOCAL
    ? appConfig.local_chatBot_websocket
    : appConfig.server_chatBot_websocket;

export const API_BACKEND = axios.create({
  baseURL: MENU_API_BASE_URL,
});

export const API_TRANSLATE = axios.create({
  baseURL: TRANSLATE_API_BASE_URL,
});

export const API_CHATBOT = axios.create({
  baseURL: CHATBOT_API_BASE_URL,
});

export const END_POINT_TRANSLATER_ENGLISH = "/translateToEnglish";
export const END_POINT_TRANSLATER_FULL = "/translate";
