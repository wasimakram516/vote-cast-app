import { dbConnect } from '@/lib/dbConnect';
import { jsonResponse } from '@/lib/jsonResponse';

export async function GET() {
  try {
    await dbConnect();
    return jsonResponse(200, "Test API is working ✅");
  } catch (error) {
    return jsonResponse(500, "Test API failed ❌", null, error.message);
  }
}
