import StockManager from './components/StockManager';

function App() {
  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Sistem Warung Kelontong</h1>
        <p style={{ color: '#888' }}>Pencatatan Cepat, Mudah, dan Akurat.</p>
      </header>

      {/* Memanggil komponen kelola stok */}
      <StockManager />
    </div>
  );
}

export default App;