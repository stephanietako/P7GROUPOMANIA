import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) return res.sendStatus(403);
    next();
    // const refreshToken = req.cookies.refreshToken;
    // if (!refreshToken) return res.sendStatus(401);
    // if (!user[0]) return res.sendStatus(403);
    // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
    //   if (err) return res.sendStatus(403);
    // });
  });

  // const refreshToken = req.cookies.refreshToken;
  // if (!refreshToken) return res.sendStatus(401);
  // if (!user[0]) return res.sendStatus(403);
  // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
  //   if (err) return res.sendStatus(403);
  // });
};
