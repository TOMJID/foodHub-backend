import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  console.log("***  Seeding Admin User...  ***");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@foodhub.com";

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "admin",
      isActive: true,
      emailVerified: true,
    },
    create: {
      id: "admin-user-id",
      name: "System Admin",
      email: adminEmail,
      role: "admin",
      isActive: true,
      emailVerified: true,
    },
  });

  console.log(`*** User ${adminEmail} has been created/updated as ADMIN ***`);
}

main()
  .catch((e) => {
    console.error("*** Error seeding admin user ***", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
