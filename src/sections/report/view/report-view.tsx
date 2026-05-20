/* eslint-disable perfectionist/sort-imports */
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import periodsData from 'src/_mock/periods.json';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from 'src/sections/user/table-no-data';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';
import { useTable } from 'src/sections/user/view/user-view';

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

  const filterOptions = useMemo(
    () => ({
      kode: ['all', ...Array.from(new Set(periods.map((p) => p.kode).filter(Boolean)))],
      name: ['all', ...Array.from(new Set(periods.map((p) => p.name).filter(Boolean)))],
      tglAwal: ['all', ...Array.from(new Set(periods.map((p) => p.tglAwal).filter(Boolean)))],
      tglAkhir: ['all', ...Array.from(new Set(periods.map((p) => p.tglAkhir).filter(Boolean)))],
      tglAwalUTS: ['all', ...Array.from(new Set(periods.map((p) => p.tglAwalUTS ?? p.tglUTS).filter(Boolean)))],
      tglAwalUAS: ['all', ...Array.from(new Set(periods.map((p) => p.tglAwalUAS ?? p.tglUAS).filter(Boolean)))],
      status: ['all', ...Array.from(new Set(periods.map((p) => p.status).filter(Boolean)))],
    }),
    [periods]
  );

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

    const escapeValue = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const header = [
      'Kode Periode',
      'Tahun Ajaran',
      'Semester',
      'Nama Periode',
      'Nama Singkat',
      'Tgl. Awal Kuliah',
      'Tgl. Akhir Kuliah',
      'Tgl. Awal UTS',
      'Tgl. Akhir UTS',
      'Tgl. Awal UAS',
      'Tgl. Akhir UAS',
      'Jumlah Pertemuan',
      'Min. Presensi',
      'Status',
    ];

    const rows = selectedRows.map((row) => [
      row.kode || '',
      row.tahunAjaran || '',
      row.semester || '',
      row.name || '',
      row.namaSingkat || '',
      row.tglAwal || '',
      row.tglAkhir || '',
      row.tglAwalUTS || row.tglUTS || '',
      row.tglAkhirUTS || '',
      row.tglAwalUAS || row.tglUAS || '',
      row.tglAkhirUAS || '',
      String(row.jumlahPertemuan ?? ''),
      String(row.minimalPresensi ?? ''),
      row.status || '',
    ]);

    const csvContent = [header, ...rows].map((line) => line.map(escapeValue).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report-periode-akademik.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

const handlePrintSelected = () => {
  const selectedRows = periods.filter((row) => table.selected.includes(row.id));
  if (!selectedRows.length) return;

  const blocksHtml = selectedRows
    .map(
      (row) => `
      <section style="margin-bottom:28px; page-break-inside: avoid;">
        <div style="font-family: Arial, sans-serif; margin-bottom:8px;">
          <div><strong>Kode Periode:</strong> ${row.kode || '—'}</div>
          <div><strong>Tahun Ajaran:</strong> ${row.tahunAjaran || '—'}</div>
          <div><strong>Semester:</strong> ${row.semester || '—'}</div>
          <div><strong>Nama Periode:</strong> ${row.name || '—'}</div>
          <div><strong>Nama singkat :</strong> ${row.namaSingkat || '—'}</div>
        </div>

        <table style="width:100%; border-collapse: collapse; font-family: Arial, sans-serif;">
          <thead>
            <tr>
              <th style="border:1px solid #000; padding:6px;">Tgl. Awal Kuliah</th>
              <th style="border:1px solid #000; padding:6px;">Tgl. Akhir Kuliah</th>
              <th style="border:1px solid #000; padding:6px;">Tgl. Awal UTS</th>
              <th style="border:1px solid #000; padding:6px;">Tgl. Akhir UTS</th>
              <th style="border:1px solid #000; padding:6px;">Tgl. Awal UAS</th>
              <th style="border:1px solid #000; padding:6px;">Tgl. Akhir UAS</th>
              <th style="border:1px solid #000; padding:6px;">Jumlah Pertemuan</th>
              <th style="border:1px solid #000; padding:6px;">Min. Presensi</th>
              <th style="border:1px solid #000; padding:6px;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #000; padding:10px;">${row.tglAwal || ' '}</td>
              <td style="border:1px solid #000; padding:10px;">${row.tglAkhir || ' '}</td>
              <td style="border:1px solid #000; padding:10px;">${row.tglAwalUTS || row.tglUTS || ' '}</td>
              <td style="border:1px solid #000; padding:10px;">${row.tglAkhirUTS || ' '}</td>
              <td style="border:1px solid #000; padding:10px;">${row.tglAwalUAS || row.tglUAS || ' '}</td>
              <td style="border:1px solid #000; padding:10px;">${row.tglAkhirUAS || ' '}</td>
              <td style="border:1px solid #000; padding:10px;">${row.jumlahPertemuan ?? ' '}</td>
              <td style="border:1px solid #000; padding:10px;">${row.minimalPresensi ?? ' '}</td>
              <td style="border:1px solid #000; padding:10px;">${row.status || ' '}</td>
            </tr>
          </tbody>
        </table>
      </section>
    `
    )
    .join('');

  const iframe = document.createElement('iframe');

  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;

  if (!doc) return;

  doc.open();

  doc.write(`
    <html>
      <head>
        <title>Report Periode Akademik</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px 40px;
            color: #000;
          }

          /* HEADER */
          .report-header {
            margin-bottom: 10px;
          }

          .report-brand {
            display: flex;
            align-items: flex-start;
            gap: 18px;
          }

          .report-logo {
            width: 72px;
            height: 72px;
            object-fit: contain;
          }

          .report-identity {
            flex: 1;
          }

          .report-identity h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }

          .report-identity p {
            margin: 4px 0;
            font-size: 14px;
            line-height: 1.4;
          }

          /* GARIS */
          .report-divider {
            width: 100%;
            border-top: 4px solid #000;
            margin: 14px 0 30px;
          }

          /* TITLE */
          .report-title {
            text-align: center;
            margin-bottom: 30px;
          }

          .report-title h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
          }

          .report-title p {
            margin-top: 6px;
            font-size: 14px;
          }

          /* TABLE */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th,
          td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 13px;
          }

          th {
            font-weight: bold;
            text-align: center;
          }
        </style>
      </head>

      <body>
        <section class="report-header">
          <div class="report-brand">
            <img
              src="/assets/images/logo_matana.png"
              alt="Logo"
              class="report-logo"
            />

            <div class="report-identity">
              <h1>MATANA UNIVERSITY</h1>

              <p>
                Matana University Tower, ARA Center, JL. CBD Barat Kav. 1,
                Gading Serpong, Tangerang, Banten 15810
              </p>

              <p>
                Website : www.matanauniversity.ac.id |
                Email : info@matanauniversity.ac.id
              </p>
            </div>
          </div>
        </section>

        <div class="report-divider"></div>

        <section class="report-title">
          <h2>DETAIL DATA AKADEMIK</h2>
          <p>Informasi lengkap periode akademik</p>
        </section>

        ${blocksHtml}
      </body>
    </html>
  `);

  doc.close();

  iframe.contentWindow?.focus();

  setTimeout(() => {
    iframe.contentWindow?.print();

    iframe.contentWindow!.onafterprint = () => {
      document.body.removeChild(iframe);
    };
  }, 500);
};

  const dataFiltered: Period[] = applyFilter({
    inputData: periods as any,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  }) as any;

  const dataFilteredByFilters = dataFiltered.filter((row) => {
    return (
      (columnFilters.kode === 'all' || row.kode === columnFilters.kode) &&
      (columnFilters.name === 'all' || row.name === columnFilters.name) &&
      (columnFilters.tglAwal === 'all' || row.tglAwal === columnFilters.tglAwal) &&
      (columnFilters.tglAkhir === 'all' || row.tglAkhir === columnFilters.tglAkhir) &&
      (columnFilters.tglAwalUTS === 'all' || (row.tglAwalUTS || row.tglUTS) === columnFilters.tglAwalUTS) &&
      (columnFilters.tglAwalUAS === 'all' || (row.tglAwalUAS || row.tglUAS) === columnFilters.tglAwalUAS) &&
      (columnFilters.status === 'all' || row.status === columnFilters.status)
    );
  });

  const isFilterActive = filterName || Object.values(columnFilters).some((value) => value !== 'all');
  const notFound = !dataFilteredByFilters.length && !!isFilterActive;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Report Periode Akademik</Typography>
      </Box>

      <Card>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', p: 2, gap: 1 }}>
          <Stack direction="row" flexWrap="wrap" spacing={1} alignItems="center">
            <OutlinedInput
              value={filterName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterName(e.target.value)}
              placeholder="Cari Periode Akademik"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ width: 300 }}
              size="small"
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="inherit" disabled={!table.selected.length} onClick={handlePrintSelected}>
              Print
            </Button>
            <Button variant="contained" disabled={!table.selected.length} onClick={handleExportCsv}>
              Export CSV
            </Button>
          </Stack>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>
                      <Select
                        value={columnFilters.kode}
                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, kode: String(e.target.value) }))}
                        size="small"
                        fullWidth
                      >
                        {filterOptions.kode.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === 'all' ? '-- Semua Kode --' : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={columnFilters.name}
                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, name: String(e.target.value) }))}
                        size="small"
                        fullWidth
                      >
                        {filterOptions.name.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === 'all' ? '-- Semua Periode --' : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={columnFilters.tglAwal}
                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, tglAwal: String(e.target.value) }))}
                        size="small"
                        fullWidth
                      >
                        {filterOptions.tglAwal.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === 'all' ? '-- Semua Tgl Awal --' : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={columnFilters.tglAkhir}
                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, tglAkhir: String(e.target.value) }))}
                        size="small"
                        fullWidth
                      >
                        {filterOptions.tglAkhir.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === 'all' ? '-- Semua Tgl Akhir --' : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={columnFilters.tglAwalUTS}
                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, tglAwalUTS: String(e.target.value) }))}
                        size="small"
                        fullWidth
                      >
                        {filterOptions.tglAwalUTS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === 'all' ? '-- Semua Tgl Awal UTS --' : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={columnFilters.tglAwalUAS}
                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, tglAwalUAS: String(e.target.value) }))}
                        size="small"
                        fullWidth
                      >
                        {filterOptions.tglAwalUAS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === 'all' ? '-- Semua Tgl Awal UAS --' : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    
                    <TableCell>
                      <Select
                        value={columnFilters.status}
                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, status: String(e.target.value) }))}
                        size="small"
                        fullWidth
                      >
                        {filterOptions.status.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === 'all' ? '-- Semua Status --' : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={table.selected.length > 0 && table.selected.length < dataFilteredByFilters.length}
                        checked={dataFilteredByFilters.length > 0 && table.selected.length === dataFilteredByFilters.length}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                          table.onSelectAllRows(event.target.checked, dataFilteredByFilters.map((row) => row.id))
                        }
                      />
                    </TableCell>
                    <TableCell sortDirection={table.orderBy === 'kode' ? table.order : false}>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <span onClick={() => table.onSort('kode')}>
                          Kode
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sortDirection={table.orderBy === 'name' ? table.order : false}>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <span onClick={() => table.onSort('name')}>
                          Nama Periode
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sortDirection={table.orderBy === 'tglAwal' ? table.order : false}>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <span onClick={() => table.onSort('tglAwal')}>
                          Tgl. Awal Kuliah
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sortDirection={table.orderBy === 'tglAkhir' ? table.order : false}>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <span onClick={() => table.onSort('tglAkhir')}>
                          Tgl. Akhir Kuliah
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sortDirection={table.orderBy === 'tglAwalUTS' ? table.order : false}>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <span onClick={() => table.onSort('tglAwalUTS')}>
                          Tgl. Awal UTS
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sortDirection={table.orderBy === 'tglAwalUAS' ? table.order : false}>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <span onClick={() => table.onSort('tglAwalUAS')}>
                          Tgl. Awal UAS
                        </span>
                      </Tooltip>
                    </TableCell>
                    
                    <TableCell sortDirection={table.orderBy === 'status' ? table.order : false}>
                      <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                        <span onClick={() => table.onSort('status')}>
                          Status
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {dataFilteredByFilters
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }} onClick={() => handleView(row.id)}>
                      <TableCell padding="checkbox" onClick={(event) => event.stopPropagation()}>
                        <Checkbox
                          disableRipple
                          checked={table.selected.includes(row.id)}
                          onChange={() => table.onSelectRow(row.id)}
                        />
                      </TableCell>

                      <TableCell>{row.kode}</TableCell>

                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>

                      <TableCell>{row.tglAwal}</TableCell>

                      <TableCell>{row.tglAkhir}</TableCell>

                      <TableCell>{row.tglAwalUTS || row.tglUTS || '—'}</TableCell>

                      <TableCell>{row.tglAwalUAS || row.tglUAS || '—'}</TableCell>

                      <TableCell>{row.status || '—'}</TableCell>
                    </TableRow>
                  ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, dataFilteredByFilters.length)} />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataFilteredByFilters.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openView} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>Detail Periode Akademik</DialogTitle>
        <DialogContent dividers>
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
        <DialogActions>
          <Button onClick={handleCloseView}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
