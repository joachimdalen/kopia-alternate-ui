import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import type { ApiResponse } from "../types";

export type ErrorInformation = {
  title: string;
  message?: string;
};
export type WithErrorCallback = {
  onError: (error?: ErrorInformation) => void;
};

type UseApiRequestOptions<TResponse, TRequest = unknown> = {
  action: (data?: TRequest) => Promise<ApiResponse<TResponse>>;
  onReturn: (data: TResponse, request?: TRequest) => void;
  //onValidationErrors?: (validationResults?: Record<string, string>) => void;
  showErrorAsNotification?: boolean;
  returnsData?: boolean;
  requestErrorInfo?: ErrorInformation;
  errorInfo?: ErrorInformation;
};

type UseApiRequestReturn<TRequest = unknown> = {
  error: ErrorInformation | undefined;
  loading: boolean;
  loadingKey?: string;
  execute: (data?: TRequest, loadingKey?: string) => Promise<void>;
};

type LoadingProps = {
  isLoading: boolean;
  key?: string;
};

function useApiRequest<TResponse, TRequest>({
  action,
  onReturn,
  // onValidationErrors,
  errorInfo,
  requestErrorInfo,
  showErrorAsNotification = false,
  returnsData = true,
}: UseApiRequestOptions<TResponse, TRequest>): UseApiRequestReturn<TRequest> {
  const [loading, setLoading] = useState<LoadingProps>({ isLoading: false });
  const [error, setError] = useState<ErrorInformation | undefined>();

  function processError(err: ErrorInformation) {
    if (showErrorAsNotification) {
      showNotification({
        title: err.title,
        message: err.message,
        color: "red",
      });
      return;
    }
    setError(err);
  }

  async function execute(data?: TRequest, loadingKey?: string) {
    try {
      setLoading({ isLoading: true, key: loadingKey });
      setError(undefined);
      const response = await action(data);
      if (!response.isError) {
        if (returnsData && response.data === undefined) {
          const err: ErrorInformation = {
            title: errorInfo?.title ?? "Operation failed",
            message: errorInfo?.message ?? "Failed due to an unknown error",
          };
          processError(err);
          return;
        }

        onReturn(response.data!, data);
        return;
      } else {
        const err: ErrorInformation = {
          title:
            requestErrorInfo?.title ||
            response.error?.status ||
            "Operation failed",
          message:
            requestErrorInfo?.message ||
            response.error?.message ||
            "Failed due to an unknown error",
        };
        processError(err);
      }
    } catch (error: unknown) {
      console.error(error);
      const err: ErrorInformation = {
        title: errorInfo?.title ?? "Operation failed",
        message: errorInfo?.message ?? "Failed due to an unknown error",
      };
      processError(err);
    } finally {
      setLoading({ isLoading: false, key: undefined });
    }
  }

  return {
    error,
    loading: loading.isLoading,
    loadingKey: loading.key,
    execute,
  };
}

export default useApiRequest;
