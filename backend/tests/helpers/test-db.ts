import { prisma } from "../../src/config/prisma";

export async function clearDatabase() {
  // Child tables first
  await prisma.purchase.deleteMany();

  // Parent tables
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
}