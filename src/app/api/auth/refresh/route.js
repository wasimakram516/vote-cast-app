import { verifyToken, signAccessToken } from '@/lib/auth';
import User from '@/models/User';
import { dbConnect } from '@/lib/dbConnect';
import { jsonResponse } from '@/lib/jsonResponse';

export async function POST(req) {
  await dbConnect();
  const cookies = req.headers.get('cookie') || '';
  const token = cookies.split(';').find(c => c.trim().startsWith('refreshToken='))?.split('=')[1];

  if (!token) return jsonResponse(401, 'No refresh token provided');

  const payload = verifyToken(token);
  if (!payload) return jsonResponse(403, 'Invalid refresh token');

  const user = await User.findById(payload.id);
  if (!user) return jsonResponse(404, 'User not found');

  const newAccessToken = signAccessToken(user);
  return jsonResponse(200, 'Token refreshed', { accessToken: newAccessToken });
}
