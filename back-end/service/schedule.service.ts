import { ScheduleInput } from '../types';
import { Schedule } from '../model/schedule';
import scheduleDb from '../repository/schedule.db';

const createSchedule = async (scheduleData: ScheduleInput): Promise<Schedule> => {
    if (!scheduleData.name) throw new Error('Schedule name is required');
    if (!scheduleData.startDate || !scheduleData.endDate) throw new Error('Start and end dates are required');
    if (scheduleData.startDate >= scheduleData.endDate) throw new Error('Start date must be earlier than end date');

    const newSchedule = new Schedule({
        name: scheduleData.name,
        startDate: scheduleData.startDate,
        endDate: scheduleData.endDate,
    });

    return await scheduleDb.createSchedule(newSchedule);
};

const getScheduleById = async (id: number): Promise<Schedule | null> => {
    return await scheduleDb.getScheduleById(id);
};

const getAllSchedules = async (): Promise<Schedule[]> => {
    return await scheduleDb.getAllSchedules();
};

export default { createSchedule, getScheduleById, getAllSchedules };
