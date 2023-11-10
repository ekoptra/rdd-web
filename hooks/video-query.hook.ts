import {
  UndefinedInitialDataOptions,
  UseMutationOptions,
  useMutation,
  useQuery
} from "@tanstack/react-query";
import {
  ResponseVideo,
  ResponseVideoList,
  Video
} from "../types/response.type";
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

type PropsMutationUpload = {
  options?: Omit<UseMutationOptions, "mutationFn">;
  axiosConfig?: AxiosRequestConfig;
};

export const useVideoUpload = <T = ResponseVideo>({
  options,
  axiosConfig
}: PropsMutationUpload) => {
  return useMutation<T, any, any>({
    mutationFn: (data: any) =>
      axios.post("/api/video", data, axiosConfig).then((res) => res.data),
    ...options
  });
};

type PropsMutationDelete = {
  id: string;
  method: RequestInit["method"];
  options?: Omit<UseMutationOptions, "mutationFn">;
};

export const useVideoMutationDelete = <T = Video>({
  id,
  method,
  options
}: PropsMutationDelete) => {
  return useMutation<T, any, any>({
    mutationFn: (data: any) =>
      fetch(`/api/video/${id}`, {
        method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((data) => data.json()),
    ...options
  });
};
