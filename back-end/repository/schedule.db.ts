import { Schedule } from '../model';

const schedules: Schedule[] = [];

const dummySchedule = new Schedule({
    name: 'Weekly Groceries',
    id: 1,
    startDate: new Date('2024-12-01T10:00:00'),
    endDate: new Date('2024-12-01T12:00:00'),
});

schedules.push(dummySchedule);

const createSchedule = (schedule: Schedule): Schedule => {
    schedules.push(schedule);
    console.log('Schedule created:', schedule.getName());
    return schedule;
};

const getAllSchedules = (): Schedule[] => schedules;

const getScheduleById = (id: number): Schedule | undefined => {
    return schedules.find(schedule => schedule.getId() === id);
};

export default { createSchedule, getAllSchedules, getScheduleById };
