/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// Removed MUI Lab date pickers to avoid runtime incompatibility; using native date inputs instead

import periodsData from 'src/_mock/periods.json';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { RouterLink } from 'src/routes/components/router-link';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

type Period = {
  id: string;
  kode: string;
  name: string;
  tahunAjaran?: string;
  semester?: string;
  namaSingkat?: string;
  tglAwal?: string;
  tglAkhir?: string;
  tglUTS?: string;
  tglAwalUTS?: string;
  tglAkhirUTS?: string;
  tglAwalUAS?: string;
  tglAkhirUAS?: string;
  tglUAS?: string;
  ketuaUjian?: string;
  jumlahPertemuan?: number;
  minimalPresensi?: number;
  kuesionerLayanan?: string;
  status?: string;
  aktif?: boolean;
};

type NewPeriodForm = {
  tahunAjaran?: string;
  semester?: string;
  namaPeriode?: string;
  kode?: string | number;
  namaSingkat?: string;
  tglAwal?: any;
  tglAkhir?: any;
  tglUTS?: any;
  tglAwalUAS?: any;
  tglAkhirUAS?: any;
  tglUAS?: any;
  ketuaUjian?: string;
  jumlahPertemuan?: number | '';
  minimalPresensi?: number | '';
  aktif?: boolean;
};

export function UserView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterScope, setFilterScope] = useState('all');

  const [periods, setPeriods] = useState<Period[]>(() => periodsData as Period[]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewPeriod, setViewPeriod] = useState<Period | null>(null);
  const [newPeriod, setNewPeriod] = useState<NewPeriodForm>({ kode: '', namaPeriode: '', tglAwal: null, tglAkhir: null, tglUTS: null, tglAwalUAS: null, tglAkhirUAS: null, tglUAS: null, aktif: true, jumlahPertemuan: '', minimalPresensi: '', tahunAjaran: '', semester: '' });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSearchClick = () => table.onResetPage();

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
    setNewPeriod({ kode: '', namaPeriode: '', tglAwal: null, tglAkhir: null, tglUTS: null, tglUAS: null, aktif: true, jumlahPertemuan: '', minimalPresensi: '', tahunAjaran: '', semester: '' });
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Periode Akademik
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} href="/report" variant="contained" color="info" startIcon={<Iconify icon="solar:share-bold" />}>
            Report
          </Button>
          <Button variant="contained" color="success" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => setOpenAdd(true)}>
            Tambah
          </Button>
          <Button variant="contained" color="error" startIcon={<Iconify icon="solar:trash-bin-trash-bold" />} onClick={handleDeleteSelected} disabled={!table.selected.length}>
            Hapus
          </Button>
        </Stack>
      </Box>

      <Card>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Select value={filterScope} onChange={(e) => setFilterScope(String(e.target.value))} size="small">
              <MenuItem value="all">-- Semua --</MenuItem>
              {periodOptions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>

            <OutlinedInput
              value={filterName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterName(e.target.value)}
              placeholder="Cari Periode Akademik"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ width: 360 }}
              size="small"
            />

            <IconButton color="success" onClick={onSearchClick}>
              <Iconify icon="eva:search-fill" />
            </IconButton>

            <IconButton color="info">
              <Iconify icon="solar:restart-bold" />
            </IconButton>
          </Box>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={periods.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => table.onSelectAllRows(checked, periods.map((p) => p.id))}
                headLabel={[
                  { id: 'kode', label: 'Kode', width: 120 },
                  { id: 'nama', label: 'Nama Periode' },
                  { id: 'tglAwal', label: 'Tgl. Awal Kuliah' },
                  { id: 'tglAkhir', label: 'Tgl. Akhir Kuliah' },
                  { id: 'tglAwalUTS', label: 'Tgl. Awal UTS' },
                  { id: 'tglAwalUAS', label: 'Tgl. Awal UAS' },
                  { id: 'totalProgram', label: 'Total Program Studi Memiliki Tgl. Perkuliahan' },
                  { id: 'aktif', label: 'Aktif?', align: 'center' },
                  { id: 'aksi', label: 'Aksi', align: 'right' },
                ]}
              />
              <TableBody>
                {dataFilteredByPeriod
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <TableRow hover tabIndex={-1} key={row.id} selected={table.selected.includes(row.id)}>
                      <TableCell padding="checkbox">
                        <Checkbox disableRipple checked={table.selected.includes(row.id)} onChange={() => table.onSelectRow(row.id)} />
                      </TableCell>

                      <TableCell>{row.kode}</TableCell>

                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>

                      <TableCell>{row.tglAwal}</TableCell>

                      <TableCell>{row.tglAkhir}</TableCell>

                      <TableCell>{row.tglAwalUTS || row.tglUTS || '—'}</TableCell>

                      <TableCell>{row.tglAwalUAS || row.tglUAS || '—'}</TableCell>

                      <TableCell>—</TableCell>

                      <TableCell align="center">
                        {row.status === 'active' ? (
                          <Iconify width={18} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
                        ) : (
                          <Iconify width={18} icon="mingcute:close-line" sx={{ color: 'error.main' }} />
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {row.status !== 'active' && (
                            <Tooltip title="Aktifkan">
                              <IconButton size="small" color="success" onClick={() => handleToggleActive(row.id)}>
                                <Iconify icon="solar:check-circle-bold" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Lihat">
                            <IconButton size="small" color="info" onClick={() => handleView(row.id)}>
                              <Iconify icon="solar:eye-bold" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, periods.length)} />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={periods.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog fullScreen open={openView} onClose={handleCloseView}>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '4px solid #1AA260' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button startIcon={<Iconify icon={"eva:arrow-ios-back-fill" as any} />} onClick={handleCloseView}>
                Kembali
              </Button>
              <Typography variant="h6" sx={{ ml: 2 }}>
                Detail Periode Akademik
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button color="success" variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleOpenAddFromView}>
                Tambah Baru
              </Button>
              <Button color="warning" variant="contained" startIcon={<Iconify icon={"solar:edit-bold" as any} />} onClick={handleEditFromView}>
                Edit
              </Button>
              <Button color="error" variant="contained" startIcon={<Iconify icon="solar:trash-bin-trash-bold" />} onClick={() => viewPeriod && handleDeleteCurrent(viewPeriod.id)}>
                Hapus
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <DialogContent dividers sx={{ p: { xs: 2, md: 4 } }}>
          {viewPeriod ? (
            <Box sx={{ display: 'grid', gap: 4 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2">Kode Periode</Typography>
                  <Typography>{viewPeriod.kode || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Tahun Ajaran</Typography>
                  <Typography>{viewPeriod.tahunAjaran || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Semester</Typography>
                  <Typography>{viewPeriod.semester || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Nama Periode</Typography>
                  <Typography>{viewPeriod.name || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Nama Singkat</Typography>
                  <Typography>{viewPeriod.namaSingkat || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Ketua Ujian</Typography>
                  <Typography>{viewPeriod.ketuaUjian || '—'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2">Tanggal Awal Kuliah</Typography>
                  <Typography>{viewPeriod.tglAwal || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Tanggal Akhir Kuliah</Typography>
                  <Typography>{viewPeriod.tglAkhir || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Tanggal Awal UTS</Typography>
                  <Typography>{viewPeriod.tglAwalUTS || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Tanggal Akhir UTS</Typography>
                  <Typography>{viewPeriod.tglAkhirUTS || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Tanggal Awal UAS</Typography>
                  <Typography>{viewPeriod.tglAwalUAS || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Tanggal Akhir UAS</Typography>
                  <Typography>{viewPeriod.tglAkhirUAS || '—'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2">Jumlah Pertemuan Kuliah</Typography>
                  <Typography>{viewPeriod.jumlahPertemuan ?? '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Minimal Presensi (Persentase)</Typography>
                  <Typography>{viewPeriod.minimalPresensi ?? '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Kuesioner Layanan</Typography>
                  <Typography>{viewPeriod.kuesionerLayanan || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Aktif?</Typography>
                  <Typography>{viewPeriod.aktif ? '✔️ Ya' : '❌ Tidak'}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography>Periode tidak ditemukan.</Typography>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullScreen>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '4px solid #1AA260' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpenAdd(false)} aria-label="back">
              <Iconify icon="eva:arrow-ios-forward-fill" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              Data Periode Akademik
            </Typography>

            <Button color="info" variant="contained" sx={{ mr: 1 }} onClick={() => setOpenAdd(false)}>
              Kembali ke Daftar
            </Button>
            <Button color="success" variant="contained" onClick={handleAddSubmit}>
              Simpan
            </Button>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <Box sx={{p: 4, width: '100%', maxWidth: '1600px', mx: 'auto', overflow: 'auto',}}>
            <OutlinedInput fullWidth placeholder="Cari Periode Akademik" startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>} sx={{ mb: 3 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, width: '100%', m: 0, alignItems: 'flex-start' }}>
              <Box>
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 2 }}>
                    <Box>
                      <TextField fullWidth label="Kode Periode (5 angka)" value={newPeriod.kode || ''} onChange={(e) => setNewPeriod((s) => ({ ...s, kode: e.target.value.replace(/[^0-9]/g, '') }))} error={!!errors.kode} helperText={errors.kode} inputProps={{ maxLength: 5 }} />
                    </Box>

                    <Box>
                      <Select fullWidth displayEmpty value={newPeriod.tahunAjaran || ''} onChange={(e) => setNewPeriod((s) => ({ ...s, tahunAjaran: String(e.target.value) }))} error={!!errors.tahunAjaran}>
                        <MenuItem value="">-- Pilih Tahun Ajaran --</MenuItem>
                        {tahunAjaranOptions.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

                    <Box>
                      <Select fullWidth displayEmpty value={newPeriod.semester || ''} onChange={(e) => setNewPeriod((s) => ({ ...s, semester: String(e.target.value) }))} error={!!errors.semester}>
                        <MenuItem value="">-- Pilih Semester --</MenuItem>
                        <MenuItem value="Ganjil">Ganjil</MenuItem>
                        <MenuItem value="Genap">Genap</MenuItem>
                        <MenuItem value="Pendek">Pendek</MenuItem>
                      </Select>
                    </Box>

                    <Box>
                      <TextField fullWidth label="Nama Periode" value={newPeriod.namaPeriode || ''} onChange={(e) => setNewPeriod((s) => ({ ...s, namaPeriode: e.target.value }))} error={!!errors.namaPeriode} helperText={errors.namaPeriode} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Nama Singkat" value={newPeriod.namaSingkat || ''} onChange={(e) => setNewPeriod((s) => ({ ...s, namaSingkat: e.target.value }))} error={!!errors.namaSingkat} helperText={errors.namaSingkat} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Tanggal Awal Kuliah" type="date" InputLabelProps={{ shrink: true }} value={newPeriod.tglAwal ? (newPeriod.tglAwal instanceof Date ? newPeriod.tglAwal.toISOString().slice(0,10) : String(newPeriod.tglAwal)) : ''} onChange={(e) => setNewPeriod((s) => ({ ...s, tglAwal: e.target.value ? new Date(e.target.value) : null }))} error={!!errors.tglAwal} helperText={errors.tglAwal} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Tanggal Akhir Kuliah" type="date" InputLabelProps={{ shrink: true }} value={newPeriod.tglAkhir ? (newPeriod.tglAkhir instanceof Date ? newPeriod.tglAkhir.toISOString().slice(0,10) : String(newPeriod.tglAkhir)) : ''} onChange={(e) => setNewPeriod((s) => ({ ...s, tglAkhir: e.target.value ? new Date(e.target.value) : null }))} error={!!errors.tglAkhir} helperText={errors.tglAkhir} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Tanggal Awal UTS (opsional)" type="date" InputLabelProps={{ shrink: true }} value={newPeriod.tglUTS ? (newPeriod.tglUTS instanceof Date ? newPeriod.tglUTS.toISOString().slice(0,10) : String(newPeriod.tglUTS)) : ''} onChange={(e) => setNewPeriod((s) => ({ ...s, tglUTS: e.target.value ? new Date(e.target.value) : null }))} />
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 2 }}>
                    <Box>
                      <TextField fullWidth label="Tanggal Akhir UTS (opsional)" type="date" InputLabelProps={{ shrink: true }} value={newPeriod.tglUAS ? (newPeriod.tglUAS instanceof Date ? newPeriod.tglUAS.toISOString().slice(0,10) : String(newPeriod.tglUAS)) : ''} onChange={(e) => setNewPeriod((s) => ({ ...s, tglUAS: e.target.value ? new Date(e.target.value) : null }))} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Tanggal Awal UAS (opsional)" type="date" InputLabelProps={{ shrink: true }} value={newPeriod.tglAwalUAS ? (newPeriod.tglAwalUAS instanceof Date ? newPeriod.tglAwalUAS.toISOString().slice(0,10) : String(newPeriod.tglAwalUAS)) : ''} onChange={(e) => setNewPeriod((s) => ({ ...s, tglAwalUAS: e.target.value ? new Date(e.target.value) : null }))} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Tanggal Akhir UAS (opsional)" type="date" InputLabelProps={{ shrink: true }} value={newPeriod.tglAkhirUAS ? (newPeriod.tglAkhirUAS instanceof Date ? newPeriod.tglAkhirUAS.toISOString().slice(0,10) : String(newPeriod.tglAkhirUAS)) : ''} onChange={(e) => setNewPeriod((s) => ({ ...s, tglAkhirUAS: e.target.value ? new Date(e.target.value) : null }))} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Ketua Ujian" value={newPeriod.ketuaUjian || ''} onChange={(e) => setNewPeriod((s) => ({ ...s, ketuaUjian: e.target.value }))} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Jumlah Pertemuan Kuliah" type="number" value={newPeriod.jumlahPertemuan ?? ''} onChange={(e) => setNewPeriod((s) => ({ ...s, jumlahPertemuan: e.target.value === '' ? '' : Number(e.target.value) }))} error={!!errors.jumlahPertemuan} helperText={errors.jumlahPertemuan} />
                    </Box>

                    <Box>
                      <TextField fullWidth label="Minimal Presensi (persentase)" type="number" value={newPeriod.minimalPresensi ?? ''} onChange={(e) => setNewPeriod((s) => ({ ...s, minimalPresensi: e.target.value === '' ? '' : Number(e.target.value) }))} error={!!errors.minimalPresensi} helperText={errors.minimalPresensi} inputProps={{ min: 0, max: 100 }} />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                        <Typography>Aktif?</Typography>
                        <FormControlLabel control={<Switch checked={!!newPeriod.aktif} onChange={(e) => setNewPeriod((s) => ({ ...s, aktif: e.target.checked }))} />} label="" />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
