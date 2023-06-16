import { isAxiosError } from "axios";
import { types } from "util";

export function getErrorMessage(e: any): string {
  let message = "";
  if (isAxiosError(e)) {
    message = `${e.response?.data?.error?.message}. ` || "";
  }
  if (types.isNativeError(e)) {
    message += `${e.message}.`;
  }
  return message;
}
