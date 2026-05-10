import "dotenv/config"
import { prisma } from "@/lib/db"
import { hashPassword } from "better-auth/crypto"

async function main() {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "sebastian.b@seqbyte.com" },
    });

    if (existingUser) {
      console.log("✓ Admin user already exists");
      return;
    }

    // Hash password using the same format better-auth verifies
    const hashedPassword = await hashPassword("admin");

    // Create user directly with Prisma
    const user = await prisma.user.create({
      data: {
        email: "sebastian.b@seqbyte.com",
        name: "Admin",
        emailVerified: true,
        role: "admin",
        accounts: {
          create: {
            accountId: "credential",
            providerId: "credential",
            password: hashedPassword,
          },
        },
      },
    });

    console.log("✓ Admin user created successfully");
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: admin`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
