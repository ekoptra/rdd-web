import { IconVideo } from "@tabler/icons-react";
import AppLayout from "../../components/AppLayout";
import { NextPageWithLayout } from "../../types/app-layout.type";
import LoadingChip from "../../components/LoadingChip";
import { Stack, Text, Center, Button, Group, Card } from "@mantine/core";
import { useVideoQuery } from "../../hooks/video-query.hook";
import { openModalUploadVideo } from "../../components/Modal/ModalUploadVideo";
import VideoItem from "../../components/Video/VideoItem";
import NoData from "../../components/NoData";

const ListVideoPage: NextPageWithLayout = () => {
  const { query: videoQuery } = useVideoQuery();

  if (videoQuery.isLoading) {
    return <LoadingChip />;
  }

  return (
    <Stack>
      {videoQuery.data?.data.length === 0 && (
        <Stack align="center" justify="center">
          <NoData message="Video tidak ditemukan" />

          <Button
            variant="subtle"
            color="blue"
            onClick={() => openModalUploadVideo()}
          >
            Tambah Video
          </Button>
        </Stack>
      )}

      {videoQuery.data?.data.length !== 0 && (
        <Stack>
          <Group justify="space-between">
            <Text c="gray" size="sm">
              Total Video: {videoQuery.data?.data.length}
            </Text>

            <Button
              variant="subtle"
              color="blue"
              onClick={() => openModalUploadVideo()}
            >
              Tambah Video
            </Button>
          </Group>
          {videoQuery.data?.data.map((video) => (
            <VideoItem video={video} key={video.id} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

ListVideoPage.getLayout = (page) => {
  return (
    <AppLayout
      titleIcon={<IconVideo size={28} />}
      title="Daftar Video"
      breadcrumbs={[{ title: "Home", href: "/" }, { title: "Video" }]}
    >
      {page}
    </AppLayout>
  );
};

export default ListVideoPage;
