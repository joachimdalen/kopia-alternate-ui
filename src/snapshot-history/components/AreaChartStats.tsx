import { AreaChart, type AreaChartProps } from "@mantine/charts";
import { Card, Group, LoadingOverlay, Text } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import classes from "./AreaChartStats.module.css";

type Props = {
  title: string;
  icon: typeof IconHome;
  loading?: boolean;
} & Pick<AreaChartProps, "data" | "dataKey" | "series" | "valueFormatter">;

export default function AreaChartStats({ data, title, icon, dataKey, series, valueFormatter, loading }: Props) {
  return (
    <Card shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs" className={classes.title}>
        <Group gap="xs">
          <IconWrapper icon={icon} size={18} />
          <Text fw={500}>{title}</Text>
        </Group>
      </Card.Section>
      <Card.Section pt="xs" px="xs" className={classes.body}>
        <LoadingOverlay visible={loading} />
        <AreaChart
          h={200}
          data={data}
          dataKey={dataKey}
          withLegend
          legendProps={{ verticalAlign: "bottom", height: 50 }}
          series={series}
          gridAxis="x"
          gridProps={{ xAxisId: "bottom", yAxisId: "left" }}
          curveType="linear"
          valueFormatter={valueFormatter}
        />
      </Card.Section>
    </Card>
  );
}
