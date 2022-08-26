export const uploadImage = (file, startFileName, folderName) => {
    try {
        console.log(__dirname);
        if (
          !file.detectedMimeType == 'image/jpg' ||
          !file.detectedMimeType == 'image/png' ||
          !file.detectedMimeType == 'image/jpeg'
        )
          throw Error('invalid file');
        //if (req.file.size > 2818128) throw Error('max size');
      } catch (error) {
        console.log(error);
      }
    
      // uuid "Universally Unique IDentifier"
      const fileName = startFileName + '-' + uuidv4();
      await pipeline(
        file.stream,
        fs.createWriteStream(
          `${__dirname}/../client/public/uploads/${folderName}/${fileName}`
        )
      );
      return fileName
}