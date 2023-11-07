import React, { FC } from "react";
import { Job } from "../../../types/response.type";
import {
  Stack,
  Group,
  Title,
  Badge,
  Text,
  Box,
  CloseButton,
  Accordion,
  Center
} from "@mantine/core";
import {
  IconDownload,
  IconTableMinus,
  IconTargetArrow,
  IconWindowMaximize
} from "@tabler/icons-react";
import BadgeDetailJob from "../../BadgeDetailJob";
import { ActionIcon } from "@mantine/core";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";
import DetailTimestamp from "./DetailTimestamp";
import { formatDate } from "../../../utils/time.util";
import { useDataStore } from "../../../hooks/data-store.hook";
import BarChartJumlah from "./BarChartJumlah";
import dynamic from "next/dynamic";

const TableDetail = dynamic(() => import("./TableDetail"), {
  ssr: false
});

interface DetailItemProps {
  job: Job;
  reactPlayerRef: React.RefObject<ReactPlayer>;
}

const DetailItem: FC<DetailItemProps> = ({ job, reactPlayerRef }) => {
  const isFloating = useDataStore((state) => state.isFloating);
  const setIsFloating = useDataStore((state) => state.setIsFloating);

  const nodeRef = React.useRef<HTMLDivElement>(null);
  const [positionX, setPositionX] = React.useState(0);
  const [positionY, setPositionY] = React.useState(0);

  React.useEffect(() => {
    if (isFloating) {
      setPositionY(1050);
      setPositionX(-350);
    }
  }, []);

  const totalPerClass = React.useMemo(() => {
    const perClassObject = job.result?.sparse.reduce<Record<string, number>>(
      (prev, current) => {
        const key = `${current.name}`;
        if (key in prev) {
          prev[key] += 1;
        } else {
          prev[key] = 0;
        }
        return prev;
      },
      {}
    );

    const perClassArray: { code: string; count: number }[] = [];
    for (const cls in perClassObject) {
      perClassArray.push({
        code: cls,
        count: perClassObject[cls]
      });
    }

    perClassArray.sort((a, b) => b.count - a.count);

    return perClassArray;
  }, [job.result]);

  const BarChartJumlahComponent = React.useMemo(
    () => <BarChartJumlah totalPerClass={totalPerClass} />,
    [totalPerClass]
  );

  const table = React.useMemo(() => <TableDetail job={job} />, [job]);

  return (
    <Stack>
      {isFloating && BarChartJumlahComponent}

      {job.result && isFloating && <>{table}</>}

      <Group
        pos={isFloating ? "fixed" : "relative"}
        style={{ top: isFloating ? -1000 : 0, zIndex: isFloating ? 500 : 0 }}
      >
        <Draggable
          nodeRef={nodeRef}
          handle=".handle"
          defaultPosition={{
            x: 0,
            y: 0
          }}
          onStop={(e, data) => {
            setPositionX(data.x);
            setPositionY(data.y);
          }}
          position={{ x: positionX, y: positionY }}
          disabled={!isFloating}
        >
          <Stack
            ref={nodeRef}
            gap={0}
            style={{
              boxShadow: isFloating
                ? "-1px -1px 40px -12px rgba(28,28,28,1)"
                : "",
              width: "100%"
            }}
          >
            <Box w="100%" bg="white">
              <Group p="md" justify="space-between">
                <Stack
                  gap={8}
                  className="handle"
                  style={{ cursor: isFloating ? "grab" : "auto" }}
                >
                  <Group>
                    <IconTargetArrow />
                    <Stack gap={4}>
                      <Title order={4}>{job.name}</Title>
                      <Badge
                        size="sm"
                        variant="gradient"
                        gradient={{ from: "blue", to: "teal", deg: 90 }}
                      >
                        {job.modelName}
                      </Badge>
                    </Stack>
                  </Group>

                  <Stack gap={0}>
                    <Text>
                      {job.result?.fps} FPS - {job.result?.total_frame} Frame -
                      Waktu Deteksi:{" "}
                      {Math.round(job.result?.detection_time || 0)}s
                    </Text>

                    {job.startedAt && job.finishedAt && (
                      <Text size="xs" c="gray">
                        {formatDate(job.startedAt)} -{" "}
                        {formatDate(job.finishedAt)}
                      </Text>
                    )}
                  </Stack>

                  <Group gap="xs">
                    <BadgeDetailJob job={job} />
                    <Badge variant="dot" size="sm">
                      {job.result?.total_detection} Deteksi
                    </Badge>
                  </Group>
                </Stack>

                {isFloating ? (
                  <CloseButton
                    onClick={() => {
                      setIsFloating(false);
                      setPositionY(0);
                      setPositionX(0);
                    }}
                  />
                ) : (
                  <ActionIcon
                    variant="subtle"
                    onClick={() => {
                      setIsFloating(true);
                      setPositionY(1050);
                      setPositionX(-350);
                    }}
                  >
                    <IconWindowMaximize />
                  </ActionIcon>
                )}
              </Group>
            </Box>

            <Stack gap="md">
              {!isFloating && BarChartJumlahComponent}

              {job.result && !isFloating && <>{table}</>}
            </Stack>

            <DetailTimestamp
              job={job}
              reactPlayerRef={reactPlayerRef}
              key={job.id}
            />
          </Stack>
        </Draggable>
      </Group>
    </Stack>
  );
};

export default DetailItem;
