import jwt from 'jsonwebtoken';
import Users from '../models/UserModel.js';

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    // 401, la ré-authentification ne changera rien. L'accès est définitivement interdit et est lié à la logique de l'application, par exemple manque d'une permission d'accès à une ressource.
    //console.log(refreshToken);
    const user = await Users.findAll({
      where: { refresh_token: refreshToken },
    });
    if (!user[0]) return res.sendStatus(403);
    // 403, Forbidden indique qu'un serveur comprend la requête mais refuse de l'autoriser.
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (
          error ||
          user.id !== decoded.id ||
          user.firstName !== decoded.firstName ||
          user.email !== decoded.email
        )
          return res.sendStatus(403);
        const accessToken = jwt.sign(
          {
            id: decoded.id,
            firstName: decoded.firstName,
            email: decoded.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '1h',
          }
        );

        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export default refreshToken;
