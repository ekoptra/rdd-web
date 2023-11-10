import { IconReload, IconTargetArrow } from "@tabler/icons-react";
import AppLayout from "../../components/AppLayout";
import { NextPageWithLayout } from "../../types/app-layout.type";
import { useJobListQuery } from "../../hooks/job-query.hook";
import { useSession } from "next-auth/react";
import LoadingChip from "../../components/LoadingChip";
import { Center, Group, Loader, Stack, Text } from "@mantine/core";
import NoData from "../../components/NoData";
import JobItem from "../../components/Job/JobItem";
import { useHover } from "@mantine/hooks";

const DetectionPage: NextPageWithLayout = () => {
  const { data } = useSession();
  const { hovered, ref } = useHover();

  const { query: jobQuery } = useJobListQuery({});

  if (jobQuery.isLoading) {
    return <LoadingChip />;
  }

  return (
    <Stack>
      {jobQuery.data?.data.length === 0 && (
        <Center>
          <NoData message="Belum ada daftar deteksi" />
        </Center>
      )}

      {jobQuery.data?.data.length !== 0 && (
        <Stack>
          <Group justify="space-between">
            <Text c="gray" size="sm">
              Total Deteksi: {jobQuery.data?.data.length}
            </Text>

            <Text
              ref={ref}
              size="xs"
              style={{
                fontStyle: "italic",
                cursor: hovered && !jobQuery.isFetching ? "pointer" : ""
              }}
              c={hovered && !jobQuery.isFetching ? "blue" : "gray"}
            >
              {jobQuery.isFetching ? (
                <Group align="center" gap={4}>
                  <Loader color="blue" size="xs" type="dots" />{" "}
                  <span>Memuat</span>
                </Group>
              ) : (
                <Group
                  align="center"
                  gap={4}
                  onClick={() => jobQuery.refetch()}
                >
                  <IconReload size={14} /> <span>Refresh</span>
                </Group>
              )}
            </Text>
          </Group>

          {jobQuery.data?.data.map((job) => (
            <JobItem job={job} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

DetectionPage.getLayout = (page) => {
  return (
    <AppLayout
      titleIcon={<IconTargetArrow size={28} />}
      title="Daftar Deteksi"
      breadcrumbs={[{ title: "Home", href: "/" }, { title: "Deteksi" }]}
    >
      {page}
    </AppLayout>
  );
};

export default DetectionPage;
