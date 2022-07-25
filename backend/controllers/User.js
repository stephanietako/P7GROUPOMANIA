import Users from "../models/UserModel.js";
import Posts from "../models/PostModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// all users
export const allUsers = async (req, res) => {
    const allUsers = await Users.findAll();
    res.send(allUsers);
}

// one user
export const getUserById = async (req, res) => {
    const user = await Users.findOne({
        where: { id: req.params.id },
        include: [{ model: Posts }]
    });
    res.send(user);
}

//sign up const Register
export const register = async (req, res) => {
    const { firstName, lastName, email, password, confPassword, avatar } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Please confirm your password" });
    const emailExists = await Users.findOne({ where: { email: req.body.email } });
    if (!emailExists) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await Users.create({
                firstName: firstName,
                lastName: lastName,
                //userImg: "128x128.png",
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
}
// //login
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
        //res.status(200).json("OUT");
        return res.status(200).send({
            message: "You've been logout!"
        });
    } catch (err) {
        this.next(err);
    }
};

//delete
export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: { id: req.params.id },
        include: [{ model: Posts }]
    });

    user.posts.map(post => {
        Posts.destroy({
            where: { id: post.id }
            // .catch((err) => {
            //     return res.status(500).send('We failed to delete posts for some reason');
            // })
        })
    })
    user.destroy()
        .then(() => {
            res.status(200).send('Removed Successfully');
        }).catch((err) => {
            res.status(500).send('We failed to delete for some reason');
        });
}



