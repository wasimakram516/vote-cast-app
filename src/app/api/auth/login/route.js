import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { jsonResponse } from '@/lib/jsonResponse';
import { signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return jsonResponse(401, 'Invalid email or password');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const { password: _, ...safeUser } = user.toObject();

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: safeUser,
      },
      error: null,
    }),
    {
      status: 200,
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
        'Content-Type': 'application/json',
      },
    }
  );
}
