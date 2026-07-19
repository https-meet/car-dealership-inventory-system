import { PrismaClient, Role, VehicleCategory } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const demoUsers = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@dealership.com",
    password: "password123",
    role: Role.ADMIN,
  },
  {
    firstName: "Customer",
    lastName: "User",
    email: "customer@dealership.com",
    password: "password123",
    role: Role.CUSTOMER,
  },
];

const demoVehicles = [
  {
    make: "Tesla",
    model: "Model 3",
    category: VehicleCategory.ELECTRIC,
    year: 2025,
    price: 4200000,
    quantity: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "BMW",
    model: "X5",
    category: VehicleCategory.SUV,
    year: 2024,
    price: 9600000,
    quantity: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "Mercedes-Benz",
    model: "C-Class",
    category: VehicleCategory.SEDAN,
    year: 2024,
    price: 6200000,
    quantity: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "Toyota",
    model: "Fortuner",
    category: VehicleCategory.SUV,
    year: 2025,
    price: 5200000,
    quantity: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "Tata",
    model: "Nexon EV",
    category: VehicleCategory.ELECTRIC,
    year: 2025,
    price: 1850000,
    quantity: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "Mahindra",
    model: "Scorpio N",
    category: VehicleCategory.SUV,
    year: 2024,
    price: 2400000,
    quantity: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "Hyundai",
    model: "i20",
    category: VehicleCategory.HATCHBACK,
    year: 2024,
    price: 1050000,
    quantity: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "Ford",
    model: "Ranger",
    category: VehicleCategory.TRUCK,
    year: 2023,
    price: 4800000,
    quantity: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "Audi",
    model: "TT",
    category: VehicleCategory.COUPE,
    year: 2023,
    price: 7200000,
    quantity: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    make: "Porsche",
    model: "718 Boxster",
    category: VehicleCategory.CONVERTIBLE,
    year: 2024,
    price: 14800000,
    quantity: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
  },
];

async function seedUsers() {
  for (const user of demoUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    const password = await bcrypt.hash(user.password, 10);

    if (existing) {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          password,
          role: user.role,
        },
      });
      continue;
    }

    await prisma.user.create({
      data: {
        ...user,
        password,
      },
    });
  }
}

async function seedVehicles() {
  for (const vehicle of demoVehicles) {
    const existing = await prisma.vehicle.findFirst({
      where: {
        make: { equals: vehicle.make, mode: "insensitive" },
        model: { equals: vehicle.model, mode: "insensitive" },
        year: vehicle.year,
      },
    });

    if (existing) {
      await prisma.vehicle.update({
        where: { id: existing.id },
        data: vehicle,
      });
      continue;
    }

    await prisma.vehicle.create({
      data: vehicle,
    });
  }
}

async function main() {
  await seedUsers();
  await seedVehicles();

  console.log("Seed complete: demo users and vehicles are ready.");
  console.log("Admin: admin@dealership.com / password123");
  console.log("Customer: customer@dealership.com / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
