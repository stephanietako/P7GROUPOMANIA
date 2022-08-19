import Users from '../models/UserModel.js';
import Posts from '../models/PostModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify(stream.pipeline);
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

//Register
export const register = async (req, res) => {
  const { firstName, lastName, email, password, avatar } = req.body;
  if (req.file) {
    const avatar = req.file;
  } else {
    const avatar = 'defaultProfil.jpg';
  }

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
        password: hashPassword,
        role: false,
      });
      res.json({ msg: 'Inscription réussie' });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(400).json({ msg: 'Cette adresse email existe déjà' });
  }
};

//profil image recuperation
export const getImgById = async (req, res) => {
  const filePath = path.resolve(
    `client/public/uploads/profil/${req.params.fileName}`
  );
  console.log('je suis dans get img c est ok');
  res.sendFile(filePath);
};

//login
export const login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  console.log(user);
  if (user === null)
    return res.status(404).json({ msg: "L'adresse email n'existe pas" });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ msg: 'Mot de passe erroné' });
  const { id, firstName, lastName, email, role } = user;
  const accessToken = jwt.sign(
    { id, firstName, lastName, email, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  );
  const refreshToken = jwt.sign(
    { id, firstName, lastName, email, role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '30d',
    }
  );
  await Users.update(
    { refresh_token: refreshToken },
    {
      where: {
        id: id,
      },
    }
  );

  return res.status(200).send({
    message: "You've been login !",
    id: id,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

//logout
export const logout = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const dataUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (dataUser == null) res.redirect('/');
    if (!dataUser) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization failed' });
    }
  }
  try {
    req.session = null;
    res.clearCookie('jwt');
    return res.status(200).send({
      message: "You've been logout!",
    });
  } catch (err) {
    console.log(err);
  }
};

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
    include: [{ model: Posts }],
  });

  res.send(user);
};

//update
export const updateUserById = async (req, res) => {
  try {
    if (!req.body.role && req.body.userId == req.params.id)
      return res.status(403).send('Access denied.');
    await Users.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({
      message: 'User update',
    });
  } catch (err) {
    return res.status(500).send('You are not allowed to update user');
  }
};

//delete
export const deleteUserById = async (req, res) => {
  if (!req.body.role && req.body.userId == req.params.id)
    return res.status(403).send('Access denied.');
  const user = await Users.findOne({
    where: { id: req.params.id },
    include: [{ model: Posts }],
  });

  user.posts.map((post) => {
    Posts.destroy({
      where: { id: post.id },
    });
  });
  user
    .destroy()
    .then(() => {
      res.status(200).send('Removed Successfully');
    })
    .catch((err) => {
      res.status(500).send('We failed to delete for some reason');
    });
  try {
    req.session = null;
    res.clearCookie('jwt');
    return res.status(200).send({
      message: 'All users and posts are deleted !',
    });
  } catch (err) {
    this.next(err);
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.email = decoded.email;
    next();
  });
};
