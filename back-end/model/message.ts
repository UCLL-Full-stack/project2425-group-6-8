import { User } from './user';
import {
    Message as MessagePrisma,
    User as UserPrisma,
} from '@prisma/client';
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

  static from(message: MessagePrisma & { user?: UserPrisma | null } | undefined): Message {
    if (!message) {
        throw new Error('Invalid message data'); 
    }

    if (!message.user) {
        throw new Error('Message must include a valid user relation');
    }

    return new Message({
        id: message.id,
        user: User.from(message.user),
        timestamp: message.timestamp,
        message: message.message,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    });
}

}
