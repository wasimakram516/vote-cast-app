import { dbConnect } from "@/lib/dbConnect";
import EventQuestion from "@/models/EventQuestion";
import { jsonResponse } from "@/lib/jsonResponse";

export async function PUT(req, { params }) {
  await dbConnect();

  const question = await EventQuestion.findById(params.questionId);
  if (!question) return jsonResponse(404, "Question not found");

  const { action } = await req.json();

  if (action === "add") {
    question.votes += 1;
  } else if (action === "remove") {
    question.votes = Math.max(0, question.votes - 1); // prevent negative
  } else {
    return jsonResponse(400, "Invalid action");
  }

  await question.save();

  return jsonResponse(200, "Vote updated", { votes: question.votes });
}
