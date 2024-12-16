import { Group } from '.';
import { User } from './user';
import { Message as MessagePrisma, User as UserPrisma, Group as GroupPrisma } from '@prisma/client';

export class Message {
    private id?: number | undefined;
    private user: User;
    private group: Group; 
    private timestamp: Date;
    private message: string;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(message: {
        id?: number;
        user: User;
        group: Group;  
        timestamp: Date;
        message: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(message);

        this.id = message.id;
        this.user = message.user;
        this.group = message.group;  
        this.timestamp = message.timestamp;
        this.message = message.message;
        this.createdAt = message.createdAt;
        this.updatedAt = message.updatedAt;

        console.log(`Message instance created: ${JSON.stringify(this)}`);
    }

    getId(): number | undefined {
        console.log(`Message.getId called: ${this.id}`);
        return this.id;
    }

    getUser(): User {
        console.log(`Message.getUser called for user ID: ${this.user.getId()}`);
        return this.user;
    }

    getGroup(): Group {
        console.log(`Message.getgroup called: ${this.group}`);
        return this.group;
    }

    getTimestamp(): Date {
        console.log(`Message.getTimestamp called: ${this.timestamp}`);
        return this.timestamp;
    }

    getMessage(): string {
        console.log(`Message.getMessage called: ${this.message}`);
        return this.message;
    }

    getCreatedAt(): Date | undefined {
        console.log(`Message.getCreatedAt called: ${this.createdAt}`);
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        console.log(`Message.getUpdatedAt called: ${this.updatedAt}`);
        return this.updatedAt;
    }

    validate(message: { user: User; group: Group; timestamp: Date; message: string }): void {
        console.log('Validating message data:', message);

        if (!message.user) {
            console.error('Validation failed: User is required');
            throw new Error('User is required');
        }
        if (!message.group) {  
            console.error('Validation failed: Group ID is required');
            throw new Error('Group ID is required');
        }
        if (!message.timestamp) {
            console.error('Validation failed: Timestamp is required');
            throw new Error('Timestamp is required');
        }
        if (!message.message?.trim()) {
            console.error('Validation failed: Message content is required');
            throw new Error('Message content is required');
        }

        console.log('Message validation successful');
    }

    static from(message: MessagePrisma & { user?: UserPrisma | null, group?: GroupPrisma | null } | undefined): Message {
    if (!message) {
        console.error('Message.from - Invalid message data:', message);
        throw new Error('Invalid message data');
    }

    if (!message.user) {
        console.error(
            `Message.from - Missing user relation for message ID ${message.id || 'unknown'}:`,
            message
        );
        throw new Error('Message must include a valid user relation');
    }

    if (!message.group) {
        console.error(
            `Message.from - Missing group relation for message ID ${message.id || 'unknown'}:`,
            message
        );
        throw new Error('Message must include a valid group relation');
    }

    try {
        return new Message({
            id: message.id,
            user: User.from(message.user),
            group: Group.from(message.group),  
            timestamp: message.timestamp,
            message: message.message,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        });
    } catch (error) {
        console.error(
            'Message.from - Error creating Message instance:',
            { message, error }
        );
        throw new Error(`Failed to create Message instance: ${error}`);
    }
}

}
