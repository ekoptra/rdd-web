import React, { FC, useState } from "react";
import { modals } from "@mantine/modals";
import {
  Button,
  Stack,
  Group,
  rem,
  Text,
  useMantineTheme,
  TextInput
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconPhoto, IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { VideoKeys, useVideoUpload } from "../../hooks/video-query.hook";
import { AxiosRequestConfig } from "axios";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

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
  const form = useForm<{ name: string }>({
    initialValues: {
      name: ""
    },
    validate: {
      name: (value) => (value.length === 0 ? "Nama tidak boleh kosong" : null)
    }
  });

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [progress, setProgress] = useState(0);

  const client = useQueryClient();

  const axiosConfig: AxiosRequestConfig = {
    onUploadProgress: function (progressEvent) {
      const percentComplete = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total ?? 0.00001)
      );

      setProgress(percentComplete);
    }
  };

  const uploadMutation = useVideoUpload({
    axiosConfig,
    options: {
      onSuccess(value) {
        console.log(value);
        modals.closeAll();
        notifications.show({
          message: "Video berhasil ditambahkan"
        });
        client.invalidateQueries({ queryKey: VideoKeys.findAll });
      }
    }
  });

  const handleSubmit = async () => {
    const result = form.validate();
    if (!result.hasErrors) {
      const data = new FormData();

      data.append("file", files[0]);
      data.append("name", form.values.name);

      try {
        await uploadMutation.mutateAsync(data);
      } catch (error) {
      } finally {
        setProgress(0);
      }
    }
  };

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <video
        controls
        style={{ maxHeight: "75vh", border: "1px solid gray" }}
        key={index}
      >
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
      {files.length === 0 && (
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
      )}

      {files.length !== 0 && (
        <Stack>
          {previews}

          <TextInput
            label="Nama Video"
            withAsterisk
            {...form.getInputProps("name")}
          />
        </Stack>
      )}

      <Group align="center" justify="space-between">
        <Text size="xs" c="gray" style={{ fontStyle: "italic" }}>
          {progress > 0 && <>Upload video: {progress}%</>}
        </Text>

        <Group>
          <Button onClick={() => modals.closeAll()} mt="md" color="gray">
            Batal
          </Button>
          {files.length !== 0 && (
            <Button
              onClick={() => handleSubmit()}
              mt="md"
              color="blue"
              loading={uploadMutation.isPending}
            >
              Tambah
            </Button>
          )}
        </Group>
      </Group>
    </Stack>
  );
};

export default ModalUploadVideo;
