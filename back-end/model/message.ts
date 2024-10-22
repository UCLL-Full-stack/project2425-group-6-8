export class Message {
    messageid: number;
    userid: number; 
    timestamp: string;
    message: string;

    constructor(messageid: number, userid: number, timestamp: string, message: string) {
        this.messageid = messageid;
        this.userid = userid;
        this.timestamp = timestamp;
        this.message = message;
    }
}