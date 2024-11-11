import { ScheduleInput } from '../types';
import { Schedule } from '../model/schedule';
import scheduleDb from '../repository/schedule.db';

const createSchedule = (scheduleData: ScheduleInput): Schedule => {
    if (!scheduleData.name) throw new Error('Schedule name is required');
    if (!scheduleData.startDate || !scheduleData.endDate) throw new Error('Start and end dates are required');
    if (scheduleData.startDate >= scheduleData.endDate) throw new Error('Start date must be earlier than end date');

    const newSchedule = new Schedule({
        name: scheduleData.name,
        startDate: scheduleData.startDate,
        endDate: scheduleData.endDate,
    });

    scheduleDb.createSchedule(newSchedule);
    return newSchedule;
};

const getScheduleById = (id: number): Schedule | undefined => {
    return scheduleDb.getScheduleById(id);
};

const getAllSchedules = (): Schedule[] => {
    return scheduleDb.getAllSchedules();
};

export default { createSchedule, getScheduleById, getAllSchedules };
