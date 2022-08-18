import express from 'express';
import multer from 'multer';
const upload = multer();
//import fs from "fs";

import {
  allUsers,
  register,
  login,
  logout,
  deleteUserById,
  getUserById,
  updateUserById,
  getImgById,
  verifyToken,
} from '../controllers/User.js';

import { uploadProfil } from '../controllers/Upload.js';

const router = express.Router();

router.get('/', verifyToken, allUsers);
router.get('/:id', verifyToken, getUserById);

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.delete('/:id', verifyToken, deleteUserById);
router.put('/:id', verifyToken, updateUserById);
router.get('/image/:fileName', verifyToken, getImgById);
////////upload
router.post('/upload/:id', upload.single('file'), verifyToken, uploadProfil);

export default router;
