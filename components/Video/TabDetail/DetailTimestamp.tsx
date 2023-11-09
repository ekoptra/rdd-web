import React, { FC } from "react";
import { Detection, Job } from "../../../types/response.type";
import { Stack, Group, Text, ScrollArea } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerSkipForwardFilled
} from "@tabler/icons-react";
import { Accordion, ActionIcon, Center } from "@mantine/core";
import { mapperRDDCode, zeroPad } from "../../../utils/other.util";
import ImageGallery from "react-image-gallery";
import ReactPlayer from "react-player";

interface DetailTimestampProps {
  job: Job;
  reactPlayerRef: React.RefObject<ReactPlayer>;
}

const DetailTimestamp: FC<DetailTimestampProps> = ({ job, reactPlayerRef }) => {
  return (
    <ScrollArea h="75vh" offsetScrollbars scrollbarSize={4} bg="white">
      <Accordion chevronPosition="right" variant="contained">
        {job.result?.per_second.map((s) => {
          const time = `${zeroPad(s.hour, 2)}:${zeroPad(s.minute, 2)}:${zeroPad(
            s.second,
            2
          )}`;

          const detections = s.per_frame.reduce<
            (Detection & { frame: number })[]
          >(
            (prev, frame) => [
              ...prev,
              ...frame.detections.map((d) => ({
                ...d,
                frame: frame.frame
              }))
            ],
            []
          );

          return (
            <Accordion.Item value={time} key={time}>
              <Center>
                <Accordion.Control
                  icon={<IconPlayerPlay size={16} />}
                  disabled={detections.length === 0}
                >
                  <Group gap="xs">
                    <Text size="sm">{time}</Text>
                    <Text size="sm">-</Text>
                    <Text size="xs" c="gray" style={{ fontStyle: "italic" }}>
                      {s.total_detection > 0
                        ? `Jumlah Deteksi ${s.total_detection}`
                        : "Tidak ada terdeteksi"}
                    </Text>
                  </Group>
                </Accordion.Control>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  color="gray"
                  onClick={() =>
                    reactPlayerRef.current?.seekTo(s.second_to_total)
                  }
                >
                  <IconPlayerSkipForwardFilled size="1rem" />
                </ActionIcon>
              </Center>
              <Accordion.Panel>
                <ImageGallery
                  // @ts-expect-error: Let's ignore a compile error like this unreachable code
                  items={detections.map((d, i) => ({
                    original: `/detections/${job.id}/${d.crop_file_name}`,
                    thumbnail: `/detections/${job.id}/${d.crop_file_name}`,
                    thumbnailLabel: `${i + 1}. ${d.name}`,
                    originalTitle: "Cobaa",
                    description: (
                      <Stack gap={0}>
                        <Text size="sm">{`${d.name} - Confidence: ${
                          Math.round(d.confidence * 100) / 100
                        } - Frame ${d.frame}`}</Text>
                        <Text size="sm">{mapperRDDCode(d.name)}</Text>
                      </Stack>
                    )
                  }))}
                  lazyLoad={true}
                  thumbnailPosition="left"
                  onSlide={(index) => {
                    const selected = detections[index];
                    reactPlayerRef.current?.seekTo(
                      s.second_to_total +
                        selected.frame /
                          (job.result ? job.result.fps + 0.0001 : 0.0001)
                    );
                  }}
                />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </ScrollArea>
  );
};

export default React.memo(DetailTimestamp);
