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
  //getImg,
} from '../controllers/User.js';

const router = express.Router();

router.get('/refreshToken', refreshToken);
router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);

router.get('/', verifyToken, allUsers);
router.get('/:id', verifyToken, oneUser);

//router.get('/image/:fileName', getImg);
router.put('/:id', verifyToken, upload.single('file'), updateUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;
