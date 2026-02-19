const API_URL = "";

const notesDiv = document.getElementById("notes");
const addBtn = document.getElementById("addBtn");
const formTitle = document.getElementById("formTitle");

addBtn.addEventListener("click", saveNote);

async function fetchNotes() {
  const res = await fetch(`${API_URL}/notes`);
  const notes = await res.json();

  notesDiv.innerHTML = "";

  if (notes.length === 0) {
    notesDiv.innerHTML = `
      <div class="empty-state">
        <p>Belum ada catatan. Yuk tulis sesuatu!</p>
      </div>
    `;
    return;
  }

  notes.forEach((note, i) => {
    const div = document.createElement("div");
    div.className = "note";
    div.style.animationDelay = `${i * 0.06}s`;

    const date = new Date(note.created_at);
    const fixDate = date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    div.innerHTML = `
      <h4>${note.title}</h4>
      <p>${note.content || "<em style='color:#bbb'>Tidak ada isi</em>"}</p>
      <small>${fixDate}</small>
      <div class="note-actions">
        <button class="btn-edit" onclick="editNote(${note.id})">Edit</button>
        <button class="btn-delete" onclick="deleteNote(${note.id})">Hapus</button>
      </div>
    `;

    notesDiv.appendChild(div);
  });
}

async function saveNote() {
  const id = document.getElementById("noteId").value;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title) {
    alert("Judul wajib diisi");
    return;
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/notes/${id}` : `${API_URL}/notes`;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  resetForm();
  fetchNotes();
}

async function editNote(id) {
  const res = await fetch(`${API_URL}/notes/${id}`);
  const note = await res.json();

  document.getElementById("title").value = note.title;
  document.getElementById("content").value = note.content || "";
  document.getElementById("noteId").value = note.id;

  addBtn.textContent = "Update Note";
  formTitle.textContent = "Edit Note";
  document.querySelector(".form-panel").scrollIntoView({ behavior: "smooth" });
}

function deleteNote(id) {
  showConfirmModal("Yakin mau hapus catatan ini?", async () => {
    await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  });
}

function showConfirmModal(message, onConfirm) {
  document.getElementById("confirmModal")?.remove();

  const modal = document.createElement("div");
  modal.id = "confirmModal";
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-box">
      <p class="modal-msg">${message}</p>
      <div class="modal-actions">
        <button class="modal-btn modal-cancel">Batal</button>
        <button class="modal-btn modal-confirm">Hapus</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  requestAnimationFrame(() => modal.classList.add("modal-visible"));

  function closeModal() {
    modal.classList.remove("modal-visible");
    modal.addEventListener("transitionend", () => modal.remove(), { once: true });
  }

  modal.querySelector(".modal-cancel").addEventListener("click", closeModal);
  modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);
  modal.querySelector(".modal-confirm").addEventListener("click", () => {
    closeModal();
    onConfirm();
  });
}

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("noteId").value = "";
  addBtn.textContent = "Tambah Note";
  formTitle.textContent = "Tambah Note";
}


fetchNotes();
