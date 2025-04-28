import { dbConnect } from '@/lib/dbConnect';
import Poll from '@/models/Poll';
import { jsonResponse } from '@/lib/jsonResponse';

export async function POST(req, { params }) {
  await dbConnect();

  const { optionIndex } = await req.json();

  const poll = await Poll.findById(params.id);
  if (!poll) return jsonResponse(404, 'Poll not found');
  if (poll.status !== 'active') return jsonResponse(403, 'Poll is not active');

  if (
    typeof optionIndex !== 'number' ||
    optionIndex < 0 ||
    optionIndex >= poll.options.length
  ) {
    return jsonResponse(400, 'Invalid option index');
  }

  // Increment vote count using direct update
  poll.options[optionIndex].votes += 1;
  await poll.save();

  return jsonResponse(200, 'Vote submitted');
}
