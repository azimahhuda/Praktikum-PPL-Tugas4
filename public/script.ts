document.addEventListener("DOMContentLoaded", () => {
    fetchSongs();

    const saveEditButton = document.getElementById("saveEditButton") as HTMLButtonElement | null;
    if (saveEditButton) {
        saveEditButton.addEventListener("click", saveEdit);
    }
});

interface Song {
    id: number;
    penyanyi: string;
    judul: string;
    genre?: string;
    penulis?: string;
    tahun?: number;
}

async function fetchSongs(): Promise<void> {
    try {
        const response = await fetch("/songs");
        const songs: Song[] = await response.json();
        const tableBody = document.getElementById("songTableBody") as HTMLTableSectionElement;

        tableBody.innerHTML = "";
        songs.forEach((song) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${song.penyanyi}</td>
                <td>${song.judul}</td>
                <td>
                    <button onclick="viewSong(${song.id})">Detail Lagu</button>
                    <button onclick="showEditForm(${song.id}, '${song.penyanyi}', '${song.judul}', '${song.genre ?? ''}', '${song.penulis ?? ''}', ${song.tahun ?? 0})">Edit</button>
                    <button onclick="deleteSong(${song.id})">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Gagal mengambil lagu:", error);
    }
}

function viewSong(id: number): void {
    window.location.href = `song_detail.html?id=${id}`;
}

document.getElementById("addSongForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newSong: Omit<Song, "id"> = {
        penyanyi: (document.getElementById("penyanyi") as HTMLInputElement).value,
        judul: (document.getElementById("judul") as HTMLInputElement).value,
        genre: (document.getElementById("genre") as HTMLInputElement).value,
        penulis: (document.getElementById("penulis") as HTMLInputElement).value,
        tahun: parseInt((document.getElementById("tahun") as HTMLInputElement).value) || undefined,
    };

    try {
        const response = await fetch("/songs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSong),
        });

        if (response.ok) {
            alert("Lagu berhasil ditambahkan!");
            fetchSongs();
            (document.getElementById("addSongForm") as HTMLFormElement).reset();
        } else {
            alert("Gagal menambahkan lagu.");
        }
    } catch (error) {
        alert("Terjadi kesalahan: " + error);
    }
});

async function deleteSong(id: number): Promise<void> {
    if (confirm("Yakin ingin menghapus lagu ini?")) {
        try {
            const response = await fetch(`/songs/${id}`, { method: "DELETE" });

            if (response.ok) {
                alert("Lagu berhasil dihapus!");
                fetchSongs();
            } else {
                alert("Gagal menghapus lagu.");
            }
        } catch (error) {
            alert("Terjadi kesalahan: " + error);
        }
    }
}

function showEditForm(id: number, penyanyi: string, judul: string, genre?: string, penulis?: string, tahun?: number): void {
    (document.getElementById("editSongForm") as HTMLFormElement).style.display = "block";
    (document.getElementById("editId") as HTMLInputElement).value = id.toString();
    (document.getElementById("editPenyanyi") as HTMLInputElement).value = penyanyi;
    (document.getElementById("editJudul") as HTMLInputElement).value = judul;
    (document.getElementById("editGenre") as HTMLInputElement).value = genre ?? "";
    (document.getElementById("editPenulis") as HTMLInputElement).value = penulis ?? "";
    (document.getElementById("editTahun") as HTMLInputElement).value = tahun?.toString() ?? "";
}

function cancelEdit(): void {
    (document.getElementById("editSongForm") as HTMLFormElement).style.display = "none";
    (document.getElementById("editId") as HTMLInputElement).value = "";
    (document.getElementById("editPenyanyi") as HTMLInputElement).value = "";
    (document.getElementById("editJudul") as HTMLInputElement).value = "";
    (document.getElementById("editGenre") as HTMLInputElement).value = "";
    (document.getElementById("editPenulis") as HTMLInputElement).value = "";
    (document.getElementById("editTahun") as HTMLInputElement).value = "";
}

async function saveEdit(): Promise<void> {
    const id = parseInt((document.getElementById("editId") as HTMLInputElement).value);
    const updatedSong: Omit<Song, "id"> = {
        penyanyi: (document.getElementById("editPenyanyi") as HTMLInputElement).value,
        judul: (document.getElementById("editJudul") as HTMLInputElement).value,
        genre: (document.getElementById("editGenre") as HTMLInputElement).value,
        penulis: (document.getElementById("editPenulis") as HTMLInputElement).value,
        tahun: parseInt((document.getElementById("editTahun") as HTMLInputElement).value) || undefined,
    };

    try {
        const response = await fetch(`/songs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSong),
        });

        if (response.ok) {
            alert("Lagu berhasil diperbarui!");
            fetchSongs();
            cancelEdit();
        } else {
            alert("Gagal memperbarui lagu.");
        }
    } catch (error) {
        alert("Terjadi kesalahan: " + error);
    }
}