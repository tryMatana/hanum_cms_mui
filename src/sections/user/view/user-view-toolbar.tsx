import { type Dispatch, type ChangeEvent, type SetStateAction } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { type SelectChangeEvent } from '@mui/material/Select';

import { RouterLink } from 'src/routes/components/router-link';

import { Iconify } from 'src/components/iconify';

interface UserViewToolbarProps {
  filterName: string;
  setFilterName: Dispatch<SetStateAction<string>>;
  filterScope: string;
  setFilterScope: Dispatch<SetStateAction<string>>;
  periodOptions: string[];
  selectedCount: number;
  onSearchClick: () => void;
  onResetFilters: () => void;
  onOpenAdd: () => void;
  onDeleteSelected: () => void;
}

export function UserViewToolbar({
  filterName,
  setFilterName,
  filterScope,
  setFilterScope,
  periodOptions,
  selectedCount,
  onSearchClick,
  onResetFilters,
  onOpenAdd,
  onDeleteSelected,
}: UserViewToolbarProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, flexWrap: 'wrap', gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Button component={RouterLink} href="/report" variant="contained" color="info" startIcon={<Iconify icon="solar:share-bold" />}>
          Report
        </Button>
        <Button variant="contained" color="success" startIcon={<Iconify icon="mingcute:add-line" />} onClick={onOpenAdd}>
          Tambah
        </Button>
        <Button variant="contained" color="error" startIcon={<Iconify icon="solar:trash-bin-trash-bold" />} onClick={onDeleteSelected} disabled={!selectedCount}>
          Hapus
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Select value={filterScope} onChange={(e: SelectChangeEvent<string>) => setFilterScope(e.target.value)} size="small">
          <MenuItem value="all">-- Semua --</MenuItem>
          {periodOptions.map((period) => (
            <MenuItem key={period} value={period}>
              {period}
            </MenuItem>
          ))}
        </Select>

        <OutlinedInput
          value={filterName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterName(e.target.value)}
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
        <IconButton color="info" onClick={onResetFilters}>
          <Iconify icon="solar:restart-bold" />
        </IconButton>
      </Box>
    </Box>
  );
}
