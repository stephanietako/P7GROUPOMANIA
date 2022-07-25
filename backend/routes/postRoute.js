import express from "express";
import {
    getPosts,
    getPostById,
    createPost,
    updatePostById,
    deletePostById
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
router.put('/:id', updatePostById);
// Route delete Post by id
router.delete('/:id', deletePostById);
// Route list Post (récupérer tous posts de façons anthechronologique 
// du plus récent au plus ancien)
// router.get('/', getList)

// export router
export default router;