export class Group {
    name: string;
    groupid: number;
    userid: number; 
    grocerylistid: number; 
    scheduleid: number; 
    messageid: number;

    constructor(name: string, groupid: number, userid: number, grocerylistid: number, scheduleid: number, messageid: number) {
        this.name = name;
        this.groupid = groupid;
        this.userid = userid;
        this.grocerylistid = grocerylistid;
        this.scheduleid = scheduleid;
        this.messageid = messageid;
    }
}