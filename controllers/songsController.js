"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongsBySinger = exports.deleteSong = exports.updateSong = exports.addSong = exports.getSongById = exports.getAllSongs = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Path ke file JSON
const filePath = path_1.default.join(__dirname, "../data/songs.json");
// Fungsi untuk membaca file JSON
const readData = () => {
    const data = fs_1.default.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};
// Fungsi untuk menulis file JSON
const writeData = (data) => {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
// Ambil semua lagu
const getAllSongs = (req, res) => {
    const songs = readData();
    res.json(songs);
};
exports.getAllSongs = getAllSongs;
// Ambil satu lagu berdasarkan ID
const getSongById = (req, res) => {
    const songs = readData();
    const song = songs.find((s) => s.id === parseInt(req.params.id));
    song ? res.json(song) : res.status(404).json({ message: "Lagu tidak ditemukan" });
};
exports.getSongById = getSongById;
// Tambah lagu baru
const addSong = (req, res) => {
    const songs = readData();
    // Konversi tahun ke number jika ada
    const newSong = Object.assign(Object.assign({ id: songs.length + 1 }, req.body), { tahun: req.body.tahun ? parseInt(req.body.tahun) : new Date().getFullYear() });
    songs.push(newSong);
    writeData(songs);
    res.status(201).json({ message: "Lagu berhasil ditambahkan", song: newSong });
};
exports.addSong = addSong;
// Update lagu berdasarkan ID
const updateSong = (req, res) => {
    let songs = readData();
    const index = songs.findIndex((s) => s.id === parseInt(req.params.id));
    if (index !== -1) {
        songs[index] = Object.assign(Object.assign(Object.assign({}, songs[index]), req.body), { tahun: req.body.tahun ? parseInt(req.body.tahun) : songs[index].tahun });
        writeData(songs);
        res.json({ message: "Lagu berhasil diperbarui", song: songs[index] });
    }
    else {
        res.status(404).json({ message: "Lagu tidak ditemukan" });
    }
};
exports.updateSong = updateSong;
// Hapus lagu berdasarkan ID
const deleteSong = (req, res) => {
    let songs = readData();
    const newSongs = songs.filter((s) => s.id !== parseInt(req.params.id));
    if (songs.length === newSongs.length) {
        res.status(404).json({ message: "Lagu tidak ditemukan" });
        return;
    }
    writeData(newSongs);
    res.json({ message: "Lagu berhasil dihapus" });
};
exports.deleteSong = deleteSong;
// Cari lagu berdasarkan penyanyi
const getSongsBySinger = (req, res) => {
    const songs = readData();
    const penyanyiParam = req.params.penyanyi.trim().toLowerCase();
    const filteredSongs = songs.filter((s) => s.penyanyi.toLowerCase() === penyanyiParam);
    filteredSongs.length > 0
        ? res.json(filteredSongs)
        : res.status(404).json({ message: "Tidak ada lagu dari penyanyi tersebut" });
};
exports.getSongsBySinger = getSongsBySinger;
