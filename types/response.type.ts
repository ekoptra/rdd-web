import { JobStatus } from "@prisma/client";

export type Response<T> = {
  data: T;
};

export type Video = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ResponseVideo = Response<Video[]>;

export type User = {
  id: string;
  name: string;
  idUser: string;
  createdAt: string;
  updatedAt: string;
};

export type ResponseUser = Response<User[]>;

export type Job = {
  id: string;
  status: JobStatus;
  progress: number;
  idVideo: string;
  result: any;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ResponseJob = Response<Job[]>;
