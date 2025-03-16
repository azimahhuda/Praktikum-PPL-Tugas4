import { Router } from "express";
import { getAllSongs, getSongById, addSong, updateSong, deleteSong, getSongsBySinger } from "../controllers/songsController";

const router: Router = Router();

// Endpoint
router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.post("/", addSong);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);
router.get("/search/:penyanyi", getSongsBySinger);

export default router;
