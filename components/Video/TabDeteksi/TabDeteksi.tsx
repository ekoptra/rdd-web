import { Card, Center, Group, Stack, Text, Loader } from "@mantine/core";
import { FC } from "react";
import NoData from "../../NoData";
import { useJobListQuery } from "../../../hooks/job-query.hook";
import LoadingChip from "../../LoadingChip";
import JobItem from "./JobItem";
import { useHover } from "@mantine/hooks";
import { IconReload } from "@tabler/icons-react";

interface TabDeteksiProps {
  videoId: String;
}

const TabDeteksi: FC<TabDeteksiProps> = ({ videoId }) => {
  const { hovered, ref } = useHover();

  const { query } = useJobListQuery(
    { idVideo: videoId },
    { enabled: !!videoId }
  );

  if (query.isLoading || !query.data) {
    return (
      <Center mt="md">
        <LoadingChip />
      </Center>
    );
  }

  const jobs = query.data.data;

  return (
    <Card>
      {jobs.length === 0 && <NoData message="Belum ada riwayat deteksi" />}

      {jobs.length > 0 && (
        <Stack>
          <Group justify="space-between">
            <Text c="gray" size="sm">
              Total Video: {jobs.length}
            </Text>
            <Text
              ref={ref}
              size="xs"
              style={{
                fontStyle: "italic",
                cursor: hovered && !query.isFetching ? "pointer" : ""
              }}
              c={hovered && !query.isFetching ? "blue" : "gray"}
            >
              {query.isFetching ? (
                <Group align="center" gap={4}>
                  <Loader color="blue" size="xs" type="dots" />{" "}
                  <span>Memuat</span>
                </Group>
              ) : (
                <Group align="center" gap={4} onClick={() => query.refetch()}>
                  <IconReload size={14} /> <span>Refresh</span>
                </Group>
              )}
            </Text>
          </Group>

          {jobs.map((job) => (
            <JobItem job={job} key={job.id} />
          ))}
        </Stack>
      )}
    </Card>
  );
};

export default TabDeteksi;
