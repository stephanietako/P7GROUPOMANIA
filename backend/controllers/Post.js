import db from "../config/Database.js";
//import likes from "../models/LikeModel.js";
import Posts from "../models/PostModel.js";
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

//const fs = require("fs");


// Get all Posts
export const getPosts = async (req, res) => {
    // récupérer directement dans l'url les 4 paramètres suivants
    // fields récupérer dans les colonnes qu'on souhaite afficher
    let fields = req.query.fields;
    // limit et offset récupérer les posts par segmentation pour ne pas qu on puisse récupérer tous les posts d'un coup si y'en a trop
    // donc on créer un système de page
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);
    // sortir les posts dans un ordre particulier
    let order = req.query.order;
    try {
        let post = await Posts.findAll({
            order: [(order != null) ? order.split(':') : ['id', 'DESC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            raw: true,
            include: [{
                model: Users,
                attributes: ['firstName', 'LastName']
            }],
        });
        return res.json(post);
    } catch (err) {
        return res.status(500).send({ msg: err.message });
    }
}

//Get post by id
export const getPostById = async (req, res) => {
    const post = await Posts.findOne({
        where: { id: req.params.id },
        include: [{ model: Users }]
    });
    res.send(post);
}

// Create a new post
export const createPost = async (req, res) => {
    let savePost = await Posts.create({
        postMessage: req.body.postMessage,
        imageUrl: req.body.imageUrl,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        usersLiked: [],
        usersDisliked: [],

    });
    if (savePost) {
        res.json({ "Status": 200, "Message": savePost });
    } else {
        res.json({ "Status": 400, "Message": 'We failed to save post for some reason' });
    }
};

//Update post by id
export const updatePostById = async (req, res) => {
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
        return res.status(500).send('We failed to update post for some reason');
    }
}

// Delete post by id
export const deletePostById = async (req, res) => {
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
        return res.status(500).send('We failed to delete post for some reason');
    }
}
/////////////////// LIKES ///////////////////////////////////

export const likePost = (req, res) => {
    if (!req.body.id) {
        res.json({ "Status": 400, "Message": 'We failed to find id for some reason' });
    } else {
        // search the database with id
        Posts.findOne({ id: req.body.id }, (err, post) => {
            if (err) {
                res.json({ "Status": 400, "Message": 'Invalid Post id' });
            } else {
                if (!post) {
                    res.json({ "Status": 400, "Message": 'That post was not found' });
                } else {
                    Users.findOne({ id: req.body.userId }, (err, user) => {
                        if (err) {
                            res.json({ "Status": 400, "Message": 'Something went wrong' });
                        } else {
                            if (!user) {
                                res.json({ "Status": 400, "Message": 'Could not authenticate user' });
                            } else {
                                if (user.id === post.userId) {
                                    res.status(404).json({ "Status": 400, "Message": "Cannot like your own post" });
                                } else {
                                    if (post.usersLiked.includes(user.firstName && user.lastName)) {
                                        res.status(404).json({ "Status": 400, "Message": "You're already liked this post" });
                                    } else {
                                        if (post.usersDisliked.includes(user.firstName && user.lastName)) {
                                            post.likes--;
                                            const arrayIndex = post.usersDisliked.indexOf(user.firstName && user.lastName)
                                            post.usersDisliked.splice(arrayIndex, 1);
                                            post.likes++;
                                            post.usersLiked.push(user.firstName && user.lastName);
                                            post.save((err) => {
                                                if (err) {
                                                    res.json({ "Status": 400, "Message": "Something went wrong" })

                                                } else {
                                                    res.json({ "Status": 200, "Message": "Post disliked ! " });
                                                }
                                            });
                                        } else {
                                            post.likes++;
                                            post.usersLiked.push(user.firstName && user.lastName);
                                            post.save((err) => {
                                                if (err) {
                                                    res.json({ "Status": 400, "Message": "Something went wrong" });
                                                } else {
                                                    res.json({ "Status": 200, "Message": "Post liked ! " });
                                                }

                                            })
                                        }
                                    }
                                }

                            }
                        }
                    })
                };
            }
        })
    }
}

