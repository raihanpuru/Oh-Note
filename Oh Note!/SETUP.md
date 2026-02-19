**Gambaran singkat**
Yang akan dibuat:
- PostgreSQL → database buat simpan note
- Express (Node.js) → backend API
- notes table → id, title, content, created_at
- Endpoint:
    POST /notes → tambah note
    GET /notes → ambil semua 
    
**Install Postgres**
- Download dari sini: https://www.postgresql.org/download/
- Waktu install:
    - ingat password user postgres
    - port default: 5432
    - centang pgAdmin (buat cek DB)
- Cek berhasil atau belum (di terminal): 
    > psql --version

**Masuk ke PostgreSQL & buat database**
- Masuk ke postgres (di terminal):
    > psql -U postgres
- Buat database baru:
    > CREATE DATABASE nama_db;
- Pindah ke database:
    > \c nama_db
- Buat tabel untuk database:
    > CREATE TABLE tabel_notes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
- Cek isi tabel:
    > \dt
- Keluar:
    > \q

**Instal Node.js**
- Download: https://nodejs.org (pilih LTS)
- Cek versi Node.js:
    > node -v
      npm -v

**Buat project Express**
- Di terminal dalam folder project:
    > npm init -y
- Install dependency yang diperlukan:
    > npm install express pg dotenv
      npm install nodemon --save-dev
      npm install cors
- Edit isi package.json pada bagian scripts:
    > "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node index.js",
        "dev": "nodemon index.js"
      },

**Struktur folder**
- Struktur dari folder project sebagai berikut:
    backend/
    ├── index.js
    ├── db.js
    ├── .env
    └── package.json

**Setup koneksi PostgreSQL**
- Pada file .env dalam folder:
    DB_USER=postgres
    DB_PASSWORD=PASSWORD_USER (ganti passwordnya)
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=nama_db
- Buat file baru dengan nama db.js dengan isi:
    > const { Pool } = require("pg");

      const pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      });

      module.exports = pool;

**Setup Express server**
- Buat file baru dengan nama index.js dan isi:
    > require("dotenv").config();
      const express = require("express");
      const pool = require("./db");
      const cors = require("cors");

      const app = express();
      app.use(cors());
      app.use(express.json());


      app.get("/", (req, res) => {
        res.send("Notes API telah aktif");
      });

      app.listen(3000, () => {
        console.log("Server jalan di http://localhost:3000");
      });
- Lalu bisa jalankan localhost melalui terminal dalam folder:
    > node index.js
- Buka localhost melalui browser dengan alamat: http://localhost:XXXX

**Tambahkan endpoint untuk membuat note**
- Tambahkan dalam file index.js:
    > app.post("/notes", async (req, res) => {
        try {
            const { title, content } = req.body;

            const result = await pool.query(
                "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
                [title, content]    
            );

            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
      });
- Test menggunakan Postman atau Thunder Client:
    > POST http://localhost:XXXX/notes
      {
        "title": "Note pertama",
        "content": "Belajar Express + Postgres"
      }

**Endpoint GET semua note**
- Tambahkan dalam file index.js:
    > app.get("/notes", async (req, res) => {
        try {
            const result = await pool.query(
                "SELECT * FROM notes ORDER BY created_at DESC"
            );
        res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: "Server error" });
        }
      });
- Test pada localhost dalam browser: http://localhost:XXXX/notes


**Static file server setup (Frontend from Backend)**
- Pada index.js tambahkan:
    > const path = require("path");
      app.use(
        express.static(
            path.join(__dirname, "..", "frontend")
        )
      );






