import express from "express";
import multer from "multer";
const upload = multer();
//import fs from "fs";

import {
    allUsers,
    register,
    login,
    logout,
    deleteUser,
    getUserById,
    updateUserById,

} from "../controllers/User.js";

import {
    uploadProfil
} from "../controllers/Upload.js";

const router = express.Router();

router.get('/', allUsers);
router.get('/:id', getUserById)
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/:id', deleteUser);
router.put("/:id", updateUserById);
////////upload
router.post('/upload', upload.single('file'), uploadProfil);

export default router;
