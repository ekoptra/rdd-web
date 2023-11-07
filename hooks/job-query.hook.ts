import {
  UndefinedInitialDataOptions,
  UseMutationOptions,
  useMutation,
  useQuery
} from "@tanstack/react-query";
import { ResponseJobDetail, ResponseJobList } from "../types/response.type";
import { Job } from "@prisma/client";

export const JobKeys = {
  findAll: ["job"],
  detail: ["job", "detail"]
};

type PropsMutation = {
  method: RequestInit["method"];
  options?: Omit<UseMutationOptions, "mutationFn">;
};

export const useJobMutation = <T = Job>({ method, options }: PropsMutation) => {
  return useMutation<T, any, any>({
    mutationFn: (data: any) =>
      fetch("/api/job", {
        method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((data) => data.json()),
    ...options
  });
};

type PropsQuery<T> = Omit<
  UndefinedInitialDataOptions<T>,
  "queryKey" | "queryFn"
>;

export const useJobListQuery = (
  filter: Record<string, any>,
  options?: PropsQuery<ResponseJobList>
) => {
  const filters = new URLSearchParams(filter).toString();
  return {
    query: useQuery<ResponseJobList>({
      queryKey: [JobKeys.findAll, filter],
      queryFn: () =>
        fetch(`/api/job?${filters}`, {
          method: "GET"
        }).then((res) => res.json()),
      ...options
    }),
    keys: [JobKeys.findAll, filter]
  };
};

export const useJobDetailQuery = (
  id: string,
  options?: PropsQuery<ResponseJobDetail>
) => {
  return {
    query: useQuery<ResponseJobDetail>({
      queryKey: [...JobKeys.detail, id],
      queryFn: () =>
        fetch(`/api/job/${id}`, {
          method: "GET"
        }).then((res) => res.json()),
      ...options
    }),
    keys: [...JobKeys.detail, id]
  };
};
