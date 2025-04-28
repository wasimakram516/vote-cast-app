import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Business from "@/models/Business";
import { jsonResponse } from "@/lib/jsonResponse";
import { withAuth } from "@/lib/withAuth";

// ✅ Update User (admin/superadmin only)
export const PUT = withAuth(async (req, user, { params }) => {
  await dbConnect();
  const { name, email, password } = await req.json();

  const isAdmin = ["admin", "superadmin"].includes(user.role);
  if (!isAdmin) return jsonResponse(403, "Unauthorized");

  const targetUser = await User.findById(params.id);
  if (!targetUser) return jsonResponse(404, "User not found");

  targetUser.name = name || targetUser.name;
  targetUser.email = email || targetUser.email;
  if (password) targetUser.password = password;

  await targetUser.save();
  return jsonResponse(200, "User updated");
}, ["admin", "superadmin"]);

// ✅ Delete User (only if not linked to a business)
export const DELETE = withAuth(async (req, user, { params }) => {
  await dbConnect();

  const isAdmin = ["admin", "superadmin"].includes(user.role);
  if (!isAdmin) return jsonResponse(403, "Unauthorized");

  const linkedBusiness = await Business.findOne({ owner: params.id });
  if (linkedBusiness) {
    return jsonResponse(400, "Cannot delete user: assigned to a business");
  }

  const userToDelete = await User.findById(params.id);
  if (!userToDelete) return jsonResponse(404, "User not found");

  await userToDelete.deleteOne();
  return jsonResponse(200, "User deleted");
}, ["admin", "superadmin"]);
