import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import { TableNoData } from '../table-no-data';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';

import type { Period, UserTableState } from './user-view-types';

interface UserViewTableProps {
  table: UserTableState;
  periodsCount: number;
  allRowIds: string[];
  dataFilteredByPeriod: Period[];
  handleView: (id: string) => void;
  handleToggleActive: (id: string) => void;
  handleDelete: (id: string) => void;
  notFound: boolean;
  filterName: string;
}

export function UserViewTable({
  table,
  periodsCount,
  allRowIds,
  dataFilteredByPeriod,
  handleView,
  handleToggleActive,
  handleDelete,
  notFound,
  filterName,
}: UserViewTableProps) {
  return (
    <Scrollbar>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Table sx={{ minWidth: 800 }}>
          <UserTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={periodsCount}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) => table.onSelectAllRows(checked, allRowIds)}
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

            <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, dataFilteredByPeriod.length)} />

            {notFound && <TableNoData searchQuery={filterName} />}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        page={table.page}
        count={dataFilteredByPeriod.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Scrollbar>
  );
}
