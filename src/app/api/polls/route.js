import { dbConnect } from '@/lib/dbConnect';
import Poll from '@/models/Poll';
import Business from '@/models/Business';
import { jsonResponse } from '@/lib/jsonResponse';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req, user) => {
  await dbConnect();

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const slug = url.searchParams.get('businessSlug');

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (slug) {
    const business = await Business.findOne({ slug });
    if (!business) return jsonResponse(404, 'Business not found');
    filter.business = business._id;
  } else if (user.role === 'business') {
    const businesses = await Business.find({ owner: user.id });
    const businessIds = businesses.map((b) => b._id);
    filter.business = { $in: businessIds };
  }

  const polls = await Poll.find(filter).populate('business', 'name slug');

  return jsonResponse(200, 'Polls fetched', polls);
}, ['admin', 'superadmin', 'business']);

export const POST = withAuth(async (req, user) => {
  await dbConnect();
  const { question, options, businessId, status, type } = await req.json();

  if (!question || !options || options.length < 2) {
    return jsonResponse(400, 'Question and at least 2 options are required');
  }

  if (type && !['options', 'slider'].includes(type)) {
    return jsonResponse(400, 'Invalid poll type');
  }

  let business;
  if (user.role === 'business') {
    business = await Business.findOne({ owner: user.id });
    if (!business) return jsonResponse(403, 'You don’t have a business account');
  } else {
    business = await Business.findById(businessId);
    if (!business) return jsonResponse(404, 'Business not found');
  }

  const poll = await Poll.create({
    question,
    options,
    business: business._id,
    status: status || 'active',
    type: type || 'options',
  });

  return jsonResponse(201, 'Poll created', poll);
}, ['admin', 'superadmin', 'business']);
