import Posts from "../models/PostModel.js";
//const fs = require("fs");


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
    // const postObject = JSON.stringify(req.body);
    // const post = new Posts({
    //     ...postObject,
    //     // host (le nom d'hôte)
    //     //imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
    //     //}`,
    //     likes: [],
    //     usersLiked: [],
    // });

    // console.log(req.body);
    // //res.send(req.body)
    // res.send(postObject)

    //return res.status(201).json(post);
    let savePost = await Posts.create({
        postMessage: req.body.postMessage,
        imageUrl: req.body.imageUrl,
        likes: req.body.likes,
        usersLiked: []

    });
    if (savePost) {
        res.json({ "Status": 200, "Message": savePost });
    } else {
        res.json({ "Status": 400, "Message": "probleme avec la création du post" });
    }
};



//Update post by id
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
