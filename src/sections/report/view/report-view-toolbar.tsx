import type { Dispatch, SetStateAction } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

interface ReportViewToolbarProps {
  filterName: string;
  setFilterName: Dispatch<SetStateAction<string>>;
  onExportCsv: () => void;
  onPrintSelected: () => void;
  selectedCount: number;
}

export function ReportViewToolbar({
  filterName,
  setFilterName,
  onExportCsv,
  onPrintSelected,
  selectedCount,
}: ReportViewToolbarProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', p: 2, gap: 1 }}>
      <Stack direction="row" flexWrap="wrap" spacing={1} alignItems="center">
        <OutlinedInput
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
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
        <Button variant="outlined" color="inherit" disabled={!selectedCount} onClick={onPrintSelected}>
          Print
        </Button>
        <Button variant="contained" disabled={!selectedCount} onClick={onExportCsv}>
          Export CSV
        </Button>
      </Stack>
    </Box>
  );
}
