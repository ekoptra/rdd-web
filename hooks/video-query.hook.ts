import {
  UndefinedInitialDataOptions,
  UseMutationOptions,
  useMutation,
  useQuery
} from "@tanstack/react-query";
import { ResponseVideo, ResponseVideoList } from "../types/response.type";
import axios, { AxiosRequestConfig } from "axios";

export const VideoKeys = {
  findAll: ["video"],
  detail: ["video", "detail"]
};

type PropsQuery<T> = Omit<
  UndefinedInitialDataOptions<T>,
  "queryKey" | "queryFn"
>;

export const useVideoQuery = (options?: PropsQuery<ResponseVideoList>) => {
  return {
    query: useQuery<ResponseVideoList>({
      queryKey: VideoKeys.findAll,
      queryFn: () =>
        fetch("/api/video", {
          method: "GET"
        }).then((res) => res.json()),
      ...options
    }),
    keys: VideoKeys.findAll
  };
};

export const useVideoQueryDetail = (
  id: string,
  options?: PropsQuery<ResponseVideo>
) => {
  return {
    query: useQuery<ResponseVideo>({
      queryKey: [...VideoKeys.detail, id],
      queryFn: () =>
        fetch(`/api/video/${id}`, {
          method: "GET"
        }).then((res) => res.json()),
      ...options
    }),
    keys: [...VideoKeys.detail, id]
  };
};

type PropsMutation = {
  options?: Omit<UseMutationOptions, "mutationFn">;
  axiosConfig?: AxiosRequestConfig;
};

export const useVideoUpload = <T = ResponseVideo>({
  options,
  axiosConfig
}: PropsMutation) => {
  return useMutation<T, any, any>({
    mutationFn: (data: any) =>
      axios.post("/api/video", data, axiosConfig).then((res) => res.data),
    ...options
  });
};
