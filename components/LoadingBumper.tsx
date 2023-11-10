import { Group, Image, Loader, Stack } from "@mantine/core";
import { FC } from "react";

interface LoadingBumperProps {}

const LoadingBumper: FC<LoadingBumperProps> = ({}) => {
  return (
    <Group
      pos="fixed"
      style={{ top: 0, bottom: 0, left: 0, right: 0 }}
      justify="center"
      align="center"
    >
      <Stack gap="sm" justify="center" align="center">
        <Image src="/logo.png" alt="Logo PUPR" height={100} fit="contain" />
        <Loader color="blue" size="lg" />
      </Stack>
    </Group>
  );
};

export default LoadingBumper;
