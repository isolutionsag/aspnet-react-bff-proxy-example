import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

export const useErrorHandledQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, AxiosError, TData, TQueryKey>,
    "initialData"
  > & { initialData?: () => undefined },
  customErrorMessage?: string
): UseQueryResult<TData, AxiosError> => {
  const { enqueueSnackbar } = useSnackbar();
  const query = useQuery(options);

  const error = query.error;

  useEffect(() => {
    if (error) {
      enqueueSnackbar(customErrorMessage || error.message, {
        variant: "error",
      });
    }
  }, [customErrorMessage, enqueueSnackbar, error]);

  return query;
};
