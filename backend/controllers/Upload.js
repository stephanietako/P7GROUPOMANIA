import Users from '../models/UserModel.js';
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const pipeline = promisify(stream.pipeline);
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

  //res.send('file uploaded as' + ' ' + fileName);
  if (req.file) {
    Users.findOne({
      where: {
        id: req.params.id,
      },
    }).then((user) => {
      console.log(user.avatar);
      user.avatar = fileName;
      user.save();
      console.log(user.avatar);

      const filePath = path.resolve(`client/public/uploads/profil/${fileName}`);
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
        res.send(
          "la photo de profil a été mise à jour c'est " + ' ' + fileName
        );
      }
    });
  }
};
