import { Can } from "@/components/auth/Can";
import { CopyText } from "@/components/commons/CopyText";
import { DataTable } from "@/components/core/tables/DataTable";
import Header from "@/components/layouts/Header";
import { formatDate } from "@/utils/date";
import { Flex, Text } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useGetRequests } from "./queries";
import { Toolbar } from "./Toolbar";
import { CancelButton } from "./CancelButton";
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
    accessorKey: "store",
    header: "Outlet",
    size: 120,
    Cell: ({ row }) => {
      return row.original.store?.outletName ?? "-";
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
      return row.original.madeByUser?.username ?? "E-Service";
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
        <Can actions={["CANCEL_REQUEST"]} notAllowComponent="-">
          <CancelButton id={row.original.id} />
        </Can>
      );
    },
  },
];

export function RequestListPage() {
  const { data, isFetching, isRefetching } = useGetRequests();

  return (
    <>
      <Header title="Cash Requests" />
      <DataTable<CashRequest>
        rightSection={<Toolbar requestType="STORE" />}
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
