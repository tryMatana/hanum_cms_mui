import { type Dispatch, type SetStateAction } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';

import type { Period, NewPeriodForm } from './user-view-types';

interface UserViewDialogProps {
  openView: boolean;
  viewPeriod: Period | null;
  onCloseView: () => void;
  onOpenAddFromView: () => void;
  onEditFromView: () => void;
  onDeleteCurrent: (id: string) => void;
}

interface UserAddDialogProps {
  openAdd: boolean;
  onCloseAdd: () => void;
  newPeriod: NewPeriodForm;
  setNewPeriod: Dispatch<SetStateAction<NewPeriodForm>>;
  errors: Record<string, string>;
  onSubmitAdd: () => void;
  tahunAjaranOptions: string[];
}

export function UserViewDialog({
  openView,
  viewPeriod,
  onCloseView,
  onOpenAddFromView,
  onEditFromView,
  onDeleteCurrent,
}: UserViewDialogProps) {
  return (
    <Dialog fullScreen open={openView} onClose={onCloseView}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '4px solid #1AA260' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button startIcon={<Iconify icon="solar:eye-bold" />} onClick={onCloseView}>
              Kembali
            </Button>
            <Typography variant="h6" sx={{ ml: 2 }}>
              Detail Periode Akademik
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button color="success" variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={onOpenAddFromView}>
              Tambah Baru
            </Button>
            <Button color="warning" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />} onClick={onEditFromView}>
              Edit
            </Button>
            <Button
              color="error"
              variant="contained"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => viewPeriod && onDeleteCurrent(viewPeriod.id)}
              disabled={!viewPeriod}
            >
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
  );
}

export function UserAddDialog({
  openAdd,
  onCloseAdd,
  newPeriod,
  setNewPeriod,
  errors,
  onSubmitAdd,
  tahunAjaranOptions,
}: UserAddDialogProps) {
  return (
    <Dialog fullScreen open={openAdd} onClose={onCloseAdd}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '4px solid #1AA260' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onCloseAdd} aria-label="back">
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Data Periode Akademik
          </Typography>

          <Button color="info" variant="contained" sx={{ mr: 1 }} onClick={onCloseAdd}>
            Kembali ke Daftar
          </Button>
          <Button color="success" variant="contained" onClick={onSubmitAdd}>
            Simpan
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <Box sx={{ p: 4, width: '100%', maxWidth: '1600px', mx: 'auto', overflow: 'auto' }}>
          <OutlinedInput
            fullWidth
            placeholder="Cari Periode Akademik"
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            }
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, width: '100%', m: 0, alignItems: 'flex-start' }}>
            <Box>
              <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Kode Periode (5 angka)"
                    value={newPeriod.kode || ''}
                    onChange={(e) => setNewPeriod((s) => ({ ...s, kode: e.target.value.replace(/[^0-9]/g, '') }))}
                    error={!!errors.kode}
                    helperText={errors.kode}
                    inputProps={{ maxLength: 5 }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    select
                    label="Tahun Ajaran"
                    value={newPeriod.tahunAjaran || ''}
                    onChange={(e) => setNewPeriod((s) => ({ ...s, tahunAjaran: e.target.value }))}
                    error={!!errors.tahunAjaran}
                    helperText={errors.tahunAjaran}
                  >
                    <MenuItem value="">-- Pilih Tahun Ajaran --</MenuItem>
                    {tahunAjaranOptions.map((tahun) => (
                      <MenuItem key={tahun} value={tahun}>
                        {tahun}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    select
                    label="Semester"
                    value={newPeriod.semester || ''}
                    onChange={(e) => setNewPeriod((s) => ({ ...s, semester: e.target.value }))}
                    error={!!errors.semester}
                    helperText={errors.semester}
                  >
                    <MenuItem value="">-- Pilih Semester --</MenuItem>
                    <MenuItem value="Ganjil">Ganjil</MenuItem>
                    <MenuItem value="Genap">Genap</MenuItem>
                    <MenuItem value="Pendek">Pendek</MenuItem>
                  </TextField>
                </Box>

                <TextField
                  fullWidth
                  label="Nama Periode"
                  value={newPeriod.namaPeriode || ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, namaPeriode: e.target.value }))}
                  error={!!errors.namaPeriode}
                  helperText={errors.namaPeriode}
                />
                <TextField
                  fullWidth
                  label="Nama Singkat"
                  value={newPeriod.namaSingkat || ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, namaSingkat: e.target.value }))}
                  error={!!errors.namaSingkat}
                  helperText={errors.namaSingkat}
                />
                <TextField
                  fullWidth
                  label="Tanggal Awal Kuliah"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newPeriod.tglAwal ? (newPeriod.tglAwal instanceof Date ? newPeriod.tglAwal.toISOString().slice(0, 10) : String(newPeriod.tglAwal)) : ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, tglAwal: e.target.value ? new Date(e.target.value) : null }))}
                  error={!!errors.tglAwal}
                  helperText={errors.tglAwal}
                />
                <TextField
                  fullWidth
                  label="Tanggal Akhir Kuliah"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newPeriod.tglAkhir ? (newPeriod.tglAkhir instanceof Date ? newPeriod.tglAkhir.toISOString().slice(0, 10) : String(newPeriod.tglAkhir)) : ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, tglAkhir: e.target.value ? new Date(e.target.value) : null }))}
                  error={!!errors.tglAkhir}
                  helperText={errors.tglAkhir}
                />
                <TextField
                  fullWidth
                  label="Tanggal Awal UTS (opsional)"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newPeriod.tglUTS ? (newPeriod.tglUTS instanceof Date ? newPeriod.tglUTS.toISOString().slice(0, 10) : String(newPeriod.tglUTS)) : ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, tglUTS: e.target.value ? new Date(e.target.value) : null }))}
                />
              </Box>
            </Box>

            <Box>
              <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
                <TextField
                  fullWidth
                  label="Tanggal Akhir UTS (opsional)"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newPeriod.tglUAS ? (newPeriod.tglUAS instanceof Date ? newPeriod.tglUAS.toISOString().slice(0, 10) : String(newPeriod.tglUAS)) : ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, tglUAS: e.target.value ? new Date(e.target.value) : null }))}
                />
                <TextField
                  fullWidth
                  label="Tanggal Awal UAS (opsional)"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newPeriod.tglAwalUAS ? (newPeriod.tglAwalUAS instanceof Date ? newPeriod.tglAwalUAS.toISOString().slice(0, 10) : String(newPeriod.tglAwalUAS)) : ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, tglAwalUAS: e.target.value ? new Date(e.target.value) : null }))}
                />
                <TextField
                  fullWidth
                  label="Tanggal Akhir UAS (opsional)"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newPeriod.tglAkhirUAS ? (newPeriod.tglAkhirUAS instanceof Date ? newPeriod.tglAkhirUAS.toISOString().slice(0, 10) : String(newPeriod.tglAkhirUAS)) : ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, tglAkhirUAS: e.target.value ? new Date(e.target.value) : null }))}
                />
                <TextField
                  fullWidth
                  label="Ketua Ujian"
                  value={newPeriod.ketuaUjian || ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, ketuaUjian: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Jumlah Pertemuan Kuliah"
                  type="number"
                  value={newPeriod.jumlahPertemuan ?? ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, jumlahPertemuan: e.target.value === '' ? '' : Number(e.target.value) }))}
                  error={!!errors.jumlahPertemuan}
                  helperText={errors.jumlahPertemuan}
                />
                <TextField
                  fullWidth
                  label="Minimal Presensi (persentase)"
                  type="number"
                  value={newPeriod.minimalPresensi ?? ''}
                  onChange={(e) => setNewPeriod((s) => ({ ...s, minimalPresensi: e.target.value === '' ? '' : Number(e.target.value) }))}
                  error={!!errors.minimalPresensi}
                  helperText={errors.minimalPresensi}
                  inputProps={{ min: 0, max: 100 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                  <Typography>Aktif?</Typography>
                  <FormControlLabel
                    control={<Switch checked={!!newPeriod.aktif} onChange={(e) => setNewPeriod((s) => ({ ...s, aktif: e.target.checked }))} />}
                    label=""
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
