# Catat Uang — Source Code

Versi 4, sesuai publikasi terakhir pada 25 September 2026.
Commit: 96df3e698fc7070470a6748d725a10ffae24eadb

Aplikasi keuangan pribadi berbasis HTML, CSS, dan JavaScript biasa (tanpa React).
Tidak memerlukan npm install, build, API key, akun, atau database server.

## Menjalankan di laptop
1. Clone repo ini.
2. Buka terminal di folder repo.
3. Jika Python tersedia, jalankan:

   python -m http.server 8000

   Pada sebagian komputer, gunakan python3 menggantikan python.
4. Buka http://localhost:8000 di browser.

Jangan mengandalkan klik dua kali index.html untuk mencoba PWA.
Service worker memerlukan localhost atau HTTPS.

## Hosting
Repo ini otomatis di-deploy ke GitHub Pages (branch gh-pages) setiap push ke main.
Bisa juga diunggah ke hosting web statis lain yang mendukung HTTPS.
Tidak diperlukan proses build. index.html adalah halaman utama.

## Susunan file
- index.html: struktur halaman dan navigasi.
- style.css: desain brutalism, responsive layout, animasi scratch.
- app.js: transaksi, dompet, kategori, penyimpanan, format nominal, ekspor/impor.
- icons.js: ikon SVG antarmuka.
- sw.js: service worker dan cache offline.
- manifest.webmanifest: pengaturan instalasi PWA.
- icon.svg, icon-192.png, icon-512.png: ikon aplikasi.

## Data dan cadangan
Catatan tersimpan di localStorage pada browser/perangkat yang dipakai.
Repo ini berisi kode aplikasi, bukan catatan keuangan pribadi.
Sebelum berpindah URL/hosting, ekspor JSON dari aplikasi lama lalu impor di URL baru.
CSV adalah laporan transaksi; gunakan JSON untuk memulihkan seluruh data.
Mengimpor JSON mengganti seluruh data setelah konfirmasi.

## Pembaruan kode
Saat mengubah aset, naikkan versi CACHE di sw.js agar cache lama diganti,
dan samakan APP_VERSION di app.js (tampil di bawah halaman Pengaturan).
Jangan mengganti KEY catat-uang-v1 di app.js tanpa migrasi data.
Penyimpanan data dan cache aplikasi menggunakan mekanisme berbeda.

## Fitur
- Pemasukan, pengeluaran, edit/hapus transaksi dan pencarian/filter.
- Kategori custom, arsip kategori, beberapa dompet dan transfer.
- Saldo dan ringkasan bulanan.
- Ekspor/impor JSON dan ekspor CSV.
- Titik pemisah ribuan otomatis saat input nominal.
- Navigasi bawah ringkas, ikon garis tebal, efek scratch.
- PWA dengan dukungan offline setelah aset berhasil dicache.
