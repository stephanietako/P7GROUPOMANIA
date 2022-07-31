import fs from "fs";
import { promisify } from "util";
import stream from "stream";

const pipeline = promisify(stream.pipeline);
// const { uploadErrors } = require("../utils/errors.utils");
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const uploadProfil = async (req, res) => {
    try {
        // console.log(req.file);
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
    const fileName = req.body.name + ".jpg";
    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );
    try {
        await User.findByIdAndUpdate(
            req.body.userId,
            { $set: { avatar: "./uploads/profil/" + fileName } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};


