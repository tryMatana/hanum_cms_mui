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

const isString = (value: unknown): value is string => Boolean(value) && typeof value === 'string';

export const getReportFilterOptions = (periods: Period[]) => ({
  kode: ['all', ...Array.from(new Set(periods.map((p) => p.kode).filter(isString)))],
  name: ['all', ...Array.from(new Set(periods.map((p) => p.name).filter(isString)))],
  tglAwal: ['all', ...Array.from(new Set(periods.map((p) => p.tglAwal).filter(isString)))],
  tglAkhir: ['all', ...Array.from(new Set(periods.map((p) => p.tglAkhir).filter(isString)))],
  tglAwalUTS: ['all', ...Array.from(new Set(periods.map((p) => p.tglAwalUTS ?? p.tglUTS).filter(isString)))],
  tglAwalUAS: ['all', ...Array.from(new Set(periods.map((p) => p.tglAwalUAS ?? p.tglUAS).filter(isString)))],
  status: ['all', ...Array.from(new Set(periods.map((p) => p.status).filter(isString)))],
});

const escapeValue = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const exportPeriodsToCsv = (selectedRows: Period[]) => {
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

export const printReportPeriods = (selectedRows: Period[]) => {
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

  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

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

          .report-divider {
            width: 100%;
            border-top: 4px solid #000;
            margin: 14px 0 30px;
          }

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

    if (iframe.contentWindow) {
      iframe.contentWindow.onafterprint = () => {
        document.body.removeChild(iframe);
      };
    }
  }, 500);
};
