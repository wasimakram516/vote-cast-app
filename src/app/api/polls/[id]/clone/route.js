import { dbConnect } from '@/lib/dbConnect';
import Poll from '@/models/Poll';
import { jsonResponse } from '@/lib/jsonResponse';
import { withAuth } from '@/lib/withAuth';

export const POST = withAuth(async (req, user, { params }) => {
  await dbConnect();

  const existingPoll = await Poll.findById(params.id);
  if (!existingPoll) return jsonResponse(404, 'Original poll not found');

  const clonedPoll = new Poll({
    business: existingPoll.business,
    question: existingPoll.question + ' (Copy)',
    options: existingPoll.options.map(opt => ({
      text: opt.text,
      imageUrl: opt.imageUrl,
    })),
    status: existingPoll.status,
    type: existingPoll.type,
  });

  await clonedPoll.save();

  return jsonResponse(201, 'Poll cloned successfully', clonedPoll);
}, ['admin', 'superadmin', 'business']);
