import { ContextModalProps } from "@mantine/modals";
import React, { FC, FormEvent, ReactNode } from "react";
import { Stack, Group, Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NotificationData, showNotification } from "@mantine/notifications";

export type ModalConfirmDeleteProps = ContextModalProps<{
  keyToDelete: string;
  body?: ReactNode;
  onDelete: () => Promise<void>;
  messageOnSuccess: NotificationData["message"];
}>;

const ModalConfirmDelete: FC<ModalConfirmDeleteProps> = ({
  context,
  id,
  innerProps
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    initialValues: {
      keyToDelete: ""
    },
    validate: {
      keyToDelete: (value) =>
        value === innerProps.keyToDelete
          ? null
          : "Yang anda ketikkan tidak sesuai"
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.onSubmit(async () => {
      setIsLoading(true);

      try {
        await innerProps.onDelete();

        showNotification({
          message: innerProps.messageOnSuccess
        });

        context.closeModal(id);
      } catch (error: any) {
        showNotification({
          message: "Gagal untuk melakukan aksi",
          color: "red"
        });
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <Stack gap={20}>
        {innerProps.body && <Text size="sm">{innerProps.body}</Text>}

        <TextInput
          description={
            <>
              Silahkan ketikkan <b>{innerProps.keyToDelete} </b> untuk
              menghapusnya
            </>
          }
          withAsterisk
          {...form.getInputProps("keyToDelete")}
        />

        <Group justify="flex-end">
          <Button
            color="gray"
            disabled={isLoading}
            onClick={() => context.closeModal(id)}
          >
            Batal
          </Button>

          <Button color="red" type="submit" loading={isLoading}>
            Hapus
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ModalConfirmDelete;
