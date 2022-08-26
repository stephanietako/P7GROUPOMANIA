import jwt from 'jsonwebtoken';

export const decodeToken = (authHeader) => {
  const token = authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded;
};
