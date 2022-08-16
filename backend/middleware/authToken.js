import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.send(200).json('no token');
        } else {
          console.log(decodedToken.id);
          next();
        }
      }
    );
  } else {
    console.log('No token');
  }
};
/////////////////////
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
}
