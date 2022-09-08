import fs from 'fs';
import path from 'path';
import stream from 'stream';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
const pipeline = promisify(stream.pipeline);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Utils
import { uploadImage } from '../utils/uploadImage.js';

// Models
import Users from '../models/UserModel.js';
import Posts from '../models/PostModel.js';

// Auth User and Registration
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
        avatar: 'avatar-defaultProfil.jpg',
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
  const { id, firstName, email, role } = user;
  const accessToken = jwt.sign(
    { id, firstName, email, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  );
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '2h',
  });
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
  const currentUser = await Users.findOne({
    where: {
      id: req.params.id,
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
    updatedData = { ...req.body, profil: fileName };
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
    return res.status(500).send('We failed to update for some reason');
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

export const deleteUser = async (req, res, next) => {
  if (!req.body.role && req.body.userId == req.params.id)
    return res.status(403).send('Access denied.');
  const user = await Users.findOne({
    where: { id: req.params.id },
    include: [{ model: Posts }],
  });

  user.posts.map((post) => {
    if (Posts) {
      Posts.destroy({
        where: { id: post.id },
      });
    }
  });

  try {
    user.destroy();
    req.session = null;
    res.clearCookie('jwt');
    return res.status(200).send({
      message: 'All users and posts are deleted !',
    });
  } catch (err) {
    this.next(err);
  }
};

export const getImg = (req, res) => {
  console.log(fileName);
  const filePath = path.resolve(
    `client/public/uploads/profil/${req.params.fileName}`
  );
  res.sendFile(filePath);
};
