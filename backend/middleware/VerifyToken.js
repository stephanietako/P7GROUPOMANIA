// import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        // Erreur 403, ou "accès interdit" s'affiche sur une page Web lorsque le serveur refuse d'exécuter une requête qu'il a pourtant comprise. Il s'agit d'une erreur http qui indique purement et simplement un accès refusé à un contenu, une ressource, etc
        if (err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    })
}