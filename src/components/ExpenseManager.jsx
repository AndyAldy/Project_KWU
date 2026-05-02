import { useState } from 'react';
import './App.css';

export default function ExpenseManager() {
  const [form, setForm] = useState({ nama_pengeluaran: '', nominal: ''

    
   });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/pengeluaran', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert("Pengeluaran dicatat!");
    setForm({ nama_pengeluaran: '', nominal: 0 });
  };

  return (
    <div className="card-section">
      <h3>Catat Pengeluaran</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nama Pengeluaran (Contoh: Listrik)" value={form.nama_pengeluaran} 
               onChange={(e) => setForm({...form, nama_pengeluaran: e.target.value})} />
        <input type="number" placeholder="Nominal (Rp)" value={form.nominal}
               onChange={(e) => setForm({...form, nominal: e.target.value})} />
        <button type="submit" className="btn-catat">Simpan Pengeluaran</button>
      </form>
    </div>
  );
}