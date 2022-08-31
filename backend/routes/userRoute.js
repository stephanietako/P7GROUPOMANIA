import express from 'express';
import multer from 'multer';
const upload = multer();

import { verifyToken } from '../middleware/verifyToken.js';
import refreshToken from '../controllers/RefreshToken.js';
import {
  register,
  updateUser,
  login,
  logout,
  allUsers,
  oneUser,
  deleteUser,
  getImg,
} from '../controllers/User.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/refreshToken', refreshToken);
router.get('/:id', oneUser);
router.get('/', verifyToken, allUsers);
router.put('/:id', verifyToken, upload.single('file'), updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.get('/image/:fileName', verifyToken, getImg);

export default router;
