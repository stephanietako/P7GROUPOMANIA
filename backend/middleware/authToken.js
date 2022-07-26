import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import Users from "../models/UserModel";
dotenv.config()

// export const authToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) return res.sendStatus(401);
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         // Erreur 403, ou "accès interdit" s'affiche sur une page Web lorsque le serveur refuse d'exécuter une requête qu'il a pourtant comprise. Il s'agit d'une erreur http qui indique purement et simplement un accès refusé à un contenu, une ressource, etc
//         if (err) return res.sendStatus(403);
//         req.email = decoded.email;
//         next();
//     })
// }


/* Verification authentification */
// export const authToken = (req, res, next) => {
//     try {
//         // récupération du token 
//         // et split (diviser la chaîne de caratère en un tablaeau autour de l'espace qui se trouve entre notre mot clé bearer et token))
//         const token = req.headers.authorization.split(" ")[1];
//         const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
//         const userId = decodedToken.userId;
//         if (req.body.userId && req.body.userId !== userId) {
//             throw "Invalid user ID";
//         } else {
//             next();
//         }
//     } catch {
//         res.status(401).json({
//             error: new Error("Invalid request!"),
//         });
//     }
// };


export const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie("jwt", "", { maxAge: 1 });
                next();
            } else {
                let users = await Users.findById(decodedToken.id);
                res.locals.users = users;
                next();
            }
        });
    } else {
        res.locals.users = null;
        next();
    }
};

export const requireAuth = (req, res, next) => {
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