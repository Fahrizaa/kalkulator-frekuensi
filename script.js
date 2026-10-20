// 1. Deklarasikan variabel global untuk menyimpan objek chart
let histogramInstance = null;
let polygonInstance = null;

function prosesData() {
    // Ambil teks dari textarea
    const inputTeks = document.getElementById('dataInput').value;

    // Olah teks menjadi array angka valid
    let data = inputTeks
        .split(/[\s,]+/)
        .map(item => parseFloat(item.trim()))
        .filter(item => !isNaN(item));

    if (data.length < 2) {
        alert("Harap masukkan minimal 2 angka yang valid!");
        return;
    }

    // Urutkan data dari terkecil ke terbesar
    data.sort((a, b) => a - b);

    // Hitung komponen statistik dasar
    const n = data.length;        
    const min = data[0];          
    const max = data[n - 1];      
    const range = max - min;      

    const k = Math.round(1 + 3.322 * Math.log10(n));

    let p = Math.ceil(range / k);
    if (p === 0) p = 1; 
    
    // Tampilkan nilai ringkasan ke DOM
    document.getElementById('valN').innerText = n;
    document.getElementById('valMinMax').innerText = `${min} / ${max}`;
    document.getElementById('valrange').innerText = range;
    document.getElementById('valkelas').innerText = k;
    document.getElementById('valPanjang').innerText = p;

    // Buat tabel frekuensi & siapkan array penampung data grafik
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; 

    let limitBawah = min;
    let kumulatif = 0;

    // Array penampung data untuk dikirim ke Chart.js
    let labelInterval = [];
    let dataFrekuensi = [];

    for (let i = 1; i <= k; i++) {
        let limitAtas = limitBawah + p - 1;
        let frekuensi = data.filter(val => val >= limitBawah && val <= limitAtas).length;

        let frekuensiRelatif = ((frekuensi / n) * 100).toFixed(1) + '%';
        kumulatif += frekuensi;

        // Simpan label interval dan frekuensi ke array
        labelInterval.push(`${limitBawah} - ${limitAtas}`);
        dataFrekuensi.push(frekuensi);

        // Buat baris tabel baru
        let row = `
        <tr>
            <td>${i}</td>
            <td><strong>${limitBawah} - ${limitAtas}</strong></td>
            <td>${frekuensi}</td>
            <td>${frekuensiRelatif}</td>
            <td>${kumulatif}</td>
            <td>${((kumulatif / n) * 100).toFixed(1) + '%'}</td>
        </tr>`;

        tableBody.innerHTML += row;
        limitBawah = limitAtas + 1;
    }

    // Tampilkan bagian hasil
    document.getElementById('resultSection').classList.remove('hidden');

    //Menghubungkan fungsi grafik
    renderChart(labelInterval, dataFrekuensi);

}

// Fungsi untuk menggambar Histogram dan Poligon
function renderChart(labels, data) {
    const ctxHistogram = document.getElementById('histogramChart').getContext('2d');
    const ctxPolygon = document.getElementById('polygonChart').getContext('2d');
    // Hapus grafik lama jika pengguna menekan tombol hitung ulang
    if (histogramInstance) histogramInstance.destroy();
    if (polygonInstance) polygonInstance.destroy();
    // Grafik1: Histogram
    histogramInstance = new Chart(ctxHistogram, {
        type: 'bar', 
        data: {
            labels: labels,
            datasets: [
                {
                    // Dataset 1: Poligon Frekuensi (Garis)
                    label: 'Frekuensi',
                    data: data,
                    borderColor: '#f05a24',
                    backgroundColor: 'rgba(240, 90, 36, 0.7)',
                    borderWidth: 2.5,
                    // mengatur agar batang menempel tanpa celah
                    categoryPercentage: 1.0,
                    barPercentage: 1.0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {display: false} //sembunyikan legenda krn judul sudah ada di kartu
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frekuensi (f)'
                    },
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Interval Kelas'
                    }
                }
            }
        
        }
    });

    //Grafik 2: Poligon Frekuensi
    polygonInstance = new Chart (ctxPolygon, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: '#e06e1c',
                backgroundColor: 'rgba(240, 90, 36, 0, 0.12)',
                fill: false,
                borderWidth: 3,
                tension: 0.1,
                pointRadius: 5,
                pointBackgroundColor: '#a84a07',
                pointBorderColor: ' #ffffff',
                pointBorderWidth: 2
            }]
           
        },
        options: {
            responsive: true,
            plugins:{
                legend: {display:false}
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true, text: 'Frekuensi (f)'
                    },
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    title: {
                        display: true, text: 'interval kelas'
                    }
                }
            }
        }
    });
}