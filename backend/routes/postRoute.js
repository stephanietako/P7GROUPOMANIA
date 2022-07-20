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
router.get('/', getPosts);//read
// Route get product by id
router.get('/:id', getPostById,);
// Route create a new product
router.post('/', createPost);
// Route update Post by id
router.put('/:id', updatePost);
// Route delete Post by id
router.delete('/:id', deletePost);

// export router
export default router;