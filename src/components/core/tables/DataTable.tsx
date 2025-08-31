import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ColumnPinningState,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
} from "mantine-react-table";

import { Divider, Paper } from "@mantine/core";

import { getTableOption } from "./config";
import { Pagination } from "./Pagination";
import { Toolbar } from "./Toolbar";

export type DataTableProps<T extends MRT_RowData> = {
  columns: MRT_ColumnDef<T, unknown>[];
  data: T[];
  rightSection?: React.ReactNode;
  isLoading?: boolean;
  columnPinning?: MRT_ColumnPinningState;
  total?: number;
  renderDetailPanel?: (props: {
    row: MRT_Row<T>;
    table: MRT_TableInstance<T>;
  }) => React.ReactNode;
  searchInputHidden?: boolean;
};

export function DataTable<T extends MRT_RowData>({
  rightSection,
  isLoading,
  columnPinning = {},
  total,
  searchInputHidden,
  ...props
}: DataTableProps<T>) {
  return (
    <Paper withBorder>
      <Toolbar rightSectioin={rightSection} searchInputHidden={searchInputHidden} />
      <Divider />
      <MantineReactTable<T>
        {...getTableOption<T>()}
        {...props}
        state={{
          isLoading,
          columnPinning,
        }}
      />
      <Divider />
      {total ? <Pagination total={total} /> : null}
    </Paper>
  );
}
