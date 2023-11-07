import { FC } from "react";
import { Text, Center } from "@mantine/core";

interface NoDataProps {
  message?: string;
}

const NoData: FC<NoDataProps> = ({ message }) => {
  return (
    <Center>
      <Text c="gray" size="sm" style={{ fontStyle: "italic" }}>
        {message || "Data tidak ditemukan"}
      </Text>
    </Center>
  );
};

export default NoData;
