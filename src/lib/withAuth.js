import { getUserFromRequest } from './verifyUser';
import { jsonResponse } from './jsonResponse';

export function withAuth(handler, allowedRoles = []) {
  return async (req, context) => {
    const user = await getUserFromRequest(req);

    if (!user) {
      return jsonResponse(401, 'Unauthorized: No valid token');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return jsonResponse(403, 'Forbidden: Insufficient permissions');
    }

    return handler(req, user, context); 
  };
}
