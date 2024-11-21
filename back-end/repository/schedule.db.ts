import { Schedule as SchedulePrisma } from '@prisma/client';
import { Schedule } from '../model/schedule';
import database from './database';

Schedule.from = function ({
    id,
    name,
    startDate,
    endDate,
}: SchedulePrisma): Schedule {
    return new Schedule({
        id,
        name,
        startDate,
        endDate,
    });
};

const createSchedule = async (schedule: Schedule): Promise<Schedule> => {
    try {
        const schedulePrisma = await database.schedule.create({
            data: {
                name: schedule.getName(),
                startDate: schedule.getStartDate(),
                endDate: schedule.getEndDate(),
            },
        });
        return Schedule.from(schedulePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
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

const getScheduleById = async (id: number): Promise<Schedule | null> => {
    try {
        const schedulePrisma = await database.schedule.findUnique({
            where: { id },
        });
        if (!schedulePrisma) return null;
        return Schedule.from(schedulePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

export default { createSchedule, getAllSchedules, getScheduleById };
