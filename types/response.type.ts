import { JobStatus } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export type Response<T> = {
  data: T;
};

export type Video = {
  id: string;
  name: string;
  path: string;
  idUser: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ResponseVideo = Response<{
  id: string;
  name: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
}>;
export type ResponseVideoList = Response<Video[]>;
// Job

export type Job = {
  id: string;
  name: string;
  status: JobStatus;
  modelName: string;
  idVideo: string;
  result: ResultType | null;
  showConf: boolean;
  showLabels: boolean;
  conf: number;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JobWithoutResult = Omit<Job, "result"> & {
  video: {
    id: string;
    name: string;
  };
};

export type ResponseJobList = Response<JobWithoutResult[]>;
export type ResponseJobDetail = Response<Job>;

export type ResultType = {
  fps: number;
  video_name: string;
  detection_time: number;
  total_frame: number;
  total_detection: number;
  sparse: Sparse[];
  per_second: PerSecond[];
};

export type Sparse = {
  hour: number;
  name: string;
  frame: number;
  minute: number;
  second: number;
  confidence: number;
  crop_file_name: string;
  second_to_total: number;
};

export type PerSecond = {
  hour: number;
  minute: number;
  second: number;
  second_to_total: number;
  total_detection: number;
  per_frame: PerFrame[];
};

export type PerFrame = {
  frame: number;
  total_detection: number;
  detections: Detection[];
};

export type RDDCode =
  | "D00"
  | "D01"
  | "D10"
  | "D11"
  | "D20"
  | "D21"
  | "D40"
  | "D43"
  | "D44";

export type Detection = {
  box: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  name: RDDCode;
  class: number;
  confidence: number;
  crop_file_name: string;
};
