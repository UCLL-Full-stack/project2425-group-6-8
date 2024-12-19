import { User } from './user';
import { Group } from './group';  
import { Message as MessagePrisma, User as UserPrisma, Group as GroupPrisma, UserGroup as UserGroupPrisma } from '@prisma/client';

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
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    getGroup(): Group {
        return this.group;
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

    validate(message: { user: User; group: Group; timestamp: Date; message: string }): void {
        if (!message.user) {
            throw new Error('User is required');
        }
        if (!message.group) {
            throw new Error('Group is required');
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
        group,
        timestamp,
        message,
        createdAt,
        updatedAt,
    }: MessagePrisma & {
        user: UserPrisma;
        group: GroupPrisma & {
            userGroups: (UserGroupPrisma & { user: UserPrisma })[];
        };
    }) {
        return new Message({
            id,
            user: User.from(user),
            group: Group.from({
                ...group,
                userGroups: group.userGroups.map((userGroup) => ({
                    id: userGroup.id,
                    userId: userGroup.userId,
                    groupId: userGroup.groupId,
                    role: userGroup.role,
                    user: User.from(userGroup.user),
                })),
            }),
            timestamp,
            message,
            createdAt,
            updatedAt,
        });
    }
}
