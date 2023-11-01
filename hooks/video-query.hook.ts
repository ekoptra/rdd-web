import {
  UndefinedInitialDataOptions,
  UseMutationOptions,
  useMutation,
  useQuery
} from "@tanstack/react-query";
import { ResponseVideo } from "../types/response.type";
import axios, { AxiosRequestConfig } from "axios";

export const VideoKeys = {
  findAll: ["video"]
};

type PropsQuery = Omit<
  UndefinedInitialDataOptions<ResponseVideo>,
  "queryKey" | "queryFn"
>;

export const useVideoQuery = (options?: PropsQuery) => {
  return {
    query: useQuery<ResponseVideo>({
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
