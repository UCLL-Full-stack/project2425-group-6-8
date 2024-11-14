import { User } from './user';
import { Message as MessagePrisma } from '@prisma/client';

export class Message {
    private id?: number | undefined;
    private user: User; 
    private timestamp: Date;  
    private message: string;
    private createdAt?: Date; 
    private updatedAt?: Date; 

    constructor(message: { 
        id?: number; 
        user: User; 
        timestamp: Date;  
        message: string; 
        createdAt?: Date;  
        updatedAt?: Date; 
    }) {
        this.validate(message);

        this.id = message.id;
        this.user = message.user;
        this.timestamp = message.timestamp;
        this.message = message.message;
        this.createdAt = message.createdAt;
        this.updatedAt = message.updatedAt;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    getTimestamp(): Date { 
        return this.timestamp;
    }

    getMessage(): string {
        return this.message;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    validate(message: { user: User; timestamp: Date; message: string }): void {
        if (!message.user) {
            throw new Error('User is required');
        }
        if (!message.timestamp) {
            throw new Error('Timestamp is required');
        }

        if (!message.message?.trim()) {
            throw new Error('Message content is required');
        }
    }
    
    static from({
        id,
        user,
        timestamp,
        message,
        createdAt,
        updatedAt,
    }: MessagePrisma): Message {
        return new Message({
            id,
            user: User.from(user),
            timestamp: new Date(timestamp), 
            message,
            createdAt,
            updatedAt
        });
    }
}
