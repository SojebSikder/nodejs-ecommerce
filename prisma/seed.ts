import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Checkout prisma schema properly at this directory
 * ->prisma->schema.prisma
 */

async function seed() {
  // ---->seed user account<----
  const password = "123456";
  // salt rounds uses 10 in the whole project
  const hashedPassword = await bcrypt.hash(password, 10);
  // seed admin user account
  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    },
  });
  // ---->end seed user account<----
}

seed();
