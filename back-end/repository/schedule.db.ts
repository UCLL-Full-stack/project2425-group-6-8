import { Schedule } from '../model/schedule';
import database from './database';
import { Schedule as SchedulePrisma } from '@prisma/client';

Schedule.from = function ({
    id,
    name,
    startDate,
    endDate
}: SchedulePrisma): Schedule {
    return new Schedule({
        id,
        name,
        startDate,
        endDate
    });
};

const getAllSchedules = async (): Promise<Schedule[]> => {
    try {
        const schedulesPrisma = await database.schedule.findMany();
        return schedulesPrisma.map((schedulePrisma) => Schedule.from(schedulePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

export default {
    getAllSchedules,
};
