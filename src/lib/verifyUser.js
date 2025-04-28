import { verifyToken } from './auth';

export async function getUserFromRequest(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  return user || null;
}
