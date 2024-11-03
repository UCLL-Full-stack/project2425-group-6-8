import { ScheduleInput } from '../types';
import { Schedule } from '../model/schedule';

const schedules: Schedule[] = [];
let scheduleIdCounter = 1;

const createSchedule = (scheduleData: ScheduleInput): Schedule => {
    if (!scheduleData.name) throw new Error('Schedule name is required');

    if (!scheduleData.startDate || !scheduleData.endDate) throw new Error('Start and end dates are required');

    if (scheduleData.startDate >= scheduleData.endDate) {
        throw new Error('Start date must be earlier than end date');
    }

    const newSchedule = new Schedule({
        id: scheduleIdCounter++,
        name: scheduleData.name,
        startDate: scheduleData.startDate,
        endDate: scheduleData.endDate,
    });

    schedules.push(newSchedule);
    return newSchedule;
};


const getScheduleById = (id: number): Schedule | undefined => {
    return schedules.find(schedule => schedule.getId() === id);
};

const getAllSchedules = (): Schedule[] => {
    return schedules;
};

export default { createSchedule, getScheduleById, getAllSchedules };
