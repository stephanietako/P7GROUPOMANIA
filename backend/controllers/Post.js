import Posts from "../models/PostModel.js";

// Get all Posts
export const getPosts = async (req, res) => {
    try {
        const post = await Posts.findAll();
        res.send(post);
    } catch (err) {
        console.log(err);
    }
}

// Get post by id
export const getPostById = async (req, res) => {
    try {
        const post = await Posts.findAll({
            where: {
                id: req.params.id
            }
        });
        res.send(post[0]);
    } catch (err) {
        console.log(err);
    }
}

// Create a new post
export const createPost = async (req, res) => {
    try {
        await Posts.create(req.body);
        res.json({
            "message": "Product Created"
        });
    } catch (err) {
        console.log(err);
    }
}

// Update post by id
export const updatePost = async (req, res) => {
    try {
        await Posts.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Post Updated"
        });
    } catch (err) {
        console.log(err);
    }
}

// Delete post by id
export const deletePost = async (req, res) => {
    try {
        await Posts.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Post Deleted"
        });
    } catch (err) {
        console.log(err);
    }
}
