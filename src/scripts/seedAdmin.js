import User from '@/models/User';

export const seedAdmin = async () => {
  try {
    const adminEmail = "admin@wwds.com".toLowerCase();

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", existingAdmin.email);
    } else {
      const admin = new User({
        name: "Super Admin",
        email: adminEmail,
        password: "Admin@WWDS#2025", 
        role: "superadmin",
      });

      await admin.save();
      console.log("🚀 Admin seeded successfully!");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};
