"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const songsController_1 = require("../controllers/songsController");
const router = (0, express_1.Router)();
// Endpoint
router.get("/", songsController_1.getAllSongs);
router.get("/:id", songsController_1.getSongById);
router.post("/", songsController_1.addSong);
router.put("/:id", songsController_1.updateSong);
router.delete("/:id", songsController_1.deleteSong);
router.get("/search/:penyanyi", songsController_1.getSongsBySinger);
exports.default = router;
