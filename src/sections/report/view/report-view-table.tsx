import type { Dispatch, SetStateAction , ChangeEvent } from 'react';

import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/user/utils';
import { TableNoData } from 'src/sections/user/table-no-data';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';

import type { Period } from './report-view-utils';
import type { useTable } from '../../user/view/user-view';

interface ReportViewTableProps {
  table: ReturnType<typeof useTable>;
  filterOptions: Record<string, string[]>;
  columnFilters: Record<string, string>;
  setColumnFilters: Dispatch<SetStateAction<Record<string, string>>>;
  dataFilteredByFilters: Period[];
  handleView: (id: string) => void;
  notFound: boolean;
  filterName: string;
}

export function ReportViewTable({
  table,
  filterOptions,
  columnFilters,
  setColumnFilters,
  dataFilteredByFilters,
  handleView,
  notFound,
  filterName,
}: ReportViewTableProps) {
  return (
    <>
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
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      table.onSelectAllRows(event.target.checked, dataFilteredByFilters.map((row) => row.id))
                    }
                  />
                </TableCell>
                <TableCell sortDirection={table.orderBy === 'kode' ? table.order : false}>
                  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                    <span onClick={() => table.onSort('kode')}>Kode</span>
                  </Tooltip>
                </TableCell>
                <TableCell sortDirection={table.orderBy === 'name' ? table.order : false}>
                  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                    <span onClick={() => table.onSort('name')}>Nama Periode</span>
                  </Tooltip>
                </TableCell>
                <TableCell sortDirection={table.orderBy === 'tglAwal' ? table.order : false}>
                  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                    <span onClick={() => table.onSort('tglAwal')}>Tgl. Awal Kuliah</span>
                  </Tooltip>
                </TableCell>
                <TableCell sortDirection={table.orderBy === 'tglAkhir' ? table.order : false}>
                  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                    <span onClick={() => table.onSort('tglAkhir')}>Tgl. Akhir Kuliah</span>
                  </Tooltip>
                </TableCell>
                <TableCell sortDirection={table.orderBy === 'tglAwalUTS' ? table.order : false}>
                  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                    <span onClick={() => table.onSort('tglAwalUTS')}>Tgl. Awal UTS</span>
                  </Tooltip>
                </TableCell>
                <TableCell sortDirection={table.orderBy === 'tglAwalUAS' ? table.order : false}>
                  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                    <span onClick={() => table.onSort('tglAwalUAS')}>Tgl. Awal UAS</span>
                  </Tooltip>
                </TableCell>
                <TableCell sortDirection={table.orderBy === 'status' ? table.order : false}>
                  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                    <span onClick={() => table.onSort('status')}>Status</span>
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
    </>
  );
}
