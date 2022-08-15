import Users from '../models/UserModel.js';
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify(stream.pipeline);
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
//import multer from "multer";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const uploadProfil = async (req, res) => {
  try {
    console.log(__dirname);
    if (
      !req.file.detectedMimeType == 'image/jpg' ||
      !req.file.detectedMimeType == 'image/png' ||
      !req.file.detectedMimeType == 'image/jpeg'
    )
      throw Error('invalid file');
    if (req.file.size > 2818128) throw Error('max size');
  } catch (error) {
    console.log(error);
  }
  let file = req.file;
  console.log('req.file', file);
  // uuid signifie "Universally Unique IDentifier"et désigne un standard d'identifiant généré aléatoirement et globalement unique.
  const fileName = 'avatar' + '-' + uuidv4() + '.jpg';
  //const fileName = name + Math.floor(Math.random() * 1000) * file.detectedFileExtension;

  await pipeline(
    file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );

  res.send('file uploaded as' + ' ' + fileName);
  Users.findOne({
    where: {
      id: req.params.id,
    },
  }).then((user) => {
    console.log(user.avatar);
    user.avatar = fileName;
    user.save();
    console.log(user.avatar);
  });

  if (req.body.email === '' || req.body.password === '') {
    // en fait là l'mage a été uploadé malgré tout donc il faut la remove
    let avatarPath = fileName;
    fs.unlinkSync(avatarPath, (err) => {
      if (err) {
        console.log(`Error deleting ${fileName}`);
      }
    });
    res
      .status(403)
      .render('./register', { err: 'Please fill all the form elements' });
  }
};
