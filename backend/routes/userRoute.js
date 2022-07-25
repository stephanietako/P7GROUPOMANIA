import express from "express";
import {
    allUsers,
    register,
    login,
    logout,
    deleteUser,
    getUserById
} from "../controllers/User.js";
//import { authToken} from "../middleware/authToken.js";
// //import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/", allUsers);
router.get("/:id", getUserById)
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/:id', deleteUser);

export default router;