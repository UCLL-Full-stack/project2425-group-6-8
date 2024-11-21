import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
    try {
        await prisma.message.deleteMany({});
        await prisma.groceryList.deleteMany({});
        await prisma.schedule.deleteMany({});
        
        await prisma.user.deleteMany({});
        await prisma.group.deleteMany({});
        await prisma.item.deleteMany({});

        console.log('Data cleared successfully');
    } catch (error) {
        console.error('Error clearing data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearData();
