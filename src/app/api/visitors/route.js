import { dbConnect } from "@/lib/dbConnect";
import Visitor from "@/models/Visitor";
import Business from "@/models/Business";
import { jsonResponse } from "@/lib/jsonResponse";
import { withAuth } from "@/lib/withAuth";

// ✅ GET all visitors with populated eventHistory
export const GET = withAuth(async (req, user) => {
  await dbConnect();

  if (!["admin", "superadmin", "business"].includes(user.role)) {
    return jsonResponse(403, "Unauthorized");
  }

  const visitors = await Visitor.find()
    .populate("eventHistory.business", "name") 
    .sort({ createdAt: -1 });

  return jsonResponse(200, "Visitors fetched", visitors);
}, ["admin", "superadmin", "business"]);
