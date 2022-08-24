import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: { refresh_token: refreshToken },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const lastName = user[0].lastName;
        const firstName = user[0].firstName;
        const imgUrl = user[0].imgUrl;
        const email = user[0].email;
        const role = user[0].role;
        const bio = user[0].bio;
        const accessToken = jwt.sign(
          { userId, lastName, firstName, imgUrl, email, role, bio },
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
