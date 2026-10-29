let histogramInstance = null;
let polygonInstance = null;
let ogiveInstance = null;

function prosesData() {
    const inputTeks = document.getElementById('dataInput').value;
    const data = inputTeks
        .split(/[\s,]+/)
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => Number(item))
        .filter(Number.isFinite);

    if (data.length < 2) {
        alert("Harap masukkan minimal 2 angka yang valid!");
        return;
    }

    data.sort((a, b) => a - b);

    const n = data.length;
    const min = data[0];
    const max = data[n - 1];
    const range = max - min;
    const k = Math.max(1, Math.round(1 + 3.322 * Math.log10(n)));
    const p = Math.max(1, Math.ceil(range / k));
    const meanTunggal = data.reduce((sum, value) => sum + value, 0) / n;

    const freqMap = new Map();
    data.forEach(value => freqMap.set(value, (freqMap.get(value) || 0) + 1));
    const maxFreq = Math.max(...freqMap.values());
    const modusTunggalList = [...freqMap.entries()]
        .filter(([, frequency]) => frequency === maxFreq)
        .map(([value]) => value);
    const strModusTunggal = maxFreq === 1
        ? "Tidak ada modus"
        : modusTunggalList.join(", ");

    const nilaiPositif = data.every(value => value > 0);
    const ukurTunggal = nilaiPositif
        ? Math.pow(10, data.reduce((sum, value) => sum + Math.log10(value), 0) / n).toFixed(2)
        : "Tidak dapat dihitung (semua nilai harus > 0)";
    const harmonikTunggal = nilaiPositif
        ? (n / data.reduce((sum, value) => sum + (1 / value), 0)).toFixed(2)
        : "Tidak dapat dihitung (semua nilai harus > 0)";

    let limitBawah = min;
    let sumFX = 0;
    let sumFXLogX = 0;
    let sumFXDivX = 0;
    const kelasList = [];
    const labelInterval = [];
    const dataFrekuensi = [];

    for (let i = 0; i < k; i++) {
        const limitAtas = limitBawah + p - 1;
        const frekuensi = data.filter(value => value >= limitBawah && value <= limitAtas).length;
        const mid = (limitBawah + limitAtas) / 2;

        kelasList.push({
            index: i + 1,
            limitBawah,
            limitAtas,
            mid,
            frekuensi,
            tb: limitBawah - 0.5,
            ta: limitAtas + 0.5
        });
        labelInterval.push(`${limitBawah} - ${limitAtas}`);
        dataFrekuensi.push(frekuensi);
        sumFX += frekuensi * mid;
        if (mid > 0) {
            sumFXLogX += frekuensi * Math.log10(mid);
            sumFXDivX += frekuensi / mid;
        }

        limitBawah = limitAtas + 1;
    }

    const meanKelompok = sumFX / n;
    const maxClassIdx = kelasList.reduce(
        (maxIndex, kelas, index, kelasSemua) =>
            kelas.frekuensi > kelasSemua[maxIndex].frekuensi ? index : maxIndex,
        0
    );
    const classModus = kelasList[maxClassIdx];
    const fPrev = maxClassIdx > 0 ? kelasList[maxClassIdx - 1].frekuensi : 0;
    const fNext = maxClassIdx < k - 1 ? kelasList[maxClassIdx + 1].frekuensi : 0;
    const d1 = classModus.frekuensi - fPrev;
    const d2 = classModus.frekuensi - fNext;
    const modusKelompok = d1 + d2 > 0
        ? classModus.tb + (d1 / (d1 + d2)) * p
        : classModus.mid;

    const nilaiKelasPositif = kelasList.every(kelas => kelas.mid > 0);
    const ukurKelompok = nilaiKelasPositif
        ? Math.pow(10, sumFXLogX / n).toFixed(2)
        : "Tidak dapat dihitung (titik tengah kelas harus > 0)";
    const harmonikKelompok = nilaiKelasPositif
        ? (n / sumFXDivX).toFixed(2)
        : "Tidak dapat dihitung (titik tengah kelas harus > 0)";

    let kumulatifKurang = 0;
    let totalKumulatifLebih = n;
    const ogiveLabels = [kelasList[0].tb];
    const dataOgivePositif = [0];
    const dataOgiveNegatif = [n];
    const tableRows = [];

    kelasList.forEach(kelas => {
        kumulatifKurang += kelas.frekuensi;
        const fkLebih = totalKumulatifLebih;
        totalKumulatifLebih -= kelas.frekuensi;

        ogiveLabels.push(kelas.ta);
        dataOgivePositif.push(kumulatifKurang);
        dataOgiveNegatif.push(totalKumulatifLebih);

        tableRows.push(`
            <tr>
                <td>${kelas.index}</td>
                <td><strong>${kelas.limitBawah} - ${kelas.limitAtas}</strong></td>
                <td>${kelas.frekuensi}</td>
                <td>${((kelas.frekuensi / n) * 100).toFixed(1)}%</td>
                <td>${kumulatifKurang}</td>
                <td>${fkLebih}</td>
                <td>${((kumulatifKurang / n) * 100).toFixed(1)}%</td>
            </tr>
        `);
    });

    document.getElementById('tableBody').innerHTML = tableRows.join('');
    document.getElementById('valN').innerText = n;
    document.getElementById('valMinMax').innerText = `${min} / ${max}`;
    document.getElementById('valrange').innerText = range;
    document.getElementById('valkelas').innerText = k;
    document.getElementById('valPanjang').innerText = p;
    document.getElementById('meanTunggal').innerText = meanTunggal.toFixed(2);
    document.getElementById('meanKelompok').innerText = meanKelompok.toFixed(2);
    document.getElementById('modusTunggal').innerText = strModusTunggal;
    document.getElementById('modusKelompok').innerText = modusKelompok.toFixed(2);
    document.getElementById('UkurTunggal').innerText = ukurTunggal;
    document.getElementById('UkurKelompok').innerText = ukurKelompok;
    document.getElementById('HarmonikTunggal').innerText = harmonikTunggal;
    document.getElementById('HarmonikKelompok').innerText = harmonikKelompok;
    document.getElementById('resultSection').classList.remove('hidden');

    if (typeof Chart === 'undefined') {
        alert("Pustaka Chart.js tidak berhasil dimuat. Tabel dan ringkasan tetap tersedia, tetapi grafik tidak dapat ditampilkan.");
    } else {
        renderChart(labelInterval, dataFrekuensi);
        renderOgiveChart(ogiveLabels, dataOgivePositif, dataOgiveNegatif);
    }

}

function renderChart(labels, data) {
    const ctxHistogram = document.getElementById('histogramChart').getContext('2d');
    const ctxPolygon = document.getElementById('polygonChart').getContext('2d');

    if (histogramInstance) histogramInstance.destroy();
    if (polygonInstance) polygonInstance.destroy();

    histogramInstance = new Chart(ctxHistogram, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Frekuensi',
                data,
                borderColor: '#f05a24',
                backgroundColor: 'rgba(240, 90, 36, 0.7)',
                borderWidth: 2.5,
                categoryPercentage: 1.0,
                barPercentage: 1.0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Frekuensi (f)' },
                    ticks: { precision: 0 }
                },
                x: { title: { display: true, text: 'Interval Kelas' } }
            }
        }
    });

    polygonInstance = new Chart(ctxPolygon, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Frekuensi',
                data,
                borderColor: '#e06e1c',
                backgroundColor: 'rgba(240, 90, 36, 0.12)',
                fill: false,
                borderWidth: 3,
                tension: 0.1,
                pointRadius: 5,
                pointBackgroundColor: '#a84a07',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Frekuensi (f)' },
                    ticks: { precision: 0 }
                },
                x: { title: { display: true, text: 'Interval Kelas' } }
            }
        }
    });
}

function renderOgiveChart(labels, ogivePositif, ogiveNegatif) {
    const ctxOgive = document.getElementById('ogiveChart').getContext('2d');
    if (ogiveInstance) ogiveInstance.destroy();

    ogiveInstance = new Chart(ctxOgive, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Ogive Positif (≤)',
                    data: ogivePositif,
                    borderColor: '#2563eb',
                    backgroundColor: '#2563eb',
                    tension: 0.2,
                    fill: false
                },
                {
                    label: 'Ogive Negatif (≥)',
                    data: ogiveNegatif,
                    borderColor: '#dc2626',
                    backgroundColor: '#dc2626',
                    tension: 0.2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Batas / Tepi Kelas' } },
                y: {
                    title: { display: true, text: 'Frekuensi Kumulatif' },
                    beginAtZero: true
                }
            }
        }
    });
}
