import express from 'express';
import mysql from'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Sesuaikan user phpMyAdmin
  password: '', // Sesuaikan password
  database: 'warung_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Terhubung ke MySQL!');
});

// --- CRUD UNTUK STOCK BARANG ---

// READ: Ambil semua barang
app.get('/api/stock', (req, res) => {
  db.query('SELECT * FROM stock', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// CREATE: Tambah barang
app.post('/api/stock', (req, res) => {
  const { nama_barang, jumlah, harga_jual, harga_beli } = req.body;
  const sql = 'INSERT INTO stock (nama_barang, jumlah, harga_jual, harga_beli) VALUES (?, ?, ?, ?)';
  db.query(sql, [nama_barang, jumlah, harga_jual, harga_beli], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Barang berhasil ditambah!', id_stock: result.insertId });
  });
});

// UPDATE: Edit barang
app.put('/api/stock/:id_stock', (req, res) => {
  const { nama_barang, jumlah, harga_jual, harga_beli } = req.body;
  const sql = 'UPDATE stock SET nama_barang=?, jumlah=?, harga_jual=?, harga_beli=? WHERE id_stock=?';
  db.query(sql, [nama_barang, jumlah, harga_jual, harga_beli, req.params.id_stock], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Barang berhasil diupdate!' });
  });
});

// DELETE: Hapus barang
app.delete('/api/stock/:id', (req, res) => {
  db.query('DELETE FROM stock WHERE id_stock=?', [req.params.id_stock], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Barang dihapus!' });
  });
});
// --- API UNTUK PEMASUKAN ---
app.get('/api/pemasukan', (req, res) => {
  const sql = `SELECT p.*, s.nama_barang FROM pemasukan p 
               JOIN stock s ON p.id_barang = s.id_stock
               ORDER BY p.tanggal DESC`;
  db.query(sql, (err, results) => {
    if (err) { 
      console.error("ERROR MYSQL di /api/pemasukan:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

app.post('/api/pemasukan', (req, res) => {
  const { id_barang, jumlah_terjual, total_harga } = req.body;
  const sqlPemasukan = 'INSERT INTO pemasukan (id_barang, jumlah_terjual, total_harga) VALUES (?, ?, ?)';
  const sqlUpdateStock = 'UPDATE stock SET jumlah = jumlah - ? WHERE id_stock = ?';

  // Eksekusi insert pemasukan
  db.query(sqlPemasukan, [id_barang, jumlah_terjual, total_harga], (err) => {
    if (err) {
      console.error("❌ GAGAL INSERT PEMASUKAN:", err); // Pesan error ke terminal
      return res.status(500).json(err);
    }
    
    // Jika pemasukan berhasil, eksekusi kurangi stok
    db.query(sqlUpdateStock, [jumlah_terjual, id_barang], (err2) => {
      if (err2) {
        console.error("❌ GAGAL UPDATE STOK:", err2); // Pesan error ke terminal
        return res.status(500).json(err2);
      }
      res.json({ message: 'Pemasukan berhasil dicatat dan stok diperbarui!' });
    });
  });
});

// --- API UNTUK PENGELUARAN ---
app.get('/api/pengeluaran', (req, res) => {
  db.query('SELECT * FROM pengeluaran ORDER BY tanggal DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/pengeluaran', (req, res) => {
  const { nama_pengeluaran, nominal } = req.body;
  const sql = 'INSERT INTO pengeluaran (nama_pengeluaran, nominal) VALUES (?, ?)';
  db.query(sql, [nama_pengeluaran, nominal], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Pengeluaran berhasil dicatat!' });
  });
});

app.get('/api/summary', (req, res) => {
  // Catatan: Pastikan kamu menyesuaikan nama tabel dan kolom dengan database MySQL kamu
  const queryPemasukan = "SELECT SUM(total_harga) AS total_income FROM penjualan"; 
  const queryPengeluaran = "SELECT SUM(nominal) AS total_expense FROM pengeluaran";

  db.query(queryPemasukan, (err, incomeResult) => {
    if (err) return res.status(500).send(err);
    
    db.query(queryPengeluaran, (err, expenseResult) => {
      if (err) return res.status(500).send(err);
      
      const income = incomeResult[0].total_income || 0;
      const expense = expenseResult[0].total_expense || 0;
      
      res.json([
        { name: 'Pemasukan', nominal: income, fill: '#4CAF50' }, // Warna hijau
        { name: 'Pengeluaran', nominal: expense, fill: '#F44336' } // Warna merah
      ]);
    });
  });
});

app.listen(5000, () => console.log('Server berjalan di port 5000'));