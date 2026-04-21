import { useState, useEffect } from 'react';

export default function StockManager() {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama_barang: '', jumlah: 0, harga_jual: 0, harga_beli: 0 });

  // 1. Ini adalah state pemicu untuk me-refresh data
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 2. Fungsi fetch dipindahkan ke dalam useEffect
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stock');
        const data = await res.json();
        setStocks(data); // Aman, karena dipanggil setelah 'await'
      } catch (error) {
        console.error("Gagal mengambil data dari server:", error);
      }
    };

    fetchStocks();
  }, [refreshTrigger]); // <-- Array dependency berisi refreshTrigger, jadi setiap nilainya berubah, dia akan nge-fetch ulang.

  // Simpan / Edit (Create & Update)
  const handleSave = async (e) => {
    e.preventDefault();
    const url = formData.id ? `http://localhost:5000/api/stock/${formData.id}` : 'http://localhost:5000/api/stock';
    const method = formData.id ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setIsModalOpen(false);
      // 3. Picu refresh data dengan menambahkan angka trigger
      setRefreshTrigger(prev => prev + 1); 
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  // Hapus Data (Delete)
  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus barang ini?')) {
      try {
        await fetch(`http://localhost:5000/api/stock/${id}`, { method: 'DELETE' });
        // Picu refresh data
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  // Buka form untuk edit
  const openEdit = (stock) => {
    setFormData(stock);
    setIsModalOpen(true);
  };

  // Buka form untuk tambah
  const openAdd = () => {
    setFormData({ id: null, nama_barang: '', jumlah: 0, harga_jual: 0, harga_beli: 0 });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Kelola Stok Barang</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah Barang</button>
      </div>

      {/* List Barang dengan Animasi Card */}
      <div className="stock-list">
        {stocks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Belum ada data barang.</p>
        ) : (
          stocks.map((stock) => (
            <div className="card" key={stock.id}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: 'var(--primary)' }}>{stock.nama_barang}</h3>
                <p style={{ margin: 0, color: '#888' }}>
                  Stok: {stock.jumlah} | Beli: Rp{stock.harga_beli} | Jual: Rp{stock.harga_jual}
                </p>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => openEdit(stock)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(stock.id)}>Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0 }}>{formData.id ? 'Edit Barang' : 'Tambah Barang'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <input placeholder="Nama Barang" value={formData.nama_barang} onChange={(e) => setFormData({...formData, nama_barang: e.target.value})} required />
              </div>
              <div className="form-group">
                <input type="number" placeholder="Jumlah Stok" value={formData.jumlah} onChange={(e) => setFormData({...formData, jumlah: e.target.value})} required />
              </div>
              <div className="form-group">
                <input type="number" placeholder="Harga Beli" value={formData.harga_beli} onChange={(e) => setFormData({...formData, harga_beli: e.target.value})} required />
              </div>
              <div className="form-group">
                <input type="number" placeholder="Harga Jual" value={formData.harga_jual} onChange={(e) => setFormData({...formData, harga_jual: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-danger" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}