import express from "express";
import multer from "multer";
const upload = multer();

import {
    getPosts,
    getPostById,
    createPost,
    updatePostById,
    deletePostById,
    likePost
} from "../controllers/Post.js";

// Init express router
const router = express.Router();

// Route get all products
// récupérer tous posts de façons anthechronologique du plus récent au plus ancien)
router.get('/', getPosts);// du plus récent au plus ancien)
// Route get product by id
router.get('/:id', getPostById,);
// Route create a new product
router.post('/', upload.single("file"), createPost);
// router.post('/', upload.single('file'), function (req, res) {
//     console.log("HEYYYYYYYYYYYYYYYYYYYYYYYYYYY"); //multer fonctionne
// });
// Route update Post by id
router.put('/:id', updatePostById);
// Route delete Post by id
router.delete('/:id', deletePostById);


//Route like
router.put('/:id/likes', likePost);


// export router
export default router;