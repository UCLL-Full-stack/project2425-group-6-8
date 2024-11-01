export class Schedule {
    private id?: number | undefined;
    private name: string;
    private startDate: Date;
    private endDate: Date;

    constructor(schedule: { id?: number; name: string; startDate: Date; endDate: Date }) {
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
}