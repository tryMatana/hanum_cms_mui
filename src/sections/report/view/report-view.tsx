/* eslint-disable perfectionist/sort-imports */
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import periodsData from 'src/_mock/periods.json';

import { DashboardContent } from 'src/layouts/dashboard';
import { applyFilter, getComparator } from 'src/sections/user/utils';
import { useTable } from '../../user/view/user-view';
import { ReportViewToolbar } from './report-view-toolbar';
import { ReportViewTable } from './report-view-table';
import { ReportViewDialog } from './report-view-dialog';
import type {
  Period} from './report-view-utils';
import {
  exportPeriodsToCsv,
  printReportPeriods,
  getReportFilterOptions,
} from './report-view-utils';

// ----------------------------------------------------------------------

export function ReportView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    kode: 'all',
    name: 'all',
    tglAwal: 'all',
    tglAkhir: 'all',
    tglAwalUTS: 'all',
    tglAwalUAS: 'all',
    status: 'all',
  });
  const [periods] = useState<Period[]>(() => periodsData as Period[]);
  const [openView, setOpenView] = useState(false);
  const [viewPeriod, setViewPeriod] = useState<Period | null>(null);

  const filterOptions = useMemo(() => getReportFilterOptions(periods), [periods]);

  const handleView = (id: string) => {
    const period = periods.find((item) => item.id === id) ?? null;
    setViewPeriod(period);
    setOpenView(!!period);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setViewPeriod(null);
  };

  const handleExportCsv = () => {
    const selectedRows = periods.filter((row) => table.selected.includes(row.id));
    if (!selectedRows.length) return;

    exportPeriodsToCsv(selectedRows);
  };

  const handlePrintSelected = () => {
    const selectedRows = periods.filter((row) => table.selected.includes(row.id));
    if (!selectedRows.length) return;

    printReportPeriods(selectedRows);
  };

  const dataFiltered: Period[] = applyFilter({
    inputData: periods as any,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  }) as any;

  const dataFilteredByFilters = dataFiltered.filter((row) => (
      (columnFilters.kode === 'all' || row.kode === columnFilters.kode) &&
      (columnFilters.name === 'all' || row.name === columnFilters.name) &&
      (columnFilters.tglAwal === 'all' || row.tglAwal === columnFilters.tglAwal) &&
      (columnFilters.tglAkhir === 'all' || row.tglAkhir === columnFilters.tglAkhir) &&
      (columnFilters.tglAwalUTS === 'all' || (row.tglAwalUTS || row.tglUTS) === columnFilters.tglAwalUTS) &&
      (columnFilters.tglAwalUAS === 'all' || (row.tglAwalUAS || row.tglUAS) === columnFilters.tglAwalUAS) &&
      (columnFilters.status === 'all' || row.status === columnFilters.status)
    ));

  const isFilterActive = filterName || Object.values(columnFilters).some((value) => value !== 'all');
  const notFound = !dataFilteredByFilters.length && !!isFilterActive;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Report Periode Akademik</Typography>
      </Box>

      <Card>
        <ReportViewToolbar
          filterName={filterName}
          setFilterName={setFilterName}
          onExportCsv={handleExportCsv}
          onPrintSelected={handlePrintSelected}
          selectedCount={table.selected.length}
        />

        <ReportViewTable
          table={table}
          filterOptions={filterOptions}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          dataFilteredByFilters={dataFilteredByFilters}
          handleView={handleView}
          notFound={notFound}
          filterName={filterName}
        />
      </Card>

        <ReportViewDialog open={openView} viewPeriod={viewPeriod} onClose={handleCloseView} />
      </DashboardContent>
  );
}
