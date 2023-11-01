import { FC } from "react";
import { Video } from "../../types/response.type";
import { useHover } from "@mantine/hooks";
import { Stack, Group, Text, useMantineTheme, Card } from "@mantine/core";
import Link from "next/link";
import { IconVideo } from "@tabler/icons-react";

interface VideoItemProps {
  video: Video;
}

const VideoItem: FC<VideoItemProps> = ({ video }) => {
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();

  return (
    <Card
      py="md"
      px="lg"
      component={Link}
      href={`/video/${video.id}`}
      withBorder
      style={{ backgroundColor: hovered ? theme.colors.gray[0] : "" }}
    >
      <Group ref={ref}>
        <IconVideo />
        <Stack gap={0}>
          <Text>{video.name}</Text>
          <Text size="xs" c="gray" style={{ fontStyle: "italic" }}>
            Diupload pada: {video.createdAt}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
};

export default VideoItem;
