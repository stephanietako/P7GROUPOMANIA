import express from "express";
import multer from "multer";
const upload = multer();
//import fs from "fs";

import {
    allUsers,
    register,
    login,
    logout,
    deleteUserById,
    getUserById,
    updateUserById,
    getImgById,
    //isAdmin

} from "../controllers/User.js";

import {
    uploadProfil,
} from "../controllers/Upload.js";

const router = express.Router();

router.get('/', allUsers);
router.get('/:id', getUserById);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/:id', deleteUserById);
router.put("/:id", updateUserById);
router.get('/image/:fileName', getImgById);

////////upload
router.post('/upload/:id', upload.single('file'), uploadProfil);


// router.post('/upload', upload.single('file'), function (req, res) {
//     console.log("HEYYYYYYYYYYYYYYYYYYYYYYYYYYY"); //multer fonctionne
// });

// router.post('/upload', upload.single('file'), function (req, res) {
//     if (!req.file || !req.file.path) {
//         return res.sendStatus(400);
//     }
//     console.log(req.file); //path: '/var/folders c est un chemin sécurisé de mac c'est le req.file
// });



export default router;
