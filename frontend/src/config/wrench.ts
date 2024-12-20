import wretch from "wretch";
import { BASE_API_ROUTE } from "./env";

export const api = wretch(BASE_API_ROUTE);
