import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const pipeline = promisify(stream.pipeline);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const uploadImage = async (
  file,
  startFileName,
  folderName,
  originalFileName
) => {
  if (originalFileName !== 'avatar-defaultProfil.jpg') {
    const filePath = path.resolve(
      `client/public/uploads/${folderName}/${originalFileName}`
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log('failed to delete local image:' + err);
      } else {
        console.info(`Successfully removed file with the path of ${filePath}`);
      }
    });
  }

  // if (
  //   file.detectedFileExtension == '.jpg' ||
  //   file.detectedFileExtension == '.png' ||
  //   file.detectedFileExtension == '.jpeg' ||
  //   file.detectedFileExtension == '.gif'
  // ) {
  //   console.log('OK !!!!!');
  // } else {
  //   console.log('PROBLEME !!!!!');
  // }

  const fileName = startFileName + '-' + uuidv4();

  await pipeline(
    file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/${folderName}/${fileName}`
    )
  );

  return fileName;
};
