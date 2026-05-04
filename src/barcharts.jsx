import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
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
  }, []);

  return (
    <div className="home-dashboard">
      <h2>Dashboard Keuangan Toko</h2>
      
      <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
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
          <p>Memuat grafik pendapatan...</p>
        )}
      </div>
    </div>
  );
}