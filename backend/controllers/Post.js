import Posts from '../models/PostModel.js';
import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify(stream.pipeline);
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { decodeToken } from '../utils/decodeToken.js';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const createPost = async (req, res) => {
  const userData = decodeToken(req.headers.authorization);
  console.log(userData);
  try {
    console.log(__dirname);
    if (
      !req.file.detectedMimeType == 'image/jpg' ||
      !req.file.detectedMimeType == 'image/png' ||
      !req.file.detectedMimeType == 'image/jpeg'
    )
      throw Error('invalid file');
    // A modifier
    // if (req.file.size > 2818128) throw Error('max size');
  } catch (error) {
    console.log(error);
  }

  let file = req.file;
  const fileName = 'cover' + '-' + uuidv4() + '.jpg';
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
    imageUrl: req.file !== null ? fileName : '',
    likes: 0,
    usersLiked: [],
  });

  if (savePost) {
    res.json({ Status: 200, Message: savePost });
  } else {
    res.json({
      Status: 400,
      Message: 'We failed to save post for some reason',
    });
  }
};

export const onePost = async (req, res) => {
  const post = await Posts.findOne({
    where: { id: req.params.id },
    include: [{ model: Users }],
  });
  res.send(post);
};

export const allPosts = async (req, res) => {
  let fields = req.query.fields;
  let offset = parseInt(req.query.offset);
  let limit = parseInt(req.query.limit);
  let order = req.query.order;
  try {
    let post = await Posts.findAll({
      order: [order != null ? order.split(':') : ['id', 'DESC']],
      attributes: fields !== '*' && fields != null ? fields.split(',') : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      raw: true,
      include: [
        {
          model: Users,
          attributes: ['firstName', 'LastName'],
        },
      ],
    });
    return res.json(post);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    await Posts.update(req.body, { where: { id: req.params.id } });
    res.json({
      message: 'Post Updated',
    });
  } catch (err) {
    return res.status(500).send('We failed to update post for some reason');
  }
};

export const deletePost = async (req, res) => {
  if (!req.body.role && req.body.userId == req.params.id)
    return res.status(403).send('Access denied.');

  try {
    await Posts.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({
      message: 'Post Deleted',
    });
  } catch (err) {
    return res.status(500).send('We failed to delete post for some reason');
  }
};

export const updateImg = async (req, res) => {
  ////////////verifyToken
  const dataUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  try {
    console.log(__dirname);
    if (
      !req.file.detectedMimeType == 'image/jpg' ||
      !req.file.detectedMimeType == 'image/png' ||
      !req.file.detectedMimeType == 'image/jpeg'
    )
      throw Error('invalid file');
    //if (req.file.size > 2818128) throw Error('max size');
  } catch (error) {
    console.log(error);
  }

  let file = req.file;
  console.log('req.file', file);
  // uuid "Universally Unique IDentifier"
  const fileName = 'cover' + '-' + uuidv4() + '.jpg';
  await pipeline(
    file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/posts/${fileName}`
    )
  );

  if (req.file) {
    Posts.findOne({
      where: {
        id: req.params.id,
      },
    }).then((post) => {
      const fileName = post.imageUrl;
      const filePath = path.resolve(`client/public/uploads/posts/${fileName}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('failed to delete local image:' + err);
        } else {
          console.info(
            `Successfully removed file with the path of ${filePath}`
          );
        }
      });
    });
  }

  const updateCover = req.file
    ? {
        ...req.body,
        imageUrl: fileName,
      }
    : {
        ...req.body,
      };

  Posts.update({ ...updateCover }, { where: { id: req.params.id } })
    .then(() => res.send("la cover a été mise à jour c'est " + ' ' + fileName))
    .catch((error) => res.status(404).json({ error }));
};
// Image recuperation
export const getImg = async (req, res) => {
  const filePath = path.resolve(
    `client/public/uploads/posts/${req.params.fileName}`
  );
  res.sendFile(filePath);
};

/////////////////// LIKES ///////////////////////////////////
export const likePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Posts.findOne({ where: { id: postId } });
  if (post === null) return res.status(404).send('Post not found');
  const user = await Users.findOne({ where: { id: req.userId } });
  if (user.id === post.userId)
    return res.status(400).json({ Message: 'Cannot like your own post' });
  if (post.usersLiked.includes(user.id)) {
    post.usersLiked = post.usersLiked.filter((userId) => userId != user.id);
    await post.decrement('likes');
    await post.save();
    res
      .status(200)
      .json({ Message: `You have disliked the post: #${post.id}` });
  } else {
    post.usersLiked = [...post.usersLiked, user.id];
    await post.increment('likes');
    await post.save();
    res.status(200).json({ Message: `You have liked the post: #${post.id}` });
  }
};
