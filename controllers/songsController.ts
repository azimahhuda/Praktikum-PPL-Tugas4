import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// Definisikan tipe data untuk lagu
interface Song {
    id: number;
    penyanyi: string;
    judul: string;
    genre: string;
    penulis: string;
    tahun: number;
}

// Path ke file JSON
const filePath: string = path.join(__dirname, "../data/songs.json");

// Fungsi untuk membaca file JSON
const readData = (): Song[] => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as Song[];
};

// Fungsi untuk menulis file JSON
const writeData = (data: Song[]): void => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Ambil semua lagu
export const getAllSongs = (req: Request, res: Response): void => {
    const songs = readData();
    res.json(songs);
};

// Ambil satu lagu berdasarkan ID
export const getSongById = (req: Request, res: Response): void => {
    const songs = readData();
    const song = songs.find((s) => s.id === parseInt(req.params.id));
    song ? res.json(song) : res.status(404).json({ message: "Lagu tidak ditemukan" });
};

// Tambah lagu baru
export const addSong = (req: Request, res: Response): void => {
    const songs = readData();
    
    // Konversi tahun ke number jika ada
    const newSong: Song = { 
        id: songs.length + 1, 
        ...req.body, 
        tahun: req.body.tahun ? parseInt(req.body.tahun) : new Date().getFullYear() 
    };

    songs.push(newSong);
    writeData(songs);
    res.status(201).json({ message: "Lagu berhasil ditambahkan", song: newSong });
};

// Update lagu berdasarkan ID
export const updateSong = (req: Request, res: Response): void => {
    let songs = readData();
    const index = songs.findIndex((s) => s.id === parseInt(req.params.id));

    if (index !== -1) {
        songs[index] = { 
            ...songs[index], 
            ...req.body,
            tahun: req.body.tahun ? parseInt(req.body.tahun) : songs[index].tahun
        };
        writeData(songs);
        res.json({ message: "Lagu berhasil diperbarui", song: songs[index] });
    } else {
        res.status(404).json({ message: "Lagu tidak ditemukan" });
    }
};

// Hapus lagu berdasarkan ID
export const deleteSong = (req: Request, res: Response): void => {
    let songs = readData();
    const newSongs = songs.filter((s) => s.id !== parseInt(req.params.id));

    if (songs.length === newSongs.length) {
        res.status(404).json({ message: "Lagu tidak ditemukan" });
        return;
    }

    writeData(newSongs);
    res.json({ message: "Lagu berhasil dihapus" });
};

// Cari lagu berdasarkan penyanyi
export const getSongsBySinger = (req: Request, res: Response): void => {
    const songs = readData();
    const penyanyiParam = req.params.penyanyi.trim().toLowerCase();
    const filteredSongs = songs.filter((s) => s.penyanyi.toLowerCase() === penyanyiParam);

    filteredSongs.length > 0
        ? res.json(filteredSongs)
        : res.status(404).json({ message: "Tidak ada lagu dari penyanyi tersebut" });
};
