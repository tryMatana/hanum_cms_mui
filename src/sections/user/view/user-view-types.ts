export type Period = {
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

export type NewPeriodForm = {
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

export type UserTableState = {
  page: number;
  order: 'asc' | 'desc';
  orderBy: string;
  rowsPerPage: number;
  selected: string[];
  onSort: (id: string) => void;
  onSelectAllRows: (checked: boolean, newSelecteds: string[]) => void;
  onSelectRow: (id: string) => void;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetPage: () => void;
};
