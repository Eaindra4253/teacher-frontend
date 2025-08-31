import { Can } from "@/components/auth/Can";
import { CopyText } from "@/components/commons/CopyText";
import { DataTable } from "@/components/core/tables/DataTable";
import Header from "@/components/layouts/Header";
import { formatDate } from "@/utils/date";
import { Flex, Text } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { CancelButton } from "../requests/CancelButton";
import { Toolbar } from "../requests/Toolbar";
import { useGetRequests } from "./queries";
import { getStatusColor } from "@/utils/status";

const columns: MRT_ColumnDef<CashRequest, unknown>[] = [
  {
    accessorKey: "requestCode",
    header: "Request Code",
    size: 150,
    Cell: ({ row }) => {
      return <CopyText>{row.original.requestCode ?? "-"}</CopyText>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    Cell: ({ row }) => {
      const color = getStatusColor(row.original.status);
      return (
        <Flex align="center" justify="flex-start" gap="xs">
          <IconCircleFilled size={10} color={color} />
          <Text c="gray" fz="xs" fw="bold" tt="capitalize">
            {(row.original.status ?? "-").toLocaleLowerCase()}
          </Text>
        </Flex>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Requestor Name",
    size: 120,
    Cell: ({ row }) => {
      return row.original.requestor?.username ?? "-";
    },
  },
  {
    accessorKey: "phone",
    header: "Requestor Phone",
    size: 120,
    Cell: ({ row }) => {
      return row.original.requestor?.phone ?? "-";
    },
  },
  {
    accessorKey: "merchantName",
    header: "Agent",
    size: 200,
    Cell: ({ row }) => {
      return row.original.merchant?.merchantName ?? "-";
    },
  },
  {
    accessorKey: "merchantPhone",
    header: "Agent Phone",
    size: 150,
    Cell: ({ row }) => {
      return row.original.merchant?.phone ? (
        <CopyText>{row.original.merchant?.phone ?? "-"}</CopyText>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "tabletName",
    header: "Tablet ID",
    size: 150,
    Cell: ({ row }) => {
      return row.original.tabletName ?? "-";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 150,
    Cell: ({ row }) => {
      return row.original.amount?.toLocaleString("en-US") ?? "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Requested Time",
    size: 200,
    Cell: ({ row }) =>
      row.original.createdAt && formatDate(row.original.createdAt),
  },
  {
    accessorKey: "collectorName",
    header: "Collector",
    size: 180,
    Cell: ({ row }) => row.original.collector?.collectorName ?? "-",
  },
  {
    accessorKey: "collector",
    header: "Collected Time",
    size: 200,
    Cell: ({ row }) =>
      row.original.collector?.collectedDate
        ? formatDate(row.original.collector?.collectedDate)
        : "-",
  },
  {
    accessorKey: "madeByUser",
    header: "Requested By",
    size: 180,
    Cell: ({ row }) => {
      return row.original.madeByUser?.username ?? "Consumer-Mobile";
    },
  },
  {
    accessorKey: "remark",
    header: "Cancel Remark",
    size: 180,
  },
  {
    accessorKey: "_id",
    header: "Actions",
    size: 120,
    Cell: ({ row }) => {
      if (row.original.status !== "PENDING") return "-";
      return (
        <Can actions={["CANCEL_BCF_REQUEST"]} notAllowComponent="-">
          <CancelButton id={row.original.id} />
        </Can>
      );
    },
  },
];

export function BCFRequestListPage() {
  const { data, isFetching, isRefetching } = useGetRequests();

  return (
    <>
      <Header title="BCF Cash Requests" />
      <DataTable<CashRequest>
        rightSection={<Toolbar requestType="BCF" />}
        total={data?.totalCount ?? 0}
        isLoading={!isRefetching && isFetching}
        data={data?.data ?? []}
        columns={columns}
        columnPinning={{
          right: ["_id"],
        }}
      />
    </>
  );
}
