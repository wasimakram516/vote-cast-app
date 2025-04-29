import { dbConnect } from "@/lib/dbConnect";
import Poll from "@/models/Poll";
import Business from "@/models/Business";
import { jsonResponse } from "@/lib/jsonResponse";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(
  async (req, user) => {
    await dbConnect();

    const { businessSlug, status } = await req.json();

    if (!businessSlug) {
      return jsonResponse(400, "Business slug is required");
    }

    const business = await Business.findOne({ slug: businessSlug });
    if (!business) {
      return jsonResponse(404, "Business not found");
    }

    const filter = { business: business._id };
    if (status) filter.status = status;

    const polls = await Poll.find(filter);

    if (polls.length === 0) {
      return jsonResponse(404, "No polls found for this business and status");
    }

    // Reset votes
    await Promise.all(
      polls.map(async (poll) => {
        poll.options.forEach((option) => {
          option.votes = 0;
        });
        await poll.save();
      })
    );

    return jsonResponse(200, "Votes reset successfully");
  },
  ["admin", "superadmin", "business"]
);
