import axios from "axios";
import type { ApiResponse } from "./types";

type QueryParams = { [key: string]: string | boolean | number };
async function requestWrapper<T>(
  requestFunc: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const response = await requestFunc();
    return {
      isError: false,
      data: response,
      responseCode: 200,
    };
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          isError: true,
          // error: {
          //   status: "Not Found",
          //   statusCode: 404,
          //   message: "The requested resource could not be found",
          //   correlationId: error.response?.headers["X-Correlation-Id"],
          // },
          responseCode: 404,
          originResponseCode: 404,
        };
      }

      let apiErr = error.response?.data as ApiResponse<T>;
      console.log(apiErr);
      if (Object.keys(apiErr ?? {}).length === 0) {
        const errRes = error.response;
        console.log(errRes);
        apiErr = {
          isError: true,
          responseCode: errRes?.status || 500,
          // error: {
          //   statusCode: errRes?.status || 500,
          //   message: errRes?.statusText || "Failed to request",
          //   status: errRes?.statusText || "Internal server error",
          //   correlationId: error.response?.headers["X-Correlation-Id"],
          // },
          originResponseCode: errRes?.status || 500,
        };
      }

      return apiErr;
    } else {
      return {
        isError: true,
        responseCode: 500,
        originResponseCode: 500,
      };
    }
  }
}

export async function clientPost<TRequest, TResponse>(
  path: string,
  body?: TRequest,
  query?: QueryParams
): Promise<ApiResponse<TResponse>> {
  return await post<TRequest, TResponse>(path, body, query);
}

export async function clientPatch<TRequest, TResponse>(
  path: string,
  body?: TRequest
): Promise<ApiResponse<TResponse>> {
  return await patch<TRequest, TResponse>(path, body);
}
export async function clientGetFile(path: string): Promise<unknown> {
  return await getBlob(path);
}
export async function clientPut<TRequest, TResponse>(
  path: string,
  body?: TRequest
): Promise<ApiResponse<TResponse>> {
  return await put<TRequest, TResponse>(path, body);
}
export async function clientGet<T>(
  path: string,
  query?: { [key: string]: string }
): Promise<ApiResponse<T>> {
  return await get<T>(path, query);
}
export async function clientDelete(
  path: string,
  query?: QueryParams
): Promise<ApiResponse<undefined>> {
  return await intDelete(path, query);
}
async function get<T>(
  path: string,
  query?: { [key: string]: string }
): Promise<ApiResponse<T>> {
  return await requestWrapper(async () => {
    const response = await axios({
      method: "GET",
      url: path,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      params: query,
    });
    return response.data;
  });
}

async function intDelete<T>(
  path: string,
  params?: QueryParams
): Promise<ApiResponse<T>> {
  return await requestWrapper(async () => {
    const response = await axios({
      method: "DELETE",
      url: path,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      params,
    });
    return response.data;
  });
}

async function post<TRequest, TResponse>(
  path: string,
  body?: TRequest,
  query?: QueryParams
): Promise<ApiResponse<TResponse>> {
  return await requestWrapper(async () => {
    const response = await axios({
      method: "POST",
      url: path,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      data: body,
      params: query,
    });
    return response.data;
  });
}
async function put<TRequest, TResponse>(
  path: string,
  body?: TRequest
): Promise<ApiResponse<TResponse>> {
  return await requestWrapper(async () => {
    const response = await axios({
      method: "PUT",
      url: path,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      data: body,
    });
    return response.data;
  });
}
async function patch<TRequest, TResponse>(
  path: string,
  body?: TRequest
): Promise<ApiResponse<TResponse>> {
  return await requestWrapper(async () => {
    const response = await axios({
      method: "PATCH",
      url: path,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      data: body,
    });
    return response.data;
  });
}

async function getBlob(path: string): Promise<unknown> {
  return await requestWrapper(async () => {
    const response = await axios({
      method: "GET",
      url: path,
      responseType: "arraybuffer",
    });
    return {
      isError: false,
      data: response.data as ArrayBuffer,
      responseCode: response.status,
      contentDisposition: response.headers["content-disposition"],
      contentType: response.headers["content-type"],
      contentLength: response.headers["content-length"],
    };
  });
}
