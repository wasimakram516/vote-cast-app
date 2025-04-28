import { dbConnect } from '@/lib/dbConnect';
import Business from '@/models/Business';
import Poll from '@/models/Poll';
import { jsonResponse } from '@/lib/jsonResponse';

export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url);
  const slug = url.searchParams.get('businessSlug');
  const status = url.searchParams.get('status'); 

  if (!slug) return jsonResponse(400, 'businessSlug is required');

  const business = await Business.findOne({ slug });
  if (!business) return jsonResponse(404, 'Business not found');

  const filter = { business: business._id };
  if (status) filter.status = status;

  const polls = await Poll.find(filter);

  const resultData = polls.map(poll => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0) || 1; 

    const options = poll.options.map(opt => ({
      text: opt.text,
      imageUrl: opt.imageUrl,
      votes: opt.votes,
      percentage: parseFloat(((opt.votes / totalVotes) * 100).toFixed(2))
    }));

    return {
      _id: poll._id,
      question: poll.question,
      totalVotes: totalVotes === 1 && poll.options.every(opt => opt.votes === 0) ? 0 : totalVotes,
      options
    };
  });

  return jsonResponse(200, 'Results fetched', resultData);
}
