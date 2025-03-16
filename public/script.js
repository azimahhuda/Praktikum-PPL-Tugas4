"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
document.addEventListener("DOMContentLoaded", () => {
    fetchSongs();
    const saveEditButton = document.getElementById("saveEditButton");
    if (saveEditButton) {
        saveEditButton.addEventListener("click", saveEdit);
    }
});
function fetchSongs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("/songs");
            const songs = yield response.json();
            const tableBody = document.getElementById("songTableBody");
            tableBody.innerHTML = "";
            songs.forEach((song) => {
                var _a, _b, _c;
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${song.penyanyi}</td>
                <td>${song.judul}</td>
                <td>
                    <button onclick="viewSong(${song.id})">Detail Lagu</button>
                    <button onclick="showEditForm(${song.id}, '${song.penyanyi}', '${song.judul}', '${(_a = song.genre) !== null && _a !== void 0 ? _a : ''}', '${(_b = song.penulis) !== null && _b !== void 0 ? _b : ''}', ${(_c = song.tahun) !== null && _c !== void 0 ? _c : 0})">Edit</button>
                    <button onclick="deleteSong(${song.id})">Hapus</button>
                </td>
            `;
                tableBody.appendChild(row);
            });
        }
        catch (error) {
            console.error("Gagal mengambil lagu:", error);
        }
    });
}
function viewSong(id) {
    window.location.href = `song_detail.html?id=${id}`;
}
(_a = document.getElementById("addSongForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const newSong = {
        penyanyi: document.getElementById("penyanyi").value,
        judul: document.getElementById("judul").value,
        genre: document.getElementById("genre").value,
        penulis: document.getElementById("penulis").value,
        tahun: parseInt(document.getElementById("tahun").value) || undefined,
    };
    try {
        const response = yield fetch("/songs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSong),
        });
        if (response.ok) {
            alert("Lagu berhasil ditambahkan!");
            fetchSongs();
            document.getElementById("addSongForm").reset();
        }
        else {
            alert("Gagal menambahkan lagu.");
        }
    }
    catch (error) {
        alert("Terjadi kesalahan: " + error);
    }
}));
function deleteSong(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (confirm("Yakin ingin menghapus lagu ini?")) {
            try {
                const response = yield fetch(`/songs/${id}`, { method: "DELETE" });
                if (response.ok) {
                    alert("Lagu berhasil dihapus!");
                    fetchSongs();
                }
                else {
                    alert("Gagal menghapus lagu.");
                }
            }
            catch (error) {
                alert("Terjadi kesalahan: " + error);
            }
        }
    });
}
function showEditForm(id, penyanyi, judul, genre, penulis, tahun) {
    var _a;
    document.getElementById("editSongForm").style.display = "block";
    document.getElementById("editId").value = id.toString();
    document.getElementById("editPenyanyi").value = penyanyi;
    document.getElementById("editJudul").value = judul;
    document.getElementById("editGenre").value = genre !== null && genre !== void 0 ? genre : "";
    document.getElementById("editPenulis").value = penulis !== null && penulis !== void 0 ? penulis : "";
    document.getElementById("editTahun").value = (_a = tahun === null || tahun === void 0 ? void 0 : tahun.toString()) !== null && _a !== void 0 ? _a : "";
}
function cancelEdit() {
    document.getElementById("editSongForm").style.display = "none";
    document.getElementById("editId").value = "";
    document.getElementById("editPenyanyi").value = "";
    document.getElementById("editJudul").value = "";
    document.getElementById("editGenre").value = "";
    document.getElementById("editPenulis").value = "";
    document.getElementById("editTahun").value = "";
}
function saveEdit() {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(document.getElementById("editId").value);
        const updatedSong = {
            penyanyi: document.getElementById("editPenyanyi").value,
            judul: document.getElementById("editJudul").value,
            genre: document.getElementById("editGenre").value,
            penulis: document.getElementById("editPenulis").value,
            tahun: parseInt(document.getElementById("editTahun").value) || undefined,
        };
        try {
            const response = yield fetch(`/songs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedSong),
            });
            if (response.ok) {
                alert("Lagu berhasil diperbarui!");
                fetchSongs();
                cancelEdit();
            }
            else {
                alert("Gagal memperbarui lagu.");
            }
        }
        catch (error) {
            alert("Terjadi kesalahan: " + error);
        }
    });
}
