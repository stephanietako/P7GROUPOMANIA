import express from 'express';
import multer from 'multer';
const upload = multer();

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

import { refreshToken } from '../controllers/RefreshToken.js';

import { uploadProfil } from '../controllers/Upload.js';

const router = express.Router();

router.get('/', verifyToken, allUsers);
router.get('/:id', getUserById);

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.delete('/:id', verifyToken, deleteUserById);
router.put('/:id', verifyToken, updateUserById);
router.get('/image/:fileName', verifyToken, getImgById);
router.post('/upload/:id', upload.single('file'), verifyToken, uploadProfil);

router.get('/token', refreshToken);
export default router;
