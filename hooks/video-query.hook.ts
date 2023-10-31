import { useQuery } from "@tanstack/react-query";
import { ResponseVideo } from "../types/response.type";

export const VideoKeys = {
  findAll: ["video"]
};

export const useVideoQuery = () => {
  return {
    query: useQuery<ResponseVideo>({
      queryKey: VideoKeys.findAll,
      queryFn: () =>
        fetch("/api/video", {
          method: "GET"
        }).then((res) => res.json())
    }),
    keys: VideoKeys.findAll
  };
};
