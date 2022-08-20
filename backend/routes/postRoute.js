import express from 'express';
import multer from 'multer';

const upload = multer();

import {
  getPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  likePost,
  getImgById,
  updateImg,
  verifyToken,
} from '../controllers/Post.js';

const router = express.Router();

router.get('/', verifyToken, getPosts);
router.get('/:id', verifyToken, getPostById);
router.post('/', verifyToken, upload.single('file'), createPost);
router.put('/:id', verifyToken, updatePostById);
router.delete('/:id', verifyToken, deletePostById);
router.get('/image/:fileName', verifyToken, getImgById);
router.put('/image/:id', verifyToken, upload.single('file'), updateImg);
router.put('/:id/likes', verifyToken, likePost);

export default router;
