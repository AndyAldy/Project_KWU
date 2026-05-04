import { useState } from 'react';

export default function ExpenseManager() {
  const [formData, setFormData] = useState({
    nama_pengeluaran: '',
    nominal: 0,
    tanggal: new Date().toISOString().split('T')[0] // Default hari ini
  });

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/pengeluaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nominal: Number(formData.nominal) // Pastikan nominal berupa angka
        })
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");
      
      alert("Pengeluaran berhasil dicatat!");
      // Reset form setelah sukses
      setFormData({ nama_pengeluaran: '', nominal: 0, tanggal: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan pengeluaran.");
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
    </div>
  );
}