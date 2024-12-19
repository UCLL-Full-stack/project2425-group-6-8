import { User, Group } from './index';
import { UserGroup as UserGroupPrisma } from '@prisma/client';

export class UserGroup {
    private id?: number | undefined;
    private user: User;
    private group: Group;
    private role: string;

    constructor(userGroup: {
        id?: number;
        user: User;
        group: Group;
        role: string;
    }) {
        this.validate(userGroup);

        this.id = userGroup.id;
        this.user = userGroup.user;
        this.group = userGroup.group;
        this.role = userGroup.role;
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

    getRole(): string {
        return this.role;
    }

    setRole(role: string): void {
        this.role = role;
    }

    validate(userGroup: { user: User; group: Group; role: string }): void {
        if (!userGroup.user) {
            throw new Error('User is required');
        }
        if (!userGroup.group) {
            throw new Error('Group is required');
        }
        if (!userGroup.role?.trim()) {
            throw new Error('Role is required');
        }
    }

    static from({
        id,
        user,
        group,
        role,
    }: UserGroupPrisma & { user: User; group: Group }): UserGroup {
        return new UserGroup({
            id,
            user,
            group,
            role,
        });
    }
}
