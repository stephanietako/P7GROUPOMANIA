import Users from "../models/UserModel.js";
import Posts from "../models/PostModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//import multer from "multer";
import { promisify } from "util";
import stream from "stream";
const pipeline = promisify(stream.pipeline);
import path from "path";
//import { v4 as uuidv4 } from 'uuid';
import multer from "multer";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// all users
export const allUsers = async (req, res) => {
    const allUsers = await Users.findAll();
    res.send(allUsers);
    console.log(allUsers);
};

// one user
export const getUserById = async (req, res) => {
    const user = await Users.findOne({
        where: { id: req.params.id },
        include: [{ model: Posts }]
    });
    res.send(user);
};

//profil image recuperation 
export const getImgById = async (req, res) => {
    const filePath = path.resolve(`client/public/uploads/profil/${req.params.fileName}`);
    //console.log(filePath);
    console.log("je suis dans get img c est ok")
    res.sendFile(filePath);

};

//sign up const Register
export const register = async (req, res) => {
    const { firstName, lastName, email, password, confPassword } = req.body;
    const avatar = req.file;
    if (password !== confPassword) return res.status(400).json({ msg: "Please confirm your password" });
    const emailExists = await Users.findOne({ where: { email: req.body.email } });
    if (!emailExists) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await Users.create({
                firstName: firstName,
                lastName: lastName,
                avatar: avatar,
                email: email,
                password: hashPassword
            });
            res.json({ msg: "Inscription réussie" });
        } catch (error) {
            console.log(error);
        }
    } else {
        return res.status(400).json({ msg: "Cette adresse email existe déjà" });
    }
};

//login
export const login = async (req, res) => {

    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });
    console.log(user);
    if (user === null) return res.status(404).json({ msg: "L'adresse email n'existe pas" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Mot de passe erroné" });
    const { id, firstName, lastName, avatar, email } = user;
    const accessToken = jwt.sign({ id, firstName, lastName, email, avatar }, process.env.ACCESS_TOKEN_SECRET, {

        expiresIn: '15s'
    });
    const refreshToken = jwt.sign({ id, firstName, lastName, email, avatar }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    await Users.update({ refresh_token: refreshToken }, {
        where: {
            id: id
        }
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ accessToken });
};

//logout
export const logout = async (req, res) => {
    try {
        req.session = null;
        res.clearCookie("jwt");
        return res.status(200).send({
            message: "You've been logout!"
        });
    } catch (err) {
        this.next(err);
    }
};

//update
export const updateUserById = async (req, res) => {

    try {
        if (req.file == null);
        //if (isAdmin === true && id) {
        //if (isAdmin === true) {
        // je vérifie si isAdmine(role) et l'id sont présents
        await Users.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.json({
            "message": "User update"
        });

    } catch (err) {
        return res.status(500).send('We failed to update user for some reason');
    }
};

//delete
export const deleteUserById = async (req, res) => {
    const user = await Users.findOne({
        where: { id: req.params.id },
        include: [{ model: Posts }]
    });

    user.posts.map(post => {
        Posts.destroy({
            where: { id: post.id }
        })
    })
    user.destroy()
        .then(() => {
            res.status(200).send('Removed Successfully');
        }).catch((err) => {
            res.status(500).send('We failed to delete for some reason');
        });
};
