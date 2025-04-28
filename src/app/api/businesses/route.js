import { dbConnect } from "@/lib/dbConnect";
import Business from "@/models/Business";
import { jsonResponse } from "@/lib/jsonResponse";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req, user) => {
  await dbConnect();

  let businesses;

  if (["admin", "superadmin"].includes(user.role)) {
    businesses = await Business.find().populate("owner", "name email");
  } else if (user.role === "business") {
    businesses = await Business.find({ owner: user.id }).populate("owner", "name email");
  } else {
    return jsonResponse(403, "Unauthorized");
  }

  return jsonResponse(200, "Businesses fetched", businesses);
}, ["admin", "superadmin", "business"]);

function sanitizeSlug(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (await Business.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

export const POST = withAuth(async (req, user) => {
  await dbConnect();
  const { name, slug, logoUrl, contactEmail, contactPhone, address, owner, poweredByUrl } = await req.json(); // ✅ poweredByUrl added

  if (!name || !slug) {
    return jsonResponse(400, "Name and slug are required");
  }

  const cleanedSlug = sanitizeSlug(slug);
  const uniqueSlug = await generateUniqueSlug(cleanedSlug);

  let ownerId;
  if (["admin", "superadmin"].includes(user.role)) {
    if (!owner) return jsonResponse(400, "Owner must be specified");
    ownerId = owner;
  } else if (user.role === "business") {
    ownerId = user.id;
  } else {
    return jsonResponse(403, "Unauthorized role");
  }

  const business = new Business({
    name,
    slug: uniqueSlug,
    logoUrl,
    owner: ownerId,
    contactEmail,
    contactPhone,
    address,
    poweredByUrl, 
  });

  await business.save();
  await business.populate("owner", "name email");

  return jsonResponse(201, "Business created", business);
}, ["admin", "superadmin", "business"]);
