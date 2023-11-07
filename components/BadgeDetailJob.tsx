import { FC } from "react";
import { JobWithoutResult } from "../types/response.type";
import { Badge, Tooltip } from "@mantine/core";

interface BadgeDetailJobProps {
  job: JobWithoutResult;
}

const BadgeDetailJob: FC<BadgeDetailJobProps> = ({ job }) => {
  return (
    <>
      <Badge variant="dot" size="sm" color="cyan">
        Conf {Math.round(job.conf * 10) / 10}
      </Badge>
      {job.showLabels && (
        <Tooltip label="Video Hasil Deteksi Memuat Label">
          <Badge size="sm" variant="dot" color="yellow">
            With Labels
          </Badge>
        </Tooltip>
      )}

      {job.showConf && (
        <Tooltip label="Video Hasil Deteksi Memuat Nilai Confidence">
          <Badge size="sm" variant="dot" color="orange">
            With Conf
          </Badge>
        </Tooltip>
      )}
    </>
  );
};

export default BadgeDetailJob;
