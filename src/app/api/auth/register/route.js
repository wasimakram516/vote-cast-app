import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { jsonResponse } from '@/lib/jsonResponse';

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return jsonResponse(400, 'All fields are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return jsonResponse(409, 'Email already in use');

  const user = new User({ name, email, password, role: 'business' });
  await user.save();

  return jsonResponse(201, 'Business user registered successfully', {
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
