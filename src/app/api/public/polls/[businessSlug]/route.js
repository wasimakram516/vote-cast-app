import { dbConnect } from '@/lib/dbConnect';
import Poll from '@/models/Poll';
import Business from '@/models/Business';
import { jsonResponse } from '@/lib/jsonResponse';

export async function GET(req, context) {
  await dbConnect();
  
  const { params } = context; 
  const { businessSlug } = params; 

  const business = await Business.findOne({ slug: businessSlug });
  if (!business) return jsonResponse(404, 'Business not found');

  const polls = await Poll.find({
    business: business._id,
    status: 'active',
  });

  return jsonResponse(200, 'Active polls fetched', polls);
}
