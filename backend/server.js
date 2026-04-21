const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

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
    res.json({ message: 'Barang berhasil ditambah!', id: result.insertId });
  });
});

// UPDATE: Edit barang
app.put('/api/stock/:id', (req, res) => {
  const { nama_barang, jumlah, harga_jual, harga_beli } = req.body;
  const sql = 'UPDATE stock SET nama_barang=?, jumlah=?, harga_jual=?, harga_beli=? WHERE id=?';
  db.query(sql, [nama_barang, jumlah, harga_jual, harga_beli, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Barang berhasil diupdate!' });
  });
});

// DELETE: Hapus barang
app.delete('/api/stock/:id', (req, res) => {
  db.query('DELETE FROM stock WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Barang dihapus!' });
  });
});

app.listen(5000, () => console.log('Server berjalan di port 5000'));