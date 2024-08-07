import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Makes an API call using Axios.
 *
 * @param method - The HTTP method ("get", "post", "put", or "patch").
 * @param url - The endpoint URL.
 * @param data - The data to be sent with the request (for POST, PUT, and PATCH requests).
 * @param config - Additional Axios request configuration.
 * @returns The response data of type T.
 */
const apiCall = async <T>(
  method: "get" | "post" | "put" | "patch",
  url: string,
  data: any = null,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
    throw error;
  }
};

/**
 * Makes a GET request.
 *
 * @param url - The endpoint URL.
 * @param config - Additional Axios request configuration.
 * @returns The response data of type T.
 */
export const apiGet = async <T>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<T> => apiCall<T>("get", url, null, config);

/**
 * Makes a POST request.
 *
 * @param url - The endpoint URL.
 * @param data - The data to be sent with the request.
 * @param config - Additional Axios request configuration.
 * @returns The response data of type T.
 */
export const apiPost = async <T>(
  url: string,
  data: any,
  config: AxiosRequestConfig = {}
): Promise<T> => apiCall<T>("post", url, data, config);

/**
 * Makes a PUT request.
 *
 * @param url - The endpoint URL.
 * @param data - The data to be sent with the request.
 * @param config - Additional Axios request configuration.
 * @returns The response data of type T.
 */
export const apiPut = async <T>(
  url: string,
  data: any,
  config: AxiosRequestConfig = {}
): Promise<T> => apiCall<T>("put", url, data, config);

/**
 * Makes a PATCH request.
 *
 * @param url - The endpoint URL.
 * @param data - The data to be sent with the request.
 * @param config - Additional Axios request configuration.
 * @returns The response data of type T.
 */
export const apiPatch = async <T>(
  url: string,
  data: any,
  config: AxiosRequestConfig = {}
): Promise<T> => apiCall<T>("patch", url, data, config);
