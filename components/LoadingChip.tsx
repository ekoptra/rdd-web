import { Card, Group, Loader, Text } from "@mantine/core";
import React from "react";

type LoadingChipProps = {
  label?: string;
};

const LoadingChip: React.FC<LoadingChipProps> = ({ label = "Memuat" }) => {
  return (
    <Card
      pos="sticky"
      bottom={80}
      mx="auto"
      withBorder
      radius={"xl"}
      px={"xs"}
      py={4}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(2px)"
      }}
    >
      <Group align={"center"} gap="xs">
        <Loader color="blue" type="dots" />
        <Text size={"sm"}>{label}</Text>
      </Group>
    </Card>
  );
};

export default LoadingChip;
