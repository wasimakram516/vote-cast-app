import { dbConnect } from "@/lib/dbConnect";
import Business from "@/models/Business";
import EventQuestion from "@/models/EventQuestion";
import Visitor from "@/models/Visitor";
import { jsonResponse } from "@/lib/jsonResponse";

// ✅ GET: Fetch all questions for a business
export async function GET(req, { params }) {
  await dbConnect();

  const business = await Business.findOne({ slug: params.businessSlug });
  if (!business) return jsonResponse(404, "Business not found");

  const questions = await EventQuestion.find({ business: business._id })
    .populate("visitor", "name phone company")
    .sort({ createdAt: -1 });

  return jsonResponse(200, "Questions fetched", questions);
}

// ✅ POST: Submit a new question (public, no auth)
export async function POST(req, { params }) {
  await dbConnect();

  const business = await Business.findOne({ slug: params.businessSlug });
  if (!business) return jsonResponse(404, "Business not found");

  const { name, phone, company, text } = await req.json();

  if (!name || !text)
    return jsonResponse(400, "Name and question are required");

  let visitor = await Visitor.findOne({ name, phone });

  if (!visitor) {
    // ✅ New visitor — create with initial eventHistory
    visitor = await Visitor.create({
      name,
      phone,
      company,
      eventHistory: [
        {
          business: business._id,
          count: 1,
          lastInteraction: new Date(),
        },
      ],
    });
  } else {
    // ✅ If they already exist, we check if they’ve interacted with this business before
    const existing = visitor.eventHistory.find(
      (entry) => entry.business.toString() === business._id.toString()
    );

    if (existing) {
      existing.count += 1;
      existing.lastInteraction = new Date();
    } else {
      visitor.eventHistory.push({
        business: business._id,
        count: 1,
        lastInteraction: new Date(),
      });
    }

    await visitor.save();
  }

  const question = await EventQuestion.create({
    business: business._id,
    text,
    visitor: visitor._id,
  });

  const populated = await question.populate("visitor", "name company");

  return jsonResponse(201, "Question submitted", populated);
}
