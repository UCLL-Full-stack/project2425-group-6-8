export class Schedule {
    private scheduleid: number;
    private name: string;
    private startDate: Date;
    private endDate: Date;

    constructor(scheduleid: number,name: string, startDate: Date, endDate: Date) {
        this.scheduleid = scheduleid;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getId(): number | undefined {
        return this.scheduleid;
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