# Satu sumber frontend invesg

Sumber website publik dan member yang harus diedit:

E:/invesg/02. Website/invesg-landing/src

Aset/logo/marble: public/assets pada folder induk yang sama. Template HTML: index.html pada folder induk.

invesg-backend-unified/frontend-landing/src, public dan tests adalah junction ke sumber induk, bukan salinan terpisah. Perintah npm dalam folder frontend-landing meneruskan ke folder induk. Konfigurasi Vite dalam folder tersebut juga memakai konfigurasi induk. Jangan mengedit dist, public/site atau public/build karena semuanya hasil build.

## Development dengan pembaruan otomatis

Terminal 1, folder E:/invesg/02. Website/invesg-landing/invesg-backend-unified:

```powershell
php artisan serve --host=localhost --port=8000
```

Terminal 2, folder E:/invesg/02. Website/invesg-landing:

```powershell
npm run dev
```

Buka http://localhost:8000, bukan HTML file langsung. Vite memakai port 5173 sebagai pemasok modul/HMR; navigasi, cookie dan API website tetap melalui localhost:8000. Perubahan React/CSS biasanya langsung tampil melalui HMR, dan beberapa perubahan memicu reload halaman. Aset public/assets juga berasal dari sumber yang sama dan tidak perlu disalin manual.

Saat Vite berhenti, Laravel otomatis memakai build terakhir di invesg-backend-unified/public/site. Jika Vite terhenti paksa dan meninggalkan site.hot, Laravel memeriksa apakah server masih hidup sebelum memakainya. Tanpa Vite, perubahan sumber memerlukan npm run build dan refresh browser.

## Build tanpa Vite berjalan

Dari folder induk invesg-landing:

```powershell
npm run build
```

Output langsung ke invesg-backend-unified/public/site. Tidak ada tahap salin frontend manual. Laravel public/assets memakai junction ke public/assets induk; helper build juga menyediakan penyalinan untuk lingkungan yang tidak bisa membuat link.

Tes frontend dari folder induk: npm test.

## Admin workspace

Admin tetap terpisah dari website publik karena memiliki komponen pengelola sendiri. Sumber: invesg-backend-unified/resources/js dan invesg-backend-unified/resources/css. Logo dan aset brand tetap berasal dari public/assets induk yang sama.

Dari folder induk:

```powershell
npm run build:admin
```

Atau npm run build dari folder invesg-backend-unified. Untuk HMR admin opsional, jalankan npm run dev:admin dari folder induk di terminal tambahan. Server admin memakai port 5174 dan penanda public/hot; frontend publik memakai port 5173 dan penanda public/site.hot, sehingga keduanya tidak saling menimpa. Tetap buka http://localhost:8000/admin.

## Konfigurasi dan data

.env dan kredensial tidak diubah. Vite tetap membaca envDir invesg-backend-unified/frontend-landing, mempertahankan konfigurasi API frontend yang sudah berfungsi. Tidak perlu membuat atau menyalin .env baru. Admin/API/auth/pembayaran tetap memakai backend Laravel yang sama.

Checkpoint sebelum penyatuan:
E:/invesg/02. Website/invesg-landing/invesg-backend-unified/storage/app/checkpoints/20261102-171614-single-frontend

Perbandingan sebelum perubahan: 71 berkas berbeda, 12 tambahan pada frontend terintegrasi, 0 berkas hanya di frontend induk. Versi terintegrasi yang memiliki integrasi API/sesi dan seluruh revisi visual terakhir dipertahankan di sumber induk. Seluruh sumber lama, perbedaan teks, dan aset tersimpan di checkpoint. Junction adalah pengaturan lokal Windows; setelah memindahkan/clone project, perintah dan konfigurasi tetap memakai sumber induk, tetapi link lokal perlu diperiksa kembali.

## Pemeriksaan

- Build frontend dari induk berhasil; 67 tes frontend lulus.
- Build admin berhasil; 3 tes workspace lulus.
- 57 tes backend lulus, 2 tes konkurensi MySQL dilewati.
- HTTP localhost:8000 memuat main.jsx, Vite client dan React refresh dari port 5173 saat development. /admin tetap menggunakan entry admin.
- HMR diuji melalui WebSocket: perubahan CSS sementara di sumber induk menghasilkan pesan pembaruan. File sementara dibersihkan setelah pengujian.
- Setelah Vite dimatikan, Home dan Library kembali menyajikan build statis dengan status 200.
- Belum memverifikasi tampilan atau interaksi HMR langsung pada browser. Tidak melakukan pembayaran sandbox baru, pengiriman email atau perubahan database selama pengujian.


## Git handover 9 November 2026

Dua repository tetap independen: frontend baktiwijaya/invesg-landing, backend arif10003/invesg-backend-unified. Checkout frontend sebagai invesg-landing dan backend di invesg-landing/invesg-backend-unified; gunakan pasangan SHA aplikasi pada laporan CTO. Git induk mengabaikan folder backend, bukan submodule/embedded gitlink.

247 alias frontend-landing/src, public dan tests dihentikan tracking-nya pada backend melalui index saja. Junction lokal dan source fisik dipertahankan. Clone tidak perlu membuat junction tersebut untuk build kanonis; wrapper tetap meneruskan ke induk. Runtime assets dapat dilink/copy oleh helper lokal, tetapi paket deployment harus memuat file nyata.

469 deletion historis pada prefix invesg-unified sengaja BELUM di-commit sampai review CTO. Karena itu clean clone induk masih membawa tree historis tersebut: jangan menjadikannya aplikasi aktif, menjalankan installer overlay lama, atau mengeditnya untuk revisi frontend.

CI berpasangan memerlukan akses baca private lintas repository dan partner SHA yang eksplisit. Secret belum disiapkan; push ditahan sesuai instruksi pemilik. Lihat invesg-backend-unified/docs/GIT_HANDOVER_2026-11-09.md dan invesg-unified/docs/cto-handover-2026-11-09.md. Tidak ada fallback branch atau akses anonymous yang diasumsikan.
