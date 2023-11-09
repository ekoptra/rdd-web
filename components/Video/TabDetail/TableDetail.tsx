import React, { FC } from "react";
import { registerAllModules } from "handsontable/registry";
import { HotTable, HotColumnProps } from "@handsontable/react";
import { Settings } from "handsontable/plugins/contextMenu";

import "handsontable/dist/handsontable.full.min.css";
import { Job, RDDCode, Sparse } from "../../../types/response.type";
import { mapperRDDCode } from "../../../utils/other.util";
import {
  Accordion,
  ActionIcon,
  Center,
  Group,
  ScrollArea,
  Text
} from "@mantine/core";
import { IconDownload, IconTableMinus } from "@tabler/icons-react";

registerAllModules();
interface TableDetailProps {
  job: Job;
}

const TableDetail: FC<TableDetailProps> = ({ job }) => {
  const hotTableRef = React.useRef<HotTable>(null);

  const data = job.result?.sparse;

  const download = () => {
    const filename = `hasil_deteksi_${job.name}_${job.id}`;

    hotTableRef.current?.hotInstance
      ?.getPlugin("exportFile")
      ?.downloadFile("csv", {
        columnHeaders: true,
        filename
      });
  };

  const columns = [
    {
      title: "Kode",
      type: "text",
      data: "name",
      readOnly: true
    },
    {
      title: "Nama",
      type: "text",
      data: ({ name }: Sparse) => mapperRDDCode(name as RDDCode),
      readOnly: true
    },
    {
      title: "Conf",
      type: "numeric",
      data: ({ confidence }: Sparse) => Math.round(confidence * 1000) / 1000,
      readOnly: true
    },
    {
      title: "Jam",
      type: "numeric",
      data: "hour",
      readOnly: true
    },
    {
      title: "Menit",
      type: "numeric",
      data: "minute",
      readOnly: true
    },
    {
      title: "Detik",
      type: "numeric",
      data: "second",
      readOnly: true
    },
    {
      title: "Frame",
      type: "numeric",
      data: "frame",
      readOnly: true
    },
    {
      title: "Crop Image",
      type: "text",
      data: ({ crop_file_name }: Sparse) =>
        `${process.env.NEXT_PUBLIC_URL}/detections/${job.id}/${crop_file_name}`,
      readOnly: true
    }
  ];

  const dropdownMenu: Settings = [
    "filter_by_value",
    "filter_by_condition",
    "filter_action_bar"
  ];

  return (
    <Accordion chevronPosition="right" variant="contained" mb="md">
      <Accordion.Item value="table">
        <Center>
          <Accordion.Control icon={<IconTableMinus size={16} />}>
            <Group gap="xs">
              <Text size="sm">Tabel Hasil Deteksi</Text>
            </Group>
          </Accordion.Control>
          <ActionIcon
            size="lg"
            variant="subtle"
            color="gray"
            onClick={() => download()}
          >
            <IconDownload size="1rem" />
          </ActionIcon>
        </Center>
        <Accordion.Panel>
          <ScrollArea h="300px" offsetScrollbars scrollbarSize={4} bg="white">
            <HotTable
              ref={hotTableRef}
              manualColumnFreeze
              manualColumnResize
              dropdownMenu={dropdownMenu}
              columns={columns as HotColumnProps[]}
              data={data}
              columnSorting={true}
              rowHeaders={true}
              filters={true}
              colHeaders={true}
              beforeRefreshDimensions={() => false}
              height="auto"
              wordWrap={false}
              colWidths={[60, 250, 60, 60, 60, 60, 60, 500]}
              licenseKey="non-commercial-and-evaluation" // for non-commercial use only
            />
          </ScrollArea>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default React.memo(TableDetail);
