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

// Init express router
const router = express.Router();

// Route get all products
router.get('/', verifyToken, getPosts); // du plus récent au plus ancien)
// Route get product by id
router.get('/:id', verifyToken, getPostById);
// Route create a new product
router.post('/', verifyToken, upload.single('file'), createPost);
// Route update Post by id
router.put('/:id', verifyToken, updatePostById);
// Route delete Post by id
router.delete('/:id', verifyToken, deletePostById);
// router get image by filename parametre
router.get('/image/:fileName', verifyToken, getImgById);
///////////
router.put('/image/:id', verifyToken, upload.single('file'), updateImg);

//Route like
router.put('/:id/likes', verifyToken, likePost);

// export router
export default router;
