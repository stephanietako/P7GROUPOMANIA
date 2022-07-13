import express from "express";
//import { Register, Login } from "../controllers/User.js";
import { AllUsers, Register, Login, Logout, DeleteUser } from "../controllers/User.js";
// //getUser, getUsers, Logout, updateUser, uploadImage, deleteUser
// import { verifyToken } from "../middleware/VerifyToken.js";
// //import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/", AllUsers);
router.post('/register', Register);
router.post('/login', Login);
router.delete('/logout', Logout);
router.delete('/:id', DeleteUser);



export default router;