import { dbConnect } from "@/lib/dbConnect";
import EventQuestion from "@/models/EventQuestion";
import { jsonResponse } from "@/lib/jsonResponse";
import { withAuth } from "@/lib/withAuth";

// ✅ PUT: Mark answered / update text
export const PUT = withAuth(async (req, user, { params }) => {
  await dbConnect();

  const { answered, text } = await req.json();
  const question = await EventQuestion.findById(params.questionId).populate("business");

  if (!question) return jsonResponse(404, "Question not found");

  const isAdmin = ["admin", "superadmin"].includes(user.role);
  const isOwner = String(question.business.owner) === user.id;

  if (!isAdmin && !isOwner) return jsonResponse(403, "Not authorized");

  if (answered !== undefined) question.answered = answered;
  if (text) question.text = text;

  await question.save();
  return jsonResponse(200, "Question updated", question);
}, ["admin", "superadmin", "business"]);

// ✅ DELETE: Remove question
export const DELETE = withAuth(async (req, user, { params }) => {
  await dbConnect();

  const question = await EventQuestion.findById(params.questionId).populate("business");

  if (!question) return jsonResponse(404, "Question not found");

  const isAdmin = ["admin", "superadmin"].includes(user.role);
  const isOwner = String(question.business.owner) === user.id;

  if (!isAdmin && !isOwner) return jsonResponse(403, "Not authorized");

  await question.deleteOne();
  return jsonResponse(200, "Question deleted");
}, ["admin", "superadmin", "business"]);
