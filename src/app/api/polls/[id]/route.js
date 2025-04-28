import { dbConnect } from '@/lib/dbConnect';
import Poll from '@/models/Poll';
import Business from '@/models/Business';
import { jsonResponse } from '@/lib/jsonResponse';
import { withAuth } from '@/lib/withAuth';

export const PUT = withAuth(async (req, user, { params }) => {
  await dbConnect();
  const { question, options, status, type } = await req.json();

  const poll = await Poll.findById(params.id).populate('business');
  if (!poll) return jsonResponse(404, 'Poll not found');

  const isAdmin = ['admin', 'superadmin'].includes(user.role);
  const isOwner = String(poll.business.owner) === user.id;

  if (!isAdmin && !isOwner) {
    return jsonResponse(403, 'You do not have permission to update this poll');
  }

  if (question !== undefined) poll.question = question;
  if (options !== undefined) poll.options = options;
  if (status !== undefined) poll.status = status;
  if (type !== undefined) {
    if (!['options', 'slider'].includes(type)) {
      return jsonResponse(400, 'Invalid poll type');
    }
    poll.type = type;
  }

  await poll.save();

  return jsonResponse(200, 'Poll updated', poll);
}, ['admin', 'superadmin', 'business']);

export const DELETE = withAuth(async (req, user, { params }) => {
  await dbConnect();
  const poll = await Poll.findById(params.id).populate('business');
  if (!poll) return jsonResponse(404, 'Poll not found');

  const isAdmin = ['admin', 'superadmin'].includes(user.role);
  const isOwner = String(poll.business.owner) === user.id;

  if (!isAdmin && !isOwner) {
    return jsonResponse(403, 'You do not have permission to delete this poll');
  }

  await Poll.findByIdAndDelete(params.id);
  return jsonResponse(200, 'Poll deleted');
}, ['admin', 'superadmin', 'business']);
