import Users from "../models/UserModel.js";
//import Posts from "../models/PostModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// all users
export const AllUsers = async (req, res) => {
    const allUsers = await Users.findAll();
    res.send(allUsers);
}

//sign up const Register
export const Register = async (req, res) => {
    const { firstName, lastName, email, password, confPassword, avatar } = req.body;
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
export const Login = async (req, res) => {

    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });
    console.log(user);
    if (user === null) return res.status(404).json({ msg: "L'adresse email n'existe pas" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Mot de passe erroné" });
    //const userId = user.id;
    // const firstName = user.firstName;
    // const lastName = user.lastName;
    // const avatar = user.avatar;
    // const email = user.email;
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

export const DeleteUser = async (req, res) => {
    Users.destroy({ where: { id: req.params.id } })
        .then(() => {
            res.status(200).send('Removed Successfully');
        }).catch((err) => {
            console.log(err);
            res.status(500).send('We failed to delete for some reason');
        });
}



