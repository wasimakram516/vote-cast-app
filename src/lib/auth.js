import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
const accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

export function signAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: accessExpiry,
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ id: user._id }, jwtSecret, {
    expiresIn: refreshExpiry,
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}
