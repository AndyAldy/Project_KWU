import { useState } from 'react';
import './App.css';
import StockManager from './components/StockManager';
import IncomeManager from './components/IncomeManager';
import ExpenseManager from './components/ExpenseManager';

function App() {
  const [view, setView] = useState('home'); // home, stock, pemasukan, pengeluaran

  return (
    <div className="app-wrapper">
      {view === 'home' ? (
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">Selamat Datang 👋</div>
            <h1 className="hero-title">Pencatatan Warung Kelontong</h1>
            <p className="hero-description">Kelola stok, pemasukan, dan pengeluaran dalam satu tempat.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn-catat" onClick={() => setView('stock')}>Cek Stock</button>
              <button className="btn-catat" onClick={() => setView('pemasukan')}>Catat Jual</button>
              <button className="btn-catat" onClick={() => setView('pengeluaran')}>Catat Management Toko</button>
            </div>
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