/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import periodsData from 'src/_mock/periods.json';

import { DashboardContent } from 'src/layouts/dashboard';
import { UserViewToolbar } from './user-view-toolbar';
import { UserViewTable } from './user-view-table';
import { UserAddDialog, UserViewDialog } from './user-view-dialogs';
import { type Period, type NewPeriodForm } from './user-view-types';
import { applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

const getInitialNewPeriod = (): NewPeriodForm => ({
  kode: '',
  namaPeriode: '',
  tglAwal: null,
  tglAkhir: null,
  tglUTS: null,
  tglAwalUAS: null,
  tglAkhirUAS: null,
  tglUAS: null,
  aktif: true,
  jumlahPertemuan: '',
  minimalPresensi: '',
  tahunAjaran: '',
  semester: '',
});

export function UserView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterScope, setFilterScope] = useState('all');
  const [periods, setPeriods] = useState<Period[]>(() => periodsData as Period[]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewPeriod, setViewPeriod] = useState<Period | null>(null);
  const [newPeriod, setNewPeriod] = useState<NewPeriodForm>(getInitialNewPeriod());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSearchClick = () => table.onResetPage();

  const handleResetFilters = () => {
    setFilterName('');
    setFilterScope('all');
    table.onResetPage();
  };

  const handleToggleActive = (id: string) => {
    setPeriods((prev) =>
      prev.map((period) =>
        period.id === id
          ? {
              ...period,
              aktif: !period.aktif,
              status: period.aktif ? 'inactive' : 'active',
            }
          : period
      )
    );
  };

  const handleView = (id: string) => {
    const period = periods.find((item) => item.id === id) ?? null;
    setViewPeriod(period);
    setOpenView(!!period);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setViewPeriod(null);
  };

  const handleOpenAddFromView = () => {
    setOpenView(false);
    setOpenAdd(true);
  };

  const handleEditFromView = () => {
    setOpenView(false);
    setOpenAdd(true);
  };

  const handleDelete = (id: string) => {
    setPeriods((prev) => prev.filter((period) => period.id !== id));
  };

  const handleDeleteCurrent = (id: string) => {
    handleDelete(id);
    handleCloseView();
  };

  const handleDeleteSelected = () => {
    if (!table.selected.length) return;
    setPeriods((prev) => prev.filter((period) => !table.selected.includes(period.id)));
    table.onSelectAllRows(false, []);
  };

  const dataFiltered: Period[] = applyFilter({
    inputData: periods as any,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  }) as any;

  const periodOptions = Array.from(new Set(periods.map((p) => p.name)));

  const currentYear = new Date().getFullYear();
  const tahunAjaranOptions = Array.from({ length: currentYear - 2022 + 1 }, (_, i) => {
    const start = 2022 + i;
    return `${start}/${start + 1}`;
  });

  const dataFilteredByPeriod = dataFiltered.filter((row) => (filterScope === 'all' ? true : row.name === filterScope));

  const notFound = !dataFilteredByPeriod.length && !!filterName;

  const handleAddSubmit = () => {
    const nextErrors: Record<string, string> = {};

    if (!newPeriod.tahunAjaran) nextErrors.tahunAjaran = 'Tahun ajaran wajib diisi';
    if (!newPeriod.semester) nextErrors.semester = 'Semester wajib dipilih';
    if (!newPeriod.namaPeriode) nextErrors.namaPeriode = 'Nama periode wajib diisi';
    if (!newPeriod.kode) nextErrors.kode = 'Kode periode wajib diisi';
    else if (!/^[0-9]{5}$/.test(String(newPeriod.kode))) nextErrors.kode = 'Kode harus 5 angka';
    if (!newPeriod.namaSingkat) nextErrors.namaSingkat = 'Nama singkat wajib diisi';
    if (!newPeriod.tglAwal) nextErrors.tglAwal = 'Tanggal awal kuliah wajib diisi';
    if (!newPeriod.tglAkhir) nextErrors.tglAkhir = 'Tanggal akhir kuliah wajib diisi';
    if (newPeriod.jumlahPertemuan === '' || newPeriod.jumlahPertemuan === undefined) nextErrors.jumlahPertemuan = 'Jumlah pertemuan wajib diisi';
    else if (!Number.isInteger(Number(newPeriod.jumlahPertemuan)) || Number(newPeriod.jumlahPertemuan) < 0) nextErrors.jumlahPertemuan = 'Harus berupa integer positif';
    if (newPeriod.minimalPresensi === '' || newPeriod.minimalPresensi === undefined) nextErrors.minimalPresensi = 'Minimal presensi wajib diisi';
    else if (Number(newPeriod.minimalPresensi) < 0 || Number(newPeriod.minimalPresensi) > 100) nextErrors.minimalPresensi = 'Harus antara 0-100';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    const id = `p_${Date.now()}`;
    const item: Period = {
      id,
      kode: String(newPeriod.kode),
      name: `${newPeriod.tahunAjaran} ${newPeriod.semester} ${newPeriod.namaPeriode}`,
      tglAwal: newPeriod.tglAwal
        ? typeof (newPeriod.tglAwal as any).toLocaleDateString === 'function'
          ? (newPeriod.tglAwal as any).toLocaleDateString('id-ID')
          : String(newPeriod.tglAwal)
        : '',
      tglAkhir: newPeriod.tglAkhir
        ? typeof (newPeriod.tglAkhir as any).toLocaleDateString === 'function'
          ? (newPeriod.tglAkhir as any).toLocaleDateString('id-ID')
          : String(newPeriod.tglAkhir)
        : '',
      tglUTS: newPeriod.tglUTS
        ? typeof (newPeriod.tglUTS as any).toLocaleDateString === 'function'
          ? (newPeriod.tglUTS as any).toLocaleDateString('id-ID')
          : String(newPeriod.tglUTS)
        : '',
      tglAwalUAS: newPeriod.tglAwalUAS
        ? typeof (newPeriod.tglAwalUAS as any).toLocaleDateString === 'function'
          ? (newPeriod.tglAwalUAS as any).toLocaleDateString('id-ID')
          : String(newPeriod.tglAwalUAS)
        : '',
      tglAkhirUAS: newPeriod.tglAkhirUAS
        ? typeof (newPeriod.tglAkhirUAS as any).toLocaleDateString === 'function'
          ? (newPeriod.tglAkhirUAS as any).toLocaleDateString('id-ID')
          : String(newPeriod.tglAkhirUAS)
        : '',
      tglUAS: newPeriod.tglUAS
        ? typeof (newPeriod.tglUAS as any).toLocaleDateString === 'function'
          ? (newPeriod.tglUAS as any).toLocaleDateString('id-ID')
          : String(newPeriod.tglUAS)
        : '',
      status: newPeriod.aktif ? 'active' : 'inactive',
      aktif: !!newPeriod.aktif,
    };

    setPeriods((s) => [item, ...s]);
    setOpenAdd(false);
    setNewPeriod(getInitialNewPeriod());
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Periode Akademik
        </Typography>
      </Box>

      <Card>
        <UserViewToolbar
          filterName={filterName}
          setFilterName={setFilterName}
          filterScope={filterScope}
          setFilterScope={setFilterScope}
          periodOptions={periodOptions}
          selectedCount={table.selected.length}
          onSearchClick={onSearchClick}
          onResetFilters={handleResetFilters}
          onOpenAdd={() => setOpenAdd(true)}
          onDeleteSelected={handleDeleteSelected}
        />

        <UserViewTable
          table={table}
          periodsCount={periods.length}
          allRowIds={periods.map((period) => period.id)}
          dataFilteredByPeriod={dataFilteredByPeriod}
          handleView={handleView}
          handleToggleActive={handleToggleActive}
          handleDelete={handleDelete}
          notFound={notFound}
          filterName={filterName}
        />
      </Card>

      <UserViewDialog
        openView={openView}
        viewPeriod={viewPeriod}
        onCloseView={handleCloseView}
        onOpenAddFromView={handleOpenAddFromView}
        onEditFromView={handleEditFromView}
        onDeleteCurrent={handleDeleteCurrent}
      />

      <UserAddDialog
        openAdd={openAdd}
        onCloseAdd={() => setOpenAdd(false)}
        newPeriod={newPeriod}
        setNewPeriod={setNewPeriod}
        errors={errors}
        onSubmitAdd={handleAddSubmit}
        tahunAjaranOptions={tahunAjaranOptions}
      />
    </DashboardContent>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue) ? selected.filter((value) => value !== inputValue) : [...selected, inputValue];
      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
