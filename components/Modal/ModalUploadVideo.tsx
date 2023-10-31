import React, { FC } from "react";
import { modals } from "@mantine/modals";
import {
  Button,
  Stack,
  Group,
  rem,
  Text,
  useMantineTheme
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

export const openModalUploadVideo = () => {
  modals.open({
    size: "xl",
    title: "Tambah Video Baru",
    children: <ModalUploadVideo />
  });
};

interface ModalUploadVideoProps {}

const ModalUploadVideo: FC<ModalUploadVideoProps> = ({}) => {
  const theme = useMantineTheme();
  const [files, setFiles] = React.useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <video controls>
        <source
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
          type="video/mp4"
        />
      </video>
    );
  });

  return (
    <Stack>
      <Dropzone onDrop={setFiles} accept={["video/mp4"]}>
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
          bg={theme.colors.gray[0]}
        >
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)"
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-dimmed)"
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag video atau klik untuk memilih file
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Pastikan video dalam format .mp4
            </Text>
          </div>
        </Group>
      </Dropzone>

      {previews}

      <Group align="center" justify="flex-end">
        <Button onClick={() => modals.closeAll()} mt="md" color="gray">
          Batal
        </Button>
      </Group>
    </Stack>
  );
};

export default ModalUploadVideo;
