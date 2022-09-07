import express from 'express';
import multer from 'multer';
const upload = multer();

import { verifyToken } from '../middleware/verifyToken.js';
import refreshToken from '../controllers/RefreshToken.js';

import {
  allPosts,
  onePost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getCover,
  cover,
} from '../controllers/Post.js';

const router = express.Router();

router.get('/refreshToken', refreshToken);
router.get('/', verifyToken, allPosts);
router.get('/:id', verifyToken, onePost);
router.get('/cover/:fileName', verifyToken, getCover);
router.post('/', verifyToken, upload.single('file'), createPost);
router.put('/:id', verifyToken, upload.single('file'), updatePost);
router.put('/cover/:id', verifyToken, upload.single('file'), cover);
router.put('/:id/likes', verifyToken, likePost);
router.delete('/:id', verifyToken, deletePost);

export default router;
