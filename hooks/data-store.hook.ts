import { create } from "zustand";

export type MenuVideo = "deteksi" | "history" | "detail" | "redirect";

interface DataStoreState {
  tabMenuVideo: MenuVideo;
  setTabMenuVideo: (menu: MenuVideo) => void;
  jobIdSelected: string;
  setJobIdSelected: (jobId: string) => void;
  isFloating: boolean;
  setIsFloating: (value: boolean) => void;
}

export const useDataStore = create<DataStoreState>()((set) => ({
  tabMenuVideo: "deteksi",
  setTabMenuVideo: (menu) => set((state) => ({ tabMenuVideo: menu })),
  jobIdSelected: "",
  setJobIdSelected: (jobId) => set((state) => ({ jobIdSelected: jobId })),
  isFloating: false,
  setIsFloating: (value) => set((state) => ({ isFloating: value }))
}));
