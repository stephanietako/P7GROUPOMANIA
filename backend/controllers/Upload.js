import Users from "../models/UserModel.js";
import fs from "fs";
import { promisify } from "util";
import stream from "stream";
const pipeline = promisify(stream.pipeline);
import path from "path";
import { v4 as uuidv4 } from 'uuid';
//import multer from "multer";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const uploadProfil = async (req, res) => {
    try {
        console.log(__dirname);
        if (
            !req.file.detectedMimeType == "image/jpg" ||
            !req.file.detectedMimeType == "image/png" ||
            !req.file.detectedMimeType == "image/jpeg"
        )
            throw Error("invalid file");
        if (req.file.size > 2818128) throw Error("max size");
    } catch (error) {
        console.log(error);
    }
    let file = req.file;
    console.log("req.file", file)
    const fileName = uuidv4() + ".jpg";
    //const fileName = name + Math.floor(Math.random() * 1000) * file.detectedFileExtension;

    await pipeline(
        file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`)
    );
    res.send("file uploaded as" + fileName);
    Users.findOne({
        where: {
            id: req.params.id,
        }
    })

        .then((user) => {
            console.log(user.avatar);
            //condition
            //user.avatar = `${req.protocol}://${req.get("host")}/client/public/uploads/profil/${fileName}`,
            user.avatar = fileName;

            // Users.findOneAndUpdate({
            //     where: {
            //         file: req.file
            //     }
            // },

            //     //{ _d: req.body.userId },

            //     {
            //         $set: {
            //             avatar: `${req.protocol}:/${req.get("host")}./client/public/uploads/profil/${req.file.originalName

            //                 }`,
            //         },
            //     }
            // )
            user.save()
            console.log(user.avatar)
            //res.status(200).json({ message: "success" })
            // .catch((err) =>
            //     res.satus(400).json({ error: err, message: "error" })
            // );
            //else fs unlik


        });
}
