**Read all notes**
- Tambahkan pada index.js:
    > app.get("/notes", async (req, res) => {
          try {
              const result = await pool.query(
                  "SELECT * FROM notes ORDER BY created_at DESC"
              );
              res.json(result.rows);
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: "Server error" });
          }
      });
- Test pada Postman:
    > GET http://localhost:3000/notes

**Read satu note by ID**
- Tambahkan pada index.js:
    > app.get("/notes/:id", async (req, res) => {
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
- Test pada Postman:
    > GET http://localhost:3000/notes/1

**Update note by ID**
- Tambahkan pada index.js:
    > app.put("/notes/:id", async (req, res) => {
          try {
              const { id } = req.params;
              const { title, content } = req.body;

              const result = await pool.query(
                  `UPDATE notes
                  SET title = $1, content = $2
                  WHERE id = $3
                  RETURNING *`,
                  [title, content, id]
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
- Test pada Postman: 
    > PUT http://localhost:3000/notes/1
      {
        "title": "Judul di-update",
        "content": "Isi juga di-update"
      }

**Delete note by ID**
- Tambahkan pada index.js:
    > app.delete("/notes/:id", async (req, res) => {
          try {
              const { id } = req.params;

              const result = await pool.query(
                  "DELETE FROM notes WHERE id = $1 RETURNING *",
                  [id]
              );

              if (result.rows.length === 0) {
                  return res.status(404).json({ error: "Note tidak ditemukan" });
              }

              res.json({ message: "Note berhasil dihapus" });
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: "Server error" });
          }
      });
- Test pada Postman:
    > DELETE http://localhost:3000/notes/1




