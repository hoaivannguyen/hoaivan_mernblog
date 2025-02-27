import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createalbum, getalbums, deletealbum } from "../controllers/album.controller.js";

const router = express.Router();
router.post("/create", verifyToken, createalbum);
router.get("/getalbums", getalbums);
router.delete("/deletealbum/:albumId/:userId", verifyToken, deletealbum);

export default router;