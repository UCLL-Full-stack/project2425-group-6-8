import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
    try {
      
        await prisma.item.deleteMany({});
        await prisma.groceryList.deleteMany({});
     
        console.log('Data cleared successfully');
    } catch (error) {
        console.error('Error clearing data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearData();
