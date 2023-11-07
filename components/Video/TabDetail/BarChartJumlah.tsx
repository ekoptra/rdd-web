import React, { FC } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Card, Text, Stack, Group, Accordion, Center } from "@mantine/core";
import { mapperRDDCode } from "../../../utils/other.util";
import { RDDCode } from "../../../types/response.type";
import { IconChartBar } from "@tabler/icons-react";

interface BarChartJumlahProps {
  totalPerClass: { code: string; count: number }[];
}

const BarChartJumlah: FC<BarChartJumlahProps> = ({ totalPerClass }) => {
  return (
    <Accordion chevronPosition="right" variant="contained">
      <Accordion.Item value="chart">
        <Center>
          <Accordion.Control icon={<IconChartBar size={16} />}>
            <Group gap="xs">
              <Text size="sm">Jumlah Deteksi</Text>
            </Group>
          </Accordion.Control>
        </Center>
        <Accordion.Panel>
          <Group
            style={{
              height: "400px"
            }}
          >
            {totalPerClass.length > 0 && (
              <ResponsiveBar
                data={totalPerClass}
                keys={["count"]}
                indexBy="code"
                margin={{ bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "category10" }}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legendPosition: "middle",
                  legendOffset: 32
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Jumlah",
                  legendPosition: "middle",
                  legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                tooltip={(data) => {
                  return (
                    <Card shadow="lg">
                      <Stack gap={0}>
                        <Text size="sm">
                          {data.data.code} -{" "}
                          {mapperRDDCode(data.data.code as RDDCode)}
                        </Text>
                        <Text size="sm">Jumlah {data.data.count}</Text>
                      </Stack>
                    </Card>
                  );
                }}
              />
            )}
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default React.memo(BarChartJumlah);
