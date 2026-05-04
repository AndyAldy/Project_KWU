import { useState, useEffect } from 'react';
import './App.css';

export default function IncomeManager() {
  const [stocks, setStocks] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({ id_barang: '', jumlah_terjual: '', total_harga: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/stock')
      .then(res => res.json())
      .then(setStocks)
      .catch(err => console.error("Gagal load stok:", err));
      
    fetch('http://localhost:5000/api/pemasukan')
      .then(res => res.json())
      .then(setIncomes)
      .catch(err => console.error("Gagal load pemasukan:", err));
  }, [refreshTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id_barang || form.id_barang === "") {
      alert("Peringatan: Silakan pilih barang dari dropdown terlebih dahulu!");
      return;
    }

    if (form.jumlah_terjual <= 0 || form.total_harga <= 0) {
      alert("Peringatan: Jumlah dan Total Harga harus lebih dari 0!");
      return;
    }

    try {
      const dataKirim = {
        id_barang: parseInt(form.id_barang),
        jumlah_terjual: parseInt(form.jumlah_terjual),
        total_harga: parseInt(form.total_harga)
      };

      const response = await fetch('http://localhost:5000/api/pemasukan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataKirim)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detail Error dari Server:", errorData);
        alert("Gagal mencatat penjualan! Cek Terminal Backend.");
        return; 
      }

      alert("Berhasil! Penjualan dicatat dan stok telah dikurangi otomatis!");
      
      setForm({ id_barang: '', jumlah_terjual: '', total_harga: '' });
      setRefreshTrigger(prev => prev + 1); 
    } catch (error) {
      console.error("Gagal mengirim data:", error);
      alert("Terjadi kesalahan sistem atau jaringan.");
    }
  };

// Fungsi Hapus Satuan (Manual)
  const handleDelete = async (id_pemasukan) => {
    if(window.confirm('Yakin ingin menghapus riwayat penjualan ini?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/pemasukan/${id_pemasukan}`, { 
          method: 'DELETE' 
        });

        // TAMBAHAN DARI ANGEL: Paksa sistem menampilkan error jika server menolak
        if (!response.ok) {
          alert(`Gagal menghapus! Status: ${response.status}. Pastikan server.js sudah di-restart dan endpoint DELETE tersedia.`);
          return; // Hentikan proses
        }

        // Jika berhasil, baru refresh datanya
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        alert("Gagal menghubungi server. Apakah server menyala?");
      }
    }
  };

  // [BARU] Fungsi Hapus Massal (Data Lebih dari 1 Bulan)
  const handleMonthlyCleanup = async () => {
    if(window.confirm('Yakin ingin menyapu bersih semua riwayat penjualan yang lebih lama dari 1 bulan?')) {
      try {
        const response = await fetch('http://localhost:5000/api/pemasukan', { method: 'DELETE' });
        const data = await response.json();
        alert(data.message); // Notifikasi jumlah baris yang dihapus
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Gagal membersihkan data:", error);
      }
    }
  };

  return (
    <div>
      <div className="card" style={{ display: 'block', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Catat Penjualan</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <select 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            value={form.id_barang}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedStock = stocks.find(s => s.id_stock == selectedId);
              const qty = form.jumlah_terjual;
              
              const calculatedTotal = selectedStock && qty ? selectedStock.harga_jual * qty : '';

              setForm({
                ...form, 
                id_barang: selectedId,
                total_harga: calculatedTotal
              });
            }} 
            required
          >
            <option value="">-- Pilih Barang yang Terjual --</option>
            {stocks.map(s => (
              <option key={s.id_stock} value={s.id_stock}>
                {s.nama_barang} (Sisa: {s.jumlah}) - Rp{s.harga_jual}/pcs
              </option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Jumlah Terjual" 
            value={form.jumlah_terjual || ''}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            onChange={(e) => {
              const qty = e.target.value;
              const selectedStock = stocks.find(s => s.id_stock == form.id_barang);
              
              const calculatedTotal = selectedStock && qty ? selectedStock.harga_jual * qty : '';

              setForm({
                ...form, 
                jumlah_terjual: qty,
                total_harga: calculatedTotal
              });
            }} 
            required 
          />
          
          <input 
            type="number" 
            placeholder="Total Harga" 
            value={form.total_harga || ''}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#f5f5f5', color: '#666' }}
            readOnly 
            required 
          />

          <button type="submit" className="btn btn-primary">Simpan Pemasukan</button>
        </form>
      </div>

      {/* Bagian Riwayat dengan Tombol Bersihkan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ color: 'var(--text)', margin: 0 }}>Riwayat Penjualan</h3>
        <button 
          onClick={handleMonthlyCleanup} 
          style={{ backgroundColor: '#FF9800', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Bersihkan Data &gt; 1 Bulan
        </button>
      </div>

      {incomes.length === 0 ? (
        <p style={{ color: '#888' }}>Belum ada riwayat penjualan.</p>
      ) : (
        incomes.map((pemasukan) => (
          <div className="card" key={pemasukan.id_pemasukan} style={{ display: 'block', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#10b981' }}>{pemasukan.nama_barang}</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                  Terjual: {pemasukan.jumlah_terjual} pcs | Waktu: {new Date(pemasukan.tanggal).toLocaleString('id-ID').replace(/\./g, ':')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a' }}>
                  + Rp{pemasukan.total_harga}
                </div>
                {/* Tombol Hapus Satuan */}
                <button className="btn btn-danger" onClick={() => handleDelete(pemasukan.id_pemasukan)}>Hapus</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}