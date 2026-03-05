import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const citizenPassword = await bcrypt.hash("password123", 12);
  const volunteerPassword = await bcrypt.hash("password123", 12);

  const citizen = await prisma.user.upsert({
    where: { email: "citizen@repair.cafe" },
    update: {},
    create: {
      name: "Alice Citizen",
      email: "citizen@repair.cafe",
      password: citizenPassword,
      role: "CITIZEN",
    },
  });

  const volunteer = await prisma.user.upsert({
    where: { email: "volunteer@repair.cafe" },
    update: {},
    create: {
      name: "Bob Volunteer",
      email: "volunteer@repair.cafe",
      password: volunteerPassword,
      role: "VOLUNTEER",
    },
  });

  const DAYS_7 = 7 * 24 * 60 * 60 * 1000;
  const DAYS_14 = 14 * 24 * 60 * 60 * 1000;
  const EVENT_DURATION_MS = 4 * 60 * 60 * 1000;

  const event1 = await prisma.repairEvent.create({
    data: {
      title: "Spring Repair Café",
      location: "Community Hall, Main St 1",
      startAt: new Date(Date.now() + DAYS_7),
      endAt: new Date(Date.now() + DAYS_7 + EVENT_DURATION_MS),
      capacity: 20,
      volunteerOwnerId: volunteer.id,
    },
  });

  await prisma.repairEvent.create({
    data: {
      title: "Summer Fix-It Day",
      location: "Library Meeting Room",
      startAt: new Date(Date.now() + DAYS_14),
      endAt: new Date(Date.now() + DAYS_14 + EVENT_DURATION_MS),
      capacity: 15,
      volunteerOwnerId: volunteer.id,
    },
  });

  await prisma.repairRequest.createMany({
    data: [
      {
        title: "Broken toaster",
        category: "SMALL_APPLIANCE",
        description: "Toaster stopped heating. It's 3 years old.",
        photos: [],
        status: "SUBMITTED",
        createdByUserId: citizen.id,
      },
      {
        title: "Torn jacket zipper",
        category: "TEXTILE",
        description: "The zipper on my winter jacket is broken.",
        photos: [],
        status: "REVIEWED",
        createdByUserId: citizen.id,
        claimedByVolunteerId: volunteer.id,
      },
      {
        title: "Laptop keyboard issue",
        category: "ELECTRONICS",
        description: "Several keys are not working after spilling water.",
        photos: [],
        status: "SCHEDULED",
        createdByUserId: citizen.id,
        claimedByVolunteerId: volunteer.id,
        scheduledEventId: event1.id,
      },
      {
        title: "Flat bike tire",
        category: "BIKE",
        description: "Both tires are flat and need patching.",
        photos: [],
        status: "IN_REPAIR",
        createdByUserId: citizen.id,
        claimedByVolunteerId: volunteer.id,
        scheduledEventId: event1.id,
      },
      {
        title: "Wooden chair leg broken",
        category: "WOOD",
        description: "One leg of the dining chair snapped.",
        photos: [],
        status: "REPAIRED",
        createdByUserId: citizen.id,
        claimedByVolunteerId: volunteer.id,
      },
    ],
  });

  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
