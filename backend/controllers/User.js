import Users from '../models/UserModel.js';
import Posts from '../models/PostModel.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify(stream.pipeline);
import path from 'path';
import { verifyToken } from '../utils/verifyToken.js';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

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
      res.json({ msg: 'Inscription réussie' });
    } catch (error) {
      return res
        .status(400)
        .json({ message: `nous n'avons pu creer votre compte utilisateur` });
    }
  } else {
    return res.status(400).json({ message: 'Cette adresse email existe déjà' });
  }
};
export const login = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user === null)
    return res.status(404).json({ msg: "L'adresse email n'existe pas" });

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
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (req, res) => {
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
//avatar
export const avatar = async (req, res) => {
  try {
    const upload = uploadImage(fileName);
    console.log('HELLO IMAGE');
    console.log(upload);
  } catch (error) {
    console.log(error);
  }
  let file = req.file;
  console.log('req.file', file);
  const fileName = 'avatar' + '-' + uuidv4();
  console.log(fileName);
  await pipeline(
    file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );
  console.log(req.file);
  if (req.file) {
    Users.findOne({
      where: {
        id: req.params.id,
      },
    }).then((user) => {
      const filePath = path.resolve(
        `client/public/uploads/profil/${user.avatar}`
      );
      console.log(user.avatar);
      user.avatar = fileName;
      user.save();
      console.log(user.avatar);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('failed to delete local image:' + err);
        } else {
          console.info(
            `Successfully removed file with the path of ${filePath}`
          );
        }
      });
      if (req.file) {
        Users.update(req.body, { where: { avatar: req.body } });
        res.send({
          message: `Picture ${fileName} updated.`,
        });
      }
    });
  }
};
// Profil image recuperation
export const getImg = async (req, res) => {
  const filePath = path.resolve(
    `client/public/uploads/profil/${req.params.fileName}`
  );
  res.sendFile(filePath);
};
