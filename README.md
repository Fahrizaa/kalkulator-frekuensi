## 📊 Kalkulator Tabel Frekuensi & Pengolah Data Statistik

**Kalkulator Tabel Frekuensi** adalah aplikasi berbasis web interaktif yang dirancang untuk memproses sekumpulan data angka mentah menjadi tabel distribusi frekuensi lengkap, ukuran pemusatan data, serta visualisasi grafik statistik secara otomatis.

---

## Fitur Utama

* **Kalkulasi Komponen Dasar Statistik:**
  * Total data ($N$), Nilai Minimum/Maksimum, dan Jangkauan Data ($R$).
  * Jumlah Kelas ($k$) menggunakan **Aturan Sturges**: $k = 1 + 3.322 \log_{10}(N)$.
  * Panjang Kelas ($p$).
* **Ringkasan Ukuran Pemusatan Data:**
  * **Rata-Rata Hitung (Mean)** – Data Tunggal & Data Kelompok.
  * **Modus** – Data Tunggal & Data Kelompok.
  * **Rata-Rata Ukur (Geometric Mean)** – Data Tunggal & Data Kelompok.
  * **Rata-Rata Harmonik (Harmonic Mean)** – Data Tunggal & Data Kelompok.
* **Tabel Distribusi Frekuensi Lengkap:**
  * Interval Kelas.
  * Frekuensi ($f$) dan Frekuensi Relatif (%).
  * Frekuensi Kumulatif Kurang Dari ($\le$) dan Lebih Dari ($\ge$).
  * Frekuensi Kumulatif Relatif (%).
* **Visualisasi Grafik Interaktif (Chart.js):**
  * **Histogram Frekuensi**
  * **Poligon Frekuensi**
  * **Ogive Positif ($\le$) & Ogive Negatif ($\ge$)**
* **Desain Responsif:** Tampilan antarmuka modern yang nyaman digunakan di perangkat desktop maupun seluler.

---

## Teknologi yang Digunakan

* **HTML5** – Struktur halaman web.
* **CSS3** – Desain antarmuka modern dengan variabel CSS dan layout responsif.
* **JavaScript (Vanilla JS)** – Logika perhitungan statistik, manipulasi DOM, dan pengolahan array.
* **[Chart.js (v4.4.1)](https://www.chartjs.org/)** – Rendering grafik interaktif (Histogram, Poligon, & Ogive).
* **Google Fonts** – Font *Plus Jakarta Sans*.

---

## Struktur Berkas

```text
kalkulator-frekuensi/
├── index.html    # Struktur HTML utama
├── style.css     # Styling CSS & variabel tema
├── script.js     # Logika kalkulasi statistik & Chart.js
└── README.md     # Dokumentasi repositori
