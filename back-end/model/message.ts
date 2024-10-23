export class Message {
    private messageid: number;
    private userid: number; 
    private timestamp: string;
    private message: string;

    constructor(messageid: number, userid: number, timestamp: string, message: string) {
        this.messageid = messageid;
        this.userid = userid;
        this.timestamp = timestamp;
        this.message = message;
    }

    getId(): number | undefined {
        return this.messageid;
    }

    getUserId(): number {
        return this.userid;
    }

    setUserId(userid: number): void {
        this.userid = userid;
    }

    getTimestamp(): string {
        return this.timestamp;
    }

    setTimestamp(timestamp: string): void {
        this.timestamp = timestamp;
    }

    getMessage(): string {
        return this.message;
    }

    setMessage(message: string): void {
        this.message = message;
    }
}