// JAVASCRIPT: Logika Aplikasi

// Kunci penyimpanan di Local Storage
const STORAGE_KEY = 'txTravelData';

// Fungsi format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Fungsi untuk mengambil data dari Local Storage
function loadData() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = ''; // Kosongkan tabel sebelum load

    data.forEach((item, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.tanggal}</td>
            <td>${item.namaProduk}</td>
            <td>${formatRupiah(item.hargaBasic)}</td>
            <td>${formatRupiah(item.ppn)}</td>
            <td>${formatRupiah(item.visaGrup)}</td>
            <td>${formatRupiah(item.tipping)}</td>
            <td>${formatRupiah(item.komisi)}</td>
            <td class="total-row">${formatRupiah(item.totalHarga)}</td>
            <td><button class="delete-btn" onclick="hapusBaris(${index})">Hapus</button></td>
        `;
        tableBody.appendChild(newRow);
    });
}

// Fungsi untuk menyimpan data ke Local Storage
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Event Listener saat tombol Submit ditekan
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Ambil nilai dari input
    const tanggal = document.getElementById('tanggal').value;
    const namaProduk = document.getElementById('namaProduk').value;
    const hargaBasic = parseFloat(document.getElementById('hargaBasic').value) || 0;
    const visaGrup = parseFloat(document.getElementById('visaGrup').value) || 0;
    const tipping = parseFloat(document.getElementById('tipping').value) || 0;
    const komisi = parseFloat(document.getElementById('komisi').value) || 0;

    // 2. Hitung PPN (1.1%)
    const ppn = hargaBasic * 0.011;

    // 3. Hitung Total Harga (Tanpa Komisi)
    // Rumus: Basic + PPN + Visa + Tipping
    const totalHarga = hargaBasic + ppn + visaGrup + tipping;

    // 4. Buat Object Data Baru
    const newData = {
        tanggal,
        namaProduk,
        hargaBasic,
        ppn,
        visaGrup,
        tipping,
        komisi,
        totalHarga
    };

    // 5. Ambil data lama, tambahkan data baru, dan simpan
    const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    currentData.push(newData);
    saveData(currentData);

    // 6. Refresh tabel agar data muncul
    loadData();

    // 7. Reset Form
    document.getElementById('productForm').reset();
    document.getElementById('tanggal').valueAsDate = new Date();
});

// Fungsi Hapus Baris
function hapusBaris(index) {
    if(confirm('Yakin ingin menghapus data ini?')) {
        let currentData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Hapus data dari array
        currentData.splice(index, 1);
        
        // Simpan kembali ke Local Storage
        saveData(currentData);
        
        // Refresh tabel
        loadData();
    }
}

// Fungsi Reset Semua Data
function resetAllData() {
    if(confirm('PERINGATAN: Semua data akan dihapus permanen. Lanjutkan?')) {
        localStorage.removeItem(STORAGE_KEY);
        loadData(); // Ini akan mengosongkan tabel
    }
}

// Load data saat halaman pertama kali dibuka
window.onload = function() {
    loadData();