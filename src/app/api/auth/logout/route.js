import { jsonResponse } from '@/lib/jsonResponse';

export async function POST() {
  return jsonResponse(200, 'Logged out successfully', null, null, {
    'Set-Cookie': `refreshToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
  });
}
