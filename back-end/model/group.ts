export class Group {
    private name: string;
    private groupid: number;
    private userid: number; 
    private grocerylistid: number; 
    private scheduleid: number; 
    private messageid: number;

    constructor(name: string, groupid: number, userid: number, grocerylistid: number, scheduleid: number, messageid: number) {
        this.name = name;
        this.groupid = groupid;
        this.userid = userid;
        this.grocerylistid = grocerylistid;
        this.scheduleid = scheduleid;
        this.messageid = messageid;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getId(): number | undefined {
        return this.groupid;
    }
}