"use client";

import { t } from "@lingui/core/macro";
import type { DataTableColumn, DataTableSortStatus } from "mantine-datatable";
import { DataTable } from "mantine-datatable";
import { useMemo, useState } from "react";

interface Props<T> {
  records: T[];
  columns: DataTableColumn<T>[];
  onSelectedRecordsChange?: (selectedRecords: T[]) => void;
  selectedRecords?: T[];
  sortStatus?: DataTableSortStatus<T>;
  onSortStatusChange?: (sortStatus: DataTableSortStatus<T>) => void;
  noRecordsText?: string;
  noRecordsIcon?: React.ReactNode;
  idAccessor?: (keyof T | string) | ((record: T) => React.Key);
  loading?: boolean;
  pageSize?: number;
}

const PAGE_SIZES = [10, 20, 30, 40, 50, 100];

export function DataGrid<T>({
  records,
  columns,
  selectedRecords,
  noRecordsText,
  noRecordsIcon,
  onSelectedRecordsChange,
  sortStatus,
  onSortStatusChange,
  idAccessor,
  loading,
  pageSize = PAGE_SIZES[1]
}: Props<T>) {
  const [intPageSize, setPageSize] = useState(pageSize);
  const [page, setPage] = useState(1);

  const visibleData = useMemo(() => {
    if (records === undefined) return [];

    const from = (page - 1) * intPageSize;
    const to = from + intPageSize;

    return records.slice(from, to);
  }, [records, intPageSize, page]);

  return (
    <DataTable
      minHeight={250}
      idAccessor={idAccessor}
      withTableBorder
      borderRadius="sm"
      striped
      highlightOnHover
      fz="sm"
      records={visibleData}
      columns={columns}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={onSelectedRecordsChange}
      totalRecords={records.length}
      recordsPerPage={intPageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      paginationSize="xs"
      noRecordsText={noRecordsText}
      noRecordsIcon={noRecordsIcon}
      fetching={loading}
      onSortStatusChange={onSortStatusChange}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sortStatus={sortStatus as any}
      recordsPerPageLabel={t`Records per page`}
    />
  );
}
