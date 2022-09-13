import Posts from '../models/PostModel.js';
import Users from '../models/UserModel.js';
//import jwt from 'jsonwebtoken';
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify(stream.pipeline);
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { uploadImage } from '../utils/uploadImage.js';

export const createPost = async (req, res) => {
  const fileName = await uploadImage(req.file, 'cover', 'posts');
  if (fileName === false)
    return res
      .status(406)
      .send({ message: 'This image format is not recognized !' });
  let savePost = await Posts.create({
    userId: req.body.userId,
    postMessage: req.body.postMessage,
    imagePost: req.file !== null ? fileName : '',
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
  if (!Users.id == req.params.id) return res.status(403).send('Access denied.');
  ////////// UPDATE LE POST MESSAGE
  const currentPost = await Posts.findOne({
    where: {
      id: req.params.id,
    },
  });
  let updatedData = { postMessage: req.body.postMessage };
  ////////////// UPDATE LA COVER DU POST
  if (req.file) {
    const fileName = await uploadImage(
      req.file,
      'cover',
      'posts',
      currentPost.imagePost
    );
    if (fileName === false)
      return res
        .status(406)
        .send({ message: 'This image format is not recognized !' });
    updatedData = { imagePost: fileName };
  }

  try {
    await Posts.update(updatedData, {
      where: { id: req.params.id },
    });
    return res.status(200).send({
      message: 'Post updated !',
    });
  } catch (err) {
    return res.status(500).send({
      message: 'We failed to update your post for some reason...',
    });
  }
};

export const deletePost = async (req, res) => {
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
    return res
      .status(500)
      .send({ message: 'We failed to delete post for some reason' });
  }
};

// LIKES
export const likePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Posts.findOne({ where: { id: postId } });
  if (post === null) return res.status(404).send({ message: 'Post not found' });
  const user = await Users.findOne({ where: { id: req.params.id } });
  if (user === post.userId)
    res.status(200).json({ message: 'Like or unliked post process' });
  if (post.usersLiked.includes(req.params.id)) {
    post.usersLiked = post.usersLiked.filter(
      (userId) => userId != req.params.id
    );
    await post.decrement('likes');
    await post.save();
    res
      .status(200)
      .json({ Message: `You have disliked the post: #${post.id}` });
  } else {
    post.usersLiked = [...post.usersLiked, req.params.id];
    await post.increment('likes');
    await post.save();
    res.status(200).json({ message: `You have liked the post: #${post.id}` });
  }
};

export const getCover = async (req, res) => {
  // const post = await Posts.findOne({
  //   where: { id: req.params.id },
  // });

  const filePath = path.resolve(
    `client/public/uploads/posts/${req.params.fileName}`
  );
  console.log(filePath);
  //console.log(filePath);
  console.log('je suis dans get img c est ok');
  res.sendFile(filePath);
};
