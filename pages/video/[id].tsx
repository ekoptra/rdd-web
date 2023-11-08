import { GetServerSideProps } from "next";
import AppLayout from "../../components/AppLayout";
import { NextPageWithLayout } from "../../types/app-layout.type";
import { useVideoQueryDetail } from "../../hooks/video-query.hook";
import {
  Avatar,
  Center,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Button,
  Tabs
} from "@mantine/core";
import LoadingChip from "../../components/LoadingChip";
import { formatDate } from "../../utils/time.util";
import { IconListDetails, IconTargetArrow } from "@tabler/icons-react";
import { openModalAddJob } from "../../components/Modal/ModalAddJob";
import React from "react";
import TabDeteksi from "../../components/Video/TabDeteksi/TabDeteksi";
import { MenuVideo, useDataStore } from "../../hooks/data-store.hook";
import TabDetail from "../../components/Video/TabDetail/TabDetail";
import { useRef } from "react";
import ReactPlayer from "react-player/lazy";

type Props = {
  videoId: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (contex) => {
  const videoId = contex.query["id"] as string;

  return {
    props: {
      videoId
    }
  };
};

const DetailVideoPage: NextPageWithLayout<Props> = ({ videoId }) => {
  const { query } = useVideoQueryDetail(videoId, { enabled: !!videoId });
  const tabMenuVideo = useDataStore((state) => state.tabMenuVideo);
  const setTabMenuVideo = useDataStore((state) => state.setTabMenuVideo);
  const setJobIdSelected = useDataStore((state) => state.setJobIdSelected);

  const [srcVideo, setSrcVideo] = React.useState<string>("");
  const reactPlayerRef = useRef<ReactPlayer>(null);

  const video = query.data?.data;

  React.useEffect(() => {
    if (tabMenuVideo !== "detail" && video) {
      setSrcVideo(`/videos/${video.path}`);
    }
  }, [tabMenuVideo, video]);

  React.useEffect(() => {
    setTabMenuVideo("deteksi");
    setJobIdSelected("");
  }, [setTabMenuVideo, setJobIdSelected]);

  if (query.isLoading || !query.data) {
    return (
      <Center>
        <LoadingChip />
      </Center>
    );
  }

  return (
    <Grid columns={12}>
      <Grid.Col>
        <Stack gap={5}>
          <Title order={2}>{video?.name}</Title>
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <Avatar color="blue" radius="sm" size="sm" />
              <Group gap={0}>
                <Text size="xs" c="gray">
                  {video?.user.name} -{" "}
                </Text>
                <Text size="xs" style={{ fontStyle: "italic" }} c="gray">
                  Diunggah {video && formatDate(video.createdAt)}
                </Text>
              </Group>
            </Group>

            <Button
              variant="subtle"
              color="blue"
              onClick={() => openModalAddJob(video?.id || "")}
            >
              Deteksi Video
            </Button>
          </Group>
        </Stack>
      </Grid.Col>

      <Grid.Col span={12}>
        <ReactPlayer
          ref={reactPlayerRef}
          url={srcVideo}
          controls={true}
          width="100%"
          height="auto"
        />
      </Grid.Col>

      <Grid.Col>
        <Tabs
          value={tabMenuVideo}
          onChange={(value) => setTabMenuVideo(value as MenuVideo)}
        >
          <Tabs.List>
            <Tabs.Tab
              value="deteksi"
              leftSection={<IconTargetArrow size={16} />}
            >
              List Deteksi
            </Tabs.Tab>

            <Tabs.Tab
              value="detail"
              leftSection={<IconListDetails size={16} />}
            >
              Detail
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="deteksi">
            <TabDeteksi videoId={video?.id || ""} />
          </Tabs.Panel>

          <Tabs.Panel value="detail">
            <TabDetail
              videoId={videoId}
              setSrcVideo={setSrcVideo}
              reactPlayerRef={reactPlayerRef}
            />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
};

DetailVideoPage.getLayout = (page) => {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "Home", href: "/" },
        { title: "Video", href: "/video" },
        { title: "Detail" }
      ]}
    >
      {page}
    </AppLayout>
  );
};

export default DetailVideoPage;
