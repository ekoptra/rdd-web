import { FC } from "react";
import { JobKeys, useJobMutation } from "../../hooks/job-query.hook";
import { useForm } from "@mantine/form";
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  TextInput
} from "@mantine/core";
import { MODEL_LIST } from "../../constants/other.constant";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

interface ModalAddJobProps {
  videoId: string;
}

type FormType = {
  model: string;
  name: string;
  showConf: boolean;
  showLabels: boolean;
  conf: number;
};

export const openModalAddJob = (videoId: string) => {
  modals.open({
    size: "xl",
    title: "Deteksi Video",
    children: <ModalAddJob videoId={videoId} />
  });
};

const ModalAddJob: FC<ModalAddJobProps> = ({ videoId }) => {
  const client = useQueryClient();

  const jobMutation = useJobMutation({
    method: "POST",
    options: {
      onSuccess() {
        modals.closeAll();
        notifications.show({
          message: "Task Deteksi Berhasil Ditambahkan"
        });
        client.invalidateQueries({ queryKey: JobKeys.findAll });
      }
    }
  });

  const form = useForm<FormType>({
    initialValues: {
      model: "YOLOv8-Medium",
      name: "",
      showConf: true,
      showLabels: true,
      conf: 0.2
    },
    validate: {
      model: (value) => (value.length === 0 ? "Silahkan pilih model" : null),
      name: (value) => (value.length === 0 ? "Nama tidak boleh kosong" : null)
    }
  });

  const handleAddJob = async () => {
    const result = form.validate();
    if (!result.hasErrors) {
      await jobMutation.mutateAsync({
        model: form.values.model,
        name: form.values.name,
        showConf: form.values.showConf,
        showLabels: form.values.showLabels,
        conf: form.values.conf,
        videoId
      });
    }
  };

  return (
    <Stack>
      <TextInput label="Nama" withAsterisk {...form.getInputProps("name")} />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Select
          withAsterisk
          label="Pilih Model"
          description="Silahkan pilih model yang ingin digunakan untuk mendeteksi video tersebut"
          data={MODEL_LIST}
          {...form.getInputProps("model")}
          styles={{
            dropdown: {
              zIndex: 10000
            }
          }}
        />

        <NumberInput
          withAsterisk
          label="Confidence Threshold"
          description="Jika confidence hasil deteksi melebihi threshold maka deteksi ditampilkan di video hasil deteksi"
          {...form.getInputProps("conf")}
          step={0.1}
          min={0.1}
          max={0.9}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Checkbox
          label="Nilai Confidence Ditampilkan di Video"
          {...form.getInputProps("showConf", { type: "checkbox" })}
        />

        <Checkbox
          label="Label Ditampilkan di Video"
          {...form.getInputProps("showLabels", { type: "checkbox" })}
        />
      </SimpleGrid>

      <Group justify="flex-end">
        <Button
          onClick={() => modals.closeAll()}
          disabled={jobMutation.isPending}
          color="gray"
        >
          Batal
        </Button>

        <Button onClick={() => handleAddJob()} loading={jobMutation.isPending}>
          Deteksi
        </Button>
      </Group>
    </Stack>
  );
};

export default ModalAddJob;
