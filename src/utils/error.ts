import { isAxiosError } from "axios";
import { types } from "util";

// Function to retrieve an error message from a given parameter
export function getErrorMessage(e: any): string {
  let message = "";

  // Check if the error is an Axios error
  if (isAxiosError(e)) {
    // If it's an Axios error, retrieve the message from error data
    message = `${e.response?.data?.error?.message}. ` || "";
  }

  // Check if the error is a native error
  if (types.isNativeError(e)) {
    // If it's a native error, append the message
    message += `${e.message}.`;
  }

  // Return the formatted error message
  return message;
}
