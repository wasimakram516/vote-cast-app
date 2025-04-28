import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { jsonResponse } from "@/lib/jsonResponse";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async () => {
  await dbConnect();
  const users = await User.find({}, "name email role createdAt");
  return jsonResponse(200, "Users fetched", users);
}, ["admin", "superadmin"]);

export const POST = withAuth(async (req) => {
  await dbConnect();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return jsonResponse(400, "All fields are required");
  }

  const existing = await User.findOne({ email });
  if (existing) return jsonResponse(409, "User with this email already exists");

  const user = await User.create({ name, email, password });
  return jsonResponse(201, "User created", { _id: user._id });
}, ["admin", "superadmin"]);
