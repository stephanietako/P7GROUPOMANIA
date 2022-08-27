import express from 'express';
import multer from 'multer';
const upload = multer();

import { verifyToken } from '../utils/verifyToken.js';
import {
  allPosts,
  onePost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getImg,
} from '../controllers/Post.js';
import { uploadImage } from '../utils/uploadImage.js';

const router = express.Router();

router.get('/', verifyToken, allPosts);
router.get('/:id', verifyToken, onePost);
router.post('/', verifyToken, upload.single('file'), createPost);
////se caler sur celle-là
router.put('/:id', verifyToken, updatePost);
//////////////////////////
router.delete('/:id', verifyToken, deletePost);
router.get('/image/:fileName', verifyToken, getImg);
// A modifier ou supprimer
router.put('/image/:id', verifyToken, upload.single('file'), uploadImage);
router.put('/:id/likes', verifyToken, likePost);

export default router;
