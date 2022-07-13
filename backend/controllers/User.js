import Users from "../models/UserModel.js";
// import Posts from "../models/PostModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//import multer from "multer";
//import path from "path";
import fse from "fs-extra";

// all users
export const AllUsers = async (req, res) => {
    const allUsers = await Users.findAll();
    res.send(allUsers);
}

//sign up const Register
export const Register = async (req, res) => {
    const { firstName, lastName, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Veuillez confirmer le mot de passe" });
    const emailExists = await Users.findOne({ where: { email: req.body.email } });
    if (!emailExists) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await Users.create({
                firstName: firstName,
                lastName: lastName,
                //userImg: "128x128.png",
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
}
// //login
export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Mot de passe erroné" });
        const userId = user[0].id;
        const firstName = user[0].firstName;
        const lastName = user[0].lastName;

        //const userImg = user[0].userImg;
        const email = user[0].email;
        const accessToken = jwt.sign({ userId, firstName, lastName, email }, process.env.ACCESS_TOKEN_SECRET, {
            //userImg
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ userId, firstName, lastName, email }, process.env.REFRESH_TOKEN_SECRET, {
            //userImg
            expiresIn: '1d'
        });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "L'adresse email n'existe pas" });
    }

};

//logout

export const Logout = async (req, res) => {
    try {
        req.session = null;
        res.clearCookie("jwt");
        //res.status(200).json("OUT");
        return res.status(200).send({
            message: "You've been logout!"
        });
    } catch (err) {
        this.next(err);
    }
};

export function DeleteUser(req, res) {
    Users.destroy({ where: { id: req.params.id } })
        .then(() => {
            res.status(200).send('Removed Successfully');
        }).catch((err) => {
            console.log(err);
            res.status(500).send('We failed to delete for some reason');
        });
}

// export const Logout = async (req, res) => {
//     req.session.destroy(() => {
//         res.redirect('/');
//     });
// }


