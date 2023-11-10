import { FC, MouseEvent } from "react";
import { Video } from "../../types/response.type";
import { useHover } from "@mantine/hooks";
import {
  Stack,
  Group,
  Text,
  useMantineTheme,
  Card,
  Button
} from "@mantine/core";
import Link from "next/link";
import { IconVideo } from "@tabler/icons-react";
import { formatDate } from "../../utils/time.util";
import { modals } from "@mantine/modals";
import {
  VideoKeys,
  useVideoMutationDelete
} from "../../hooks/video-query.hook";
import { useQueryClient } from "@tanstack/react-query";

interface VideoItemProps {
  video: Video;
}

const VideoItem: FC<VideoItemProps> = ({ video }) => {
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();

  const queryClient = useQueryClient();

  const videoMutation = useVideoMutationDelete({
    id: video.id,
    method: "DELETE",
    options: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: VideoKeys.findAll });
      }
    }
  });

  const openDeleteModal = (event: any) => {
    event.preventDefault();

    modals.openContextModal({
      modal: "confirmDelete",
      title: "Hapus Video",
      centered: true,
      innerProps: {
        body: (
          <>
            Apakah kamu yakin untuk menghapus video <b>{video.name}</b>? Semua
            hasil deteksi juga akan ikut terhapus
          </>
        ),
        keyToDelete: video.name,
        onDelete: async () => {
          await videoMutation.mutateAsync({
            id: video.id
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
      component={Link}
      href={`/video/${video.id}`}
      withBorder
      style={{
        backgroundColor: hovered ? theme.colors.gray[0] : "",
        position: "relative"
      }}
    >
      <Group ref={ref}>
        <Group>
          <IconVideo />
          <Stack gap={0}>
            <Text>{video.name}</Text>
            <Text size="xs" c="gray" style={{ fontStyle: "italic" }}>
              Diunggah {formatDate(video.createdAt)}
            </Text>
          </Stack>
        </Group>

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
          <Button
            size="xs"
            color="red"
            onClick={(event) => openDeleteModal(event)}
          >
            Hapus
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

export default VideoItem;
