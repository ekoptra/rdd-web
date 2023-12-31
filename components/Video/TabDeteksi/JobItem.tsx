import { FC } from "react";
import { JobWithoutResult } from "../../../types/response.type";
import {
  Card,
  Group,
  Stack,
  useMantineTheme,
  Text,
  Grid,
  Badge,
  Button
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { formatDate } from "../../../utils/time.util";
import { useDataStore } from "../../../hooks/data-store.hook";
import BadgeDetailJob from "../../BadgeDetailJob";
import { modals } from "@mantine/modals";
import { JobKeys, useJobMutation } from "../../../hooks/job-query.hook";
import { useQueryClient } from "@tanstack/react-query";

interface JobItemProps {
  job: JobWithoutResult;
}

const JobItem: FC<JobItemProps> = ({ job }) => {
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();
  const setTabMenuVideo = useDataStore((state) => state.setTabMenuVideo);
  const setJobIdSelected = useDataStore((state) => state.setJobIdSelected);
  const jobIdSelected = useDataStore((state) => state.jobIdSelected);

  const queryClient = useQueryClient();

  const jobMutation = useJobMutation({
    method: "DELETE",
    options: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [JobKeys.findAll] });
        if (job.id === jobIdSelected) {
          setJobIdSelected("");
        }
      }
    }
  });

  const openDeleteModal = () => {
    modals.openContextModal({
      modal: "confirmDelete",
      title: "Hapus Deteksi",
      centered: true,
      innerProps: {
        body: (
          <>
            Apakah kamu yakin untuk menghapus deteksi <b>{job.name}</b>?
            {job.status === "DETECTED" &&
              " Semua hasil deteksi akan terhapus dan tidak dapat dikembalikan"}
          </>
        ),
        keyToDelete: job.name,
        onDelete: async () => {
          await jobMutation.mutateAsync({
            id: job.id
          });
        },
        messageOnSuccess: "Deteksi Berhasil di Hapus"
      }
    });
  };

  return (
    <Card
      py="md"
      px="lg"
      withBorder
      style={{
        backgroundColor: hovered ? theme.colors.gray[0] : "",
        position: "relative"
      }}
      ref={ref}
    >
      <Grid align="center">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap={0}>
            <Text>{job.name}</Text>
            <Text
              lineClamp={1}
              size="xs"
              c="gray"
              style={{ fontStyle: "italic" }}
            >
              Dibuat pada {formatDate(job.createdAt)}
            </Text>
            <Group gap="xs" mt="sm">
              <BadgeDetailJob job={job} />
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Badge
            size="sm"
            variant="gradient"
            gradient={{ from: "blue", to: "teal", deg: 90 }}
          >
            {job.modelName}
          </Badge>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Group justify="flex-end" pr="xl">
            <Badge
              size="md"
              variant="light"
              color={
                job.status === "DETECTED"
                  ? "green"
                  : job.status === "PENDING"
                  ? "gray"
                  : job.status === "DETECTING"
                  ? "yellow"
                  : "red"
              }
            >
              {job.status}
            </Badge>
          </Group>
        </Grid.Col>
      </Grid>

      <Group
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          visibility: hovered ? "inherit" : "hidden"
        }}
        gap="xs"
        justify="flex-end"
        pr="xl"
      >
        {job.status === "DETECTED" && (
          <Button
            size="xs"
            onClick={() => {
              setTabMenuVideo("detail");
              setJobIdSelected(job.id);
            }}
          >
            Detail
          </Button>
        )}

        <Button size="xs" color="red" onClick={() => openDeleteModal()}>
          Hapus
        </Button>
      </Group>
    </Card>
  );
};

export default JobItem;
