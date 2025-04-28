import { dbConnect } from '@/lib/dbConnect';
import Business from '@/models/Business';
import { jsonResponse } from '@/lib/jsonResponse';

export async function GET(req, { params }) {
    await dbConnect();
  
    const { slug } = await params;
  
    if (!slug) return jsonResponse(400, "Business slug is required");
  
    const business = await Business.findOne({ slug }).lean();
    if (!business) return jsonResponse(404, "Business not found");
  
    return jsonResponse(200, "Business fetched", business);
  }
  