export class Schedule {
    private id?: number | undefined;
    private name: string;
    private startDate: Date;
    private endDate: Date;

    constructor(schedule: { id?: number; name: string; startDate: Date; endDate: Date }) {
        this.validate(schedule); 

        this.id = schedule.id;
        this.name = schedule.name;
        this.startDate = schedule.startDate;
        this.endDate = schedule.endDate;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    setStartDate(startDate: Date): void {
        this.startDate = startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    setEndDate(endDate: Date): void {
        this.endDate = endDate;
    }

    validate(schedule: { name: string; startDate: Date; endDate: Date }): void {
        if (!schedule.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!(schedule.startDate instanceof Date) || isNaN(schedule.startDate.getTime())) {
            throw new Error('Start date is required and must be a valid date');
        }
        if (!(schedule.endDate instanceof Date) || isNaN(schedule.endDate.getTime())) {
            throw new Error('End date is required and must be a valid date');
        }
        if (schedule.endDate <= schedule.startDate) {
            throw new Error('End date must be after start date');
        }
    }
}
