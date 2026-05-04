import { useState, useEffect } from 'react';

export default function ExpenseManager() {
  const [formData, setFormData] = useState({
    nama_pengeluaran: '',
    nominal: '',
    // Perbaikan: Format tanggal harus YYYY-MM-DD agar input type="date" bisa membacanya
    tanggal: new Date().toISOString().split('T')[0] 
  });

  const [expenses, setExpenses] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pengeluaran');
        if (response.ok) {
          const data = await response.json();
          setExpenses(data); 
        }
      } catch (error) {
        console.error("Gagal mengambil data pengeluaran:", error);
      }
    };

    fetchExpenses();
  }, [refreshTrigger]); 

  // Fungsi Tambah Data
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/pengeluaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nominal: Number(formData.nominal)
        })
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");
      
      alert("Pengeluaran berhasil dicatat!");
      setFormData({ nama_pengeluaran: '', nominal: 0, tanggal: new Date().toISOString().split('T')[0] });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan pengeluaran.");
    }
  };

  // Fungsi Hapus Satuan (Manual)
  const handleDelete = async (id_pengeluaran) => {
    if(window.confirm('Yakin ingin menghapus pengeluaran ini?')) {
      try {
        await fetch(`http://localhost:5000/api/pengeluaran/${id_pengeluaran}`, { method: 'DELETE' });
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  // Fungsi Hapus Massal (Data Lebih dari 1 Bulan)
  const handleMonthlyCleanup = async () => {
    if(window.confirm('Yakin ingin menyapu bersih semua data pengeluaran yang lebih lama dari 1 bulan?')) {
      try {
        const response = await fetch('http://localhost:5000/api/pengeluaran-cleanup', { method: 'DELETE' });
        const data = await response.json();
        alert(data.message); // Menampilkan notifikasi berapa baris yang terhapus
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Gagal membersihkan data:", error);
      }
    }
  };

  return (
    <div className="expense-manager">
      <h2>Catat Pengeluaran Toko</h2>
      <form onSubmit={handleSaveExpense}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Nama/Keterangan Pengeluaran" 
            value={formData.nama_pengeluaran} 
            onChange={(e) => setFormData({...formData, nama_pengeluaran: e.target.value})} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="number" 
            placeholder="Nominal (Rp)" 
            value={formData.nominal} 
            onChange={(e) => setFormData({...formData, nominal: e.target.value})} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="date" 
            value={formData.tanggal} 
            onChange={(e) => setFormData({...formData, tanggal: e.target.value})} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Simpan Pengeluaran</button>
      </form>

      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Riwayat Pengeluaran</h3>
          {/* Tombol Sapu Bersih Bulanan */}
          <button 
            onClick={handleMonthlyCleanup} 
            style={{ backgroundColor: '#FF9800', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}
          >
            Bersihkan Data &gt; 1 Bulan
          </button>
        </div>

        <div className="expense-list">
          {expenses.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Belum ada data pengeluaran.</p>
          ) : (
            expenses.map((exp, index) => (
              <div className="card" key={exp.id_pengeluaran || index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px', 
                marginTop: '10px',
                border: '1px solid #eaeaea',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{exp.nama_pengeluaran}</h4>
                  <small style={{ color: '#888' }}>{exp.tanggal.substring(0, 10)}</small>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#F44336' }}>
                    - Rp{Number(exp.nominal).toLocaleString('id-ID')}
                  </span>
                  {/* Tombol Hapus Satuan */}
                  <button className="btn btn-danger" onClick={() => handleDelete(exp.id_pengeluaran)}>Hapus</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}