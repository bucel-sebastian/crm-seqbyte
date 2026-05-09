import { prisma } from "@/lib/db";
import * as bcrypt from "bcryptjs";

async function seed() {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@crm.local" },
    });

    if (existingUser) {
      console.log("✓ Admin user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123456", 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email: "admin@crm.local",
        name: "Admin User",
        emailVerified: true,
        role: "admin",
        accounts: {
          create: {
            accountId: "local",
            providerId: "credential",
            password: hashedPassword,
          },
        },
      },
    });

    console.log("✓ Admin user created successfully");
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: Admin@123456`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
