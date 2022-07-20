import express from "express";
//import { Register, Login } from "../controllers/User.js";
import { AllUsers, Register, Login, Logout, DeleteUser, getUserById } from "../controllers/User.js";
// import { verifyToken } from "../middleware/VerifyToken.js";
// //import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/", AllUsers);
router.get("/:id", getUserById)
router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);
router.delete('/:id', DeleteUser);

export default router;