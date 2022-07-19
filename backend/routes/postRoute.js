import express from "express";
import {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} from "../controllers/Post.js";

// Init express router
const router = express.Router();

// Route get all products
router.get('/posts', getPosts);
// Route get product by id
router.get('/posts/:id', getPostById,);
// Route create a new product
router.post('/posts', createPost);
// Route update Post by id
router.put('/posts/:id', updatePost);
// Route delete Post by id
router.delete('/posts/:id', deletePost);

// export router
export default router;