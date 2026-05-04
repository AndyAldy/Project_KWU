import { useState, useEffect } from 'react';
import './App.css';
import StockManager from './components/StockManager';
import IncomeManager from './components/IncomeManager';
import ExpenseManager from './components/ExpenseManager';
// 1. Tambahan import untuk komponen grafik dari recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'; 

function App() {
  const [view, setView] = useState('home'); // home, stock, pemasukan, pengeluaran
  
  // 2. State untuk menyimpan data ringkasan pemasukan & pengeluaran
  const [summaryData, setSummaryData] = useState([]);

  // 3. Mengambil data dari backend khusus saat berada di tampilan 'home'
  useEffect(() => {
    const fetchSummary = async () => {
      // Jika bukan di halaman home, tidak perlu fetch data grafik
      if (view !== 'home') return; 

      try {
        const response = await fetch('http://localhost:5000/api/summary');
        if (response.ok) {
          const data = await response.json();
          setSummaryData(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data summary:", error);
      }
    };

    fetchSummary();
  }, [view]); // Dependency 'view' membuat grafik otomatis di-refresh saat kamu kembali ke home

  return (
    <div className="app-wrapper">
      {view === 'home' ? (
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">Selamat Datang 👋</div>
            <h1 className="hero-title">Pencatatan Warung Kelontong</h1>
            <p className="hero-description">Kelola stok, pemasukan, dan pengeluaran dalam satu tempat.</p>
            
            {/* Jarak (marginBottom) ditambahkan agar tidak menempel dengan grafik */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
              <button className="btn-catat" onClick={() => setView('stock')}>Cek Stock</button>
              <button className="btn-catat" onClick={() => setView('pemasukan')}>Catat Jual</button>
              <button className="btn-catat" onClick={() => setView('pengeluaran')}>Catat Management Toko</button>
            </div>

            {/* --- MULAI BAGIAN GRAFIK DASHBOARD --- */}
            <div className="dashboard-chart-container" style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '10px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
              width: '100%', 
              maxWidth: '800px', 
              margin: '0 auto' 
            }}>
              <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                Ringkasan Keuangan
              </h3>
              <div style={{ width: '100%', height: 300 }}>
                {summaryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `Rp${value.toLocaleString('id-ID')}`} />
                      <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                      <Bar dataKey="nominal" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', color: '#888' }}>Memuat grafik pendapatan...</p>
                )}
              </div>
            </div>
            {/* --- AKHIR BAGIAN GRAFIK --- */}

          </div>
        </section>
      ) : (
        <div className="container">
          {/* Bungkus tombol kembali dengan div ini */}
          <div className="top-navigation">
            <button className="btn-back" onClick={() => setView('home')}>← Kembali</button>
          </div>
          
          {view === 'stock' && <StockManager />}
          {view === 'pemasukan' && <IncomeManager />}
          {view === 'pengeluaran' && <ExpenseManager />}
        </div>
      )}
    </div>
  );
}

export default App;