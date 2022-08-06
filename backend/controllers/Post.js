import db from "../config/Database.js";
import Posts from "../models/PostModel.js";
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { promisify } from "util";
import stream from "stream";
const pipeline = promisify(stream.pipeline);
import path from "path";
import { v4 as uuidv4 } from 'uuid';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
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

    try {
        console.log(__dirname);
        if (
            !req.file.detectedMimeType == "image/jpg" ||
            !req.file.detectedMimeType == "image/png" ||
            !req.file.detectedMimeType == "image/jpeg"
        )
            throw Error("invalid file");
        if (req.file.size > 2818128) throw Error("max size");
    } catch (error) {
        console.log(error);
    }

    let file = req.file;
    const fileName = "cover" + "-" + uuidv4() + '.jpg';
    //fileName = req.params.id + Date.now() + '.jpg';
    console.log(fileName);

    await pipeline(
        file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/posts/${fileName}`
        )
    );


    let savePost = await Posts.create({
        userId: req.body.userId,
        postMessage: req.body.postMessage,
        // donc on dit si le fichier n'est pas null alors? tu vas chercher sur ce chemin sinon: string vide
        imageUrl: req.file !== null ? fileName : "",
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        usersLiked: [],
        usersDisliked: [],

    });
    ///////////////////////// a tester
    // if (req.fileName)
    //     fs.unlink(' ./public/uploads/posts/' + fileName, (err) => {
    //         if (err) {
    //             console.log("failed to delete local image:" + err);
    //         } else {
    //             console.log('successfully deleted local image');
    //         }
    //     });
    /////////////////////////////
    if (savePost) {
        res.json({ "Status": 200, "Message": savePost });
    } else {
        res.json({ "Status": 400, "Message": 'We failed to save post for some reason' });
    }
    if (req.file.fileName)
        fs.unlink(' ./public/uploads/posts/' + fileName, (err) => {
            if (err) {
                console.log("failed to delete local image:" + err);
            } else {
                console.log('successfully deleted local image');
            }
        });
};

//update new image post


export const updateImg = async (req, res) => {
    try {
        console.log(__dirname);
        if (
            !req.file.detectedMimeType == "image/jpg" ||
            !req.file.detectedMimeType == "image/png" ||
            !req.file.detectedMimeType == "image/jpeg"
        )
            throw Error("invalid file");
        if (req.file.size > 2818128) throw Error("max size");
    } catch (error) {
        console.log(error);
    }
    let file = req.file;
    console.log("req.file", file)
    // uuid signifie "Universally Unique IDentifier"et désigne un standard d'identifiant généré aléatoirement et globalement unique.
    const fileName = "cover" + "-" + uuidv4() + ".jpg";
    //const fileName = name + Math.floor(Math.random() * 1000) * file.detectedFileExtension;

    await pipeline(
        file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/posts/${fileName}`)
    );

    res.send("file uploaded as" + " " + fileName);
    Posts.findOne({
        where: {
            id: req.params.id,
        }
    })

        .then((post) => {
            //condition
            //user.avatar = `${req.protocol}://${req.get("host")}/client/public/uploads/profil/${fileName}`,
            post.imageUrl = fileName;
            post.save()
            console.log(post.fileName)
            //res.status(200).send('Avatar upload successfully');
        });

    // const newCover = await Posts.findOne(req.body, { where: { id: req.params.id } })

    if (req.file);

    Posts.update(req.body.imageUrl, { where: { id: req.params.id } });

    fs.unlink("./public/uploads/posts/" + req.file.filename, (err) => {
        if (err) {
            console.log(req.filename);
            console.log("failed to delete local image:" + err);
        } else {
            console.log('successfully deleted local image');
        }
    });



};


//profil image recuperation 
export const getImgById = async (req, res) => {
    const filePath = path.resolve(`client/public/uploads/posts/${req.params.fileName}`);
    //console.log(filePath);
    console.log("je suis dans get img c est ok")
    res.sendFile(filePath);

};

//Update post by id
export const updatePostById = async (req, res) => {

    try {
        await Posts.update(req.body, { where: { id: req.params.id } });
        res.json({
            "message": "Post Updated"
        });
    } catch (err) {
        return res.status(500).send('We failed to update post for some reason');
    }
};


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
};


/////////////////// LIKES ///////////////////////////////////
export const likePost = async (req, res) => {
    const postId = req.params.id;
    const refreshToken = req.headers.cookie.split('=')[1];
    const dataUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // search the database with id (post & currentUser)
    const post = await Posts.findOne({ where: { id: req.params.id } })
        .catch(res.status(404).json({ "Message": `The post with the id: ${postId} was not found` }))
    const user = await Users.findOne({ where: { id: dataUser.id } })
        .catch(res.status(404).json({ "Message": "The user who made the request was not found" }))

    // check if user is owner
    if (user.id === post.userId) return res.status(400).json({ "Message": "Cannot like your own post" });

    // check if user have already liked
    if (post.usersLiked.includes(user.id)) {
        // remove it from the array and decrement likes
        post.usersLiked = post.usersLiked.filter(userId => userId != user.id);
        await post.decrement("likes");  //https://sequelize.org/docs/v6/core-concepts/model-instances/#incrementing-and-decrementing-integer-values
        await post.save();
        res.status(200).json({ "Message": `You have disliked the post: #${post.id}` })
    } else { //if not...
        // add it to the array and increment likes
        post.usersLiked = [...post.usersLiked, user.id]
        await post.increment("likes");
        await post.save();
        res.status(200).json({ "Message": `You have liked the post: #${post.id}` })
    };
};
