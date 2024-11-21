import { PrismaClient } from '@prisma/client';
import { ScheduleInput } from '../types'; // Assuming ScheduleInput type exists

const prisma = new PrismaClient();

const main = async () => {
  // Creating Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Dagobert Duck',
      email: 'dagoduck@duckberg.com',
      nickname: 'Wise Old Geezer',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Donald Duck',
      email: 'donald@gmail.com',
      nickname: 'SuperDonald',
    },
  });

  const item1 = await prisma.item.create({
    data: {
      name: 'Peanut Butter',
      description: 'Crunchy peanut butter',
      consumableType: 'FOOD',
      price: 2.99, 
      weight: 200
    },
  });

  const item2 = await prisma.item.create({
    data: {
      name: 'Bread',
      description: 'Whole grain bread',
      consumableType: 'FOOD',
      price: 1.99,
      quantity: 16
    },
  });

  const item3 = await prisma.item.create({
    data: {
      name: 'Tomatoes',
      description: 'Fresh tomatoes',
      consumableType: 'FOOD',
      price: 3.49,
    },
  });

  const groceryList1 = await prisma.groceryList.create({
    data: {
      name: 'Weekly Groceries',
      items: {
        connect: [{ id: item1.id }, { id: item2.id }, { id: item3.id }],
      },
    },
  });

  const group1 = await prisma.group.create({
    data: {
      name: 'Household Family',
      users: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
      groceryLists: {
        connect: [{ id: groceryList1.id }],
      },
    },
  });

  const message1 = await prisma.message.create({
    data: {
      message: 'Hello everyone!',
      timestamp: new Date(),
      user: { connect: { id: user1.id } },
      group: { connect: { id: group1.id } },
    },
  });

  const message2 = await prisma.message.create({
    data: {
      message: 'Ayo, buy those items for me!',
      timestamp: new Date(),
      user: { connect: { id: user2.id } },
      group: { connect: { id: group1.id } },
    },
  });

  const schedule1 = await prisma.schedule.create({
    data: {
      name: 'Shopping Day',
      startDate: new Date('2024-12-15T09:00:00.000Z'),
      endDate: new Date('2024-12-15T12:00:00.000Z'),
      group: { connect: { id: group1.id } },
    },
  });

  console.log('Database has been seeded with sample data!');
};

(async () => {
  try {
    await main();
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
