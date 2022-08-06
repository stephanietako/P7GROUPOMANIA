import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import Users from "../models/UserModel";
dotenv.config()


////////////////////////////////////////////////////////////////////////

// export const checkUser = (req, res, next) => {
//     const token = req.cookies.jwt;
//     if (token) {
//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
//             if (err) {
//                 res.locals.user = null;
//                 res.cookie("jwt", "", { maxAge: 1 });
//                 next();
//             } else {
//                 let users = await Users.findById(decodedToken.id);
//                 res.locals.users = users;
//                 next();
//             }
//         });
//     } else {
//         res.locals.users = null;
//         console.log('No token');
//         next();
//     }
// };
export const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.send(200).json('no token')
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No token');
    }
};
