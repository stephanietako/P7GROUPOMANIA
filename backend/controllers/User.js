import fs from 'fs';
import path from 'path';
import stream from 'stream';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
const pipeline = promisify(stream.pipeline);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Utils
import { verifyToken } from '../utils/verifyToken.js';
import { decodeToken } from '../utils/decodeToken.js';
import { uploadImage } from '../utils/uploadImage.js';

// Models
import Users from '../models/UserModel.js';
import Posts from '../models/PostModel.js';

// Create user
export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const emailExists = await Users.findOne({ where: { email: req.body.email } });
  if (!emailExists) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
      await Users.create({
        firstName: firstName,
        lastName: lastName,
        avatar: 'defaultProfil.jpg',
        email: email,
        password: hashPassword,
        role: false,
      });
      return res.status(200).json({ message: `Successful registration` });
    } catch (error) {
      return res
        .status(400)
        .json({ message: `The user account could not be created` });
    }
  } else {
    return res
      .status(400)
      .json({ message: 'This email address already exists' });
  }
};
export const login = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user === null)
    return res
      .status(404)
      .json({ message: 'The email address does not exist' });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ message: 'Password not valid' });
  const { id, firstName, lastName, email, role } = user;
  const accessToken = jwt.sign(
    { id, firstName, lastName, email, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '2h',
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

export const logout = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const dataUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    //if (dataUser == null) res.redirect('/');
    if (!dataUser) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization failed' });
    }
    req.response = req.email;
    if (dataUser == null) res.redirect('/');
  }
  try {
    req.session = null;
    res.clearCookie('jwt');
    return res.status(200).send({
      message: "You've been logout!",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  const userData = decodeToken(req.headers.authorization);
  //Condition a revoir pas correcte
  if (!req.body.role && req.body.userId == req.params.id)
    return res.status(403).send('Access denied.');
  const currentUser = await Users.findOne({
    where: {
      id: userData.id,
    },
  });

  let updatedData = req.body;

  if (req.file) {
    const fileName = await uploadImage(
      req.file,
      'avatar',
      'profil',
      currentUser.avatar
    );
    updatedData = { ...req.body, avatar: fileName };
  }

  try {
    await Users.update(updatedData, {
      where: {
        id: req.params.id,
      },
    });
    res.json({
      message: 'User update',
    });
  } catch (err) {
    return res.status(500).send('We failed to update post for some reason');
  }
};

export const allUsers = async (req, res) => {
  const allUsers = await Users.findAll();
  res.send(allUsers);
};

export const oneUser = async (req, res) => {
  const user = await Users.findOne({
    where: { id: req.params.id },
    include: [{ model: Posts }],
  });

  res.send(user);
};

export const deleteUser = async (req, res) => {
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

export const getImg = async (req, res) => {
  const filePath = path.resolve(
    `client/public/uploads/profil/${req.params.fileName}`
  );
  res.sendFile(filePath);
};
