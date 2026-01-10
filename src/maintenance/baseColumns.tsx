import { Trans } from "@lingui/react/macro";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import type { DataTableColumn } from "mantine-datatable";
import FormattedDate from "../core/FormattedDate";
import IconWrapper from "../core/IconWrapper";
import type { RunInfo } from "../core/types";

export const baseColumns: DataTableColumn<RunInfo>[] = [
  {
    accessor: "success",
    textAlign: "center",
    width: 100,
    title: <Trans>Success</Trans>,
    render: (item: RunInfo) =>
      item.success ? (
        <IconWrapper icon={IconCircleCheckFilled} size={18} color="green" />
      ) : (
        <IconWrapper icon={IconCircleXFilled} size={18} color="red" />
      )
  },
  {
    accessor: "start",
    title: <Trans>Start</Trans>,
    render: (item: RunInfo) => item.start && <FormattedDate value={item.start} />
  },
  {
    accessor: "end",
    title: <Trans>End</Trans>,
    render: (item: RunInfo) => item.end && <FormattedDate value={item.end} />
  }

  //   {
  //     accessor: "extra.0.kind",
  //     title: <Trans>Kind</Trans>,
  //     render: (item: RunInfo) => getExtraKind(item, 0)
  //   }
];
