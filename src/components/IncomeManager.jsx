import { useState, useEffect } from 'react';
import './App.css';

export default function IncomeManager() {
  const [stocks, setStocks] = useState([]);
  const [incomes, setIncomes] = useState([]); // Variabel ini sekarang digunakan
  const [form, setForm] = useState({ id_barang: '', jumlah_terjual: 0, total_harga: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/stock')
      .then(res => res.json())
      .then(setStocks)
      .catch(err => console.error("Gagal load stok:", err));
      
    // Mengambil data pemasukan untuk ditampilkan
    fetch('http://localhost:5000/api/pemasukan')
      .then(res => res.json())
      .then(setIncomes)
      .catch(err => console.error("Gagal load pemasukan:", err));
  }, [refreshTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/pemasukan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      alert("Penjualan dicatat dan stok telah dikurangi otomatis!");
      
      // Reset form dan refresh data tanpa reload halaman
      setForm({ id_barang: '', jumlah_terjual: 0, total_harga: 0 });
      setRefreshTrigger(prev => prev + 1); 
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
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
            onChange={(e) => setForm({...form, id_barang: e.target.value})} 
            required
          >
            <option value="">-- Pilih Barang yang Terjual --</option>
            {stocks.map(s => (
              <option key={s.id} value={s.id}>
                {s.nama_barang} (Sisa: {s.jumlah}) - Rp{s.harga_jual}/pcs
              </option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Jumlah Terjual" 
            value={form.jumlah_terjual || ''}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            onChange={(e) => setForm({...form, jumlah_terjual: e.target.value})} 
            required 
          />
          
          <input 
            type="number" 
            placeholder="Total Harga (Rp)" 
            value={form.total_harga || ''}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            onChange={(e) => setForm({...form, total_harga: e.target.value})} 
            required 
          />

          <button type="submit" className="btn btn-primary">Simpan Pemasukan</button>
        </form>
      </div>

      {/* Menampilkan Riwayat Pemasukan */}
      <h3 style={{ color: 'var(--text)' }}>Riwayat Penjualan</h3>
      {incomes.length === 0 ? (
        <p style={{ color: '#888' }}>Belum ada riwayat penjualan.</p>
      ) : (
        incomes.map((income) => (
          <div className="card" key={income.id} style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#10b981' }}>{income.nama_barang}</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                  Terjual: {income.jumlah_terjual} pcs | Waktu: {new Date(income.tanggal).toLocaleString('id-ID')}
                </p>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a' }}>
                + Rp{income.total_harga}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}