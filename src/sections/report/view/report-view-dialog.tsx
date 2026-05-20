import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import type { Period } from './report-view-utils';

interface ReportViewDialogProps {
  open: boolean;
  viewPeriod: Period | null;
  onClose: () => void;
}

export function ReportViewDialog({ open, viewPeriod, onClose }: ReportViewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
}
