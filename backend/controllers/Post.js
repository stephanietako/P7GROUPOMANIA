import Posts from "../models/PostModel.js";
import Users from "../models/UserModel.js";
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
    // const postObject = JSON.stringify(req.body);
    let savePost = await Posts.create({
        postMessage: req.body.postMessage,
        imageUrl: req.body.imageUrl,
        likes: req.body.likes,
        usersLiked: []

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
