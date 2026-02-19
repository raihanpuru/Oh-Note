require("dotenv").config();
const express = require("express");
const pool = require("./db");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
    res.send("Notes API Berjalan Lancar")
});

// Setup static file server untuk tersambung ke Frontend
app.use(
    express.static(
        path.join(__dirname, "..", "frontend")
    )
);

// Buat notes > post ke dalam database
app.post("/notes", async (req, res) => {
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

// Real all notes > get all data dalam tabel
app.get("/notes", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notes ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Read notes by ID > get WHERE id dalam tabel
app.get("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM notes WHERE id = $1",
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Note tidak ditemukan" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Update notes by ID > put WHERE id dalam tabel
app.put("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content} = req.body;

        const result = await pool.query(            
            `UPDATE notes SET title = $1, content = $2 
            WHERE id = $3 RETURNING *`,
            [title, content, id]
        );

        if (result.rowCount.length === 0) {
            return res.status(404).json({ error: "Note tidak ditemukan" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: " Server error" });
    }
});

// Delete note by ID > delete WHERE id dalam tabel
app.delete("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM notes WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.row.length === 0) {
            return res.status(404).json({ error: "Notes tidak ditemukan "});
        }

        res.json({ message: "Note berhasil terhapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(5000, () => {
    console.log("Server berjalan di http://localhost:5000")
});