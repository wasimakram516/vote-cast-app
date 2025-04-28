import { dbConnect } from "@/lib/dbConnect";
import Business from "@/models/Business";
import Poll from "@/models/Poll";
import { jsonResponse } from "@/lib/jsonResponse";
import { withAuth } from "@/lib/withAuth";

function sanitizeSlug(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;

  while (
    await Business.findOne({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

export const PUT = withAuth(
  async (req, user, { params }) => {
    await dbConnect();

    const {
      name,
      slug,
      logoUrl,
      contactEmail,
      contactPhone,
      address,
      owner,
      poweredByUrl,
    } = await req.json(); // ✅ poweredByUrl added

    const business = await Business.findById(params.id);
    if (!business) return jsonResponse(404, "Business not found");

    const isOwner = user.id === String(business.owner);
    const isAdmin = ["admin", "superadmin"].includes(user.role);

    if (!isOwner && !isAdmin) {
      return jsonResponse(
        403,
        "You do not have permission to update this business"
      );
    }

    let updatedSlug = business.slug;
    if (slug && slug !== business.slug) {
      const cleaned = sanitizeSlug(slug);
      updatedSlug = await generateUniqueSlug(cleaned, business._id);
    }

    business.name = name || business.name;
    business.slug = updatedSlug;
    business.logoUrl = logoUrl || business.logoUrl;
    business.contactEmail = contactEmail || business.contactEmail;
    business.contactPhone = contactPhone || business.contactPhone;
    business.address = address || business.address;
    business.poweredByUrl = poweredByUrl || business.poweredByUrl; // ✅ Update poweredByUrl

    if (isAdmin && owner && owner !== String(business.owner)) {
      business.owner = owner;
    }

    await business.save();
    await business.populate("owner", "name email");

    return jsonResponse(200, "Business updated", business);
  },
  ["admin", "superadmin", "business"]
);

export const DELETE = withAuth(
  async (req, user, { params }) => {
    await dbConnect();

    const business = await Business.findById(params.id);
    if (!business) return jsonResponse(404, "Business not found");

    const isOwner = user.id === String(business.owner);
    const isAdmin = ["admin", "superadmin"].includes(user.role);

    if (!isOwner && !isAdmin) {
      return jsonResponse(
        403,
        "You do not have permission to delete this business"
      );
    }

    const associatedPollsCount = await Poll.countDocuments({
      business: business._id,
    });
    if (associatedPollsCount > 0) {
      return jsonResponse(
        400,
        "Cannot delete business: there are polls associated with it."
      );
    }

    await Business.findByIdAndDelete(params.id);

    return jsonResponse(200, "Business deleted successfully");
  },
  ["admin", "superadmin", "business"]
);
