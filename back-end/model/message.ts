import { User } from "./user";

export class Message {
    private id?: number | undefined;
    private user: User; 
    private timestamp: string;
    private message: string;

    constructor(message: { id?: number; user: User; timestamp: string; message: string }) {
        this.id = message.id;
        this.user = message.user;
        this.timestamp = message.timestamp;
        this.message = message.message;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    getTimestamp(): string {
        return this.timestamp;
    }

    getMessage(): string {
        return this.message;
    }
}