import React, { FC } from "react";
import {
  useJobDetailQuery,
  useJobListQuery
} from "../../../hooks/job-query.hook";
import {
  Card,
  Center,
  Group,
  Stack,
  Text,
  Loader,
  Select
} from "@mantine/core";
import { useForm } from "@mantine/form";
import LoadingChip from "../../LoadingChip";
import DetailItem from "./DetailItem";
import { useDataStore } from "../../../hooks/data-store.hook";
import ReactPlayer from "react-player";
import NoData from "../../NoData";

interface TabDetailProps {
  videoId: String;
  setSrcVideo: React.Dispatch<React.SetStateAction<string>>;
  reactPlayerRef: React.RefObject<ReactPlayer>;
}

const TabDetail: FC<TabDetailProps> = ({
  videoId,
  setSrcVideo,
  reactPlayerRef
}) => {
  const tabMenuVideo = useDataStore((state) => state.tabMenuVideo);
  const jobIdSelected = useDataStore((state) => state.jobIdSelected);

  const { query } = useJobListQuery(
    { idVideo: videoId, status: "DETECTED" },
    { enabled: !!videoId }
  );

  const form = useForm<{ jobId: string }>({
    initialValues: {
      jobId: ""
    }
  });

  React.useEffect(() => {
    form.setFieldValue("jobId", jobIdSelected);
  }, [jobIdSelected]);

  const { query: queryDetail } = useJobDetailQuery(form.values.jobId, {
    enabled: form.values.jobId !== "",
    refetchOnWindowFocus: false
  });

  const jobDetail = queryDetail.data?.data;

  React.useEffect(() => {
    if (jobDetail?.result && tabMenuVideo === "detail") {
      setSrcVideo(
        `/detections/${jobDetail.id}/${jobDetail.result.video_name}.mp4`
      );
    }
  }, [JSON.stringify(jobDetail?.result), tabMenuVideo]);

  return (
    <Card>
      {query.data && query.data?.data.length > 0 ? (
        <Stack>
          <Select
            searchable
            placeholder="Pilih Hasil Deteksi"
            data={
              query.data
                ? query.data.data.map((job) => ({
                    value: job.id,
                    label: `[${job.modelName}] ${job.name} (Conf: ${
                      Math.round(job.conf * 10) / 10
                    })`
                  }))
                : []
            }
            {...form.getInputProps("jobId")}
          />

          {queryDetail.isFetching && (
            <Center mr="md">
              <LoadingChip />
            </Center>
          )}

          {!queryDetail.isFetching && jobDetail && (
            <DetailItem job={jobDetail} reactPlayerRef={reactPlayerRef} />
          )}
        </Stack>
      ) : (
        <NoData message="Belum ada hasil deteksi yang selesai" />
      )}
    </Card>
  );
};

export default TabDetail;
