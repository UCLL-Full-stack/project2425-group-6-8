import {
    User as UserPrisma
} from '@prisma/client';
import { Role } from '../types';

export class User {
    private id?: number | undefined;
    private name?: string;
    private email?: string;
    private nickname: string;
    private password: string;
    private createdAt?: Date;
    private updatedAt?: Date;
    private globalRole: Role;  

    constructor(user: {
        id?: number;
        name?: string;
        email?: string;
        nickname: string;
        password: string;
        createdAt?: Date;
        updatedAt?: Date;
        globalRole: Role;
    }) {
        this.validate(user);
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.nickname = user.nickname;
        this.password = user.password;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.globalRole = user.globalRole;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getEmail(): string | undefined {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getNickname(): string {
        return this.nickname;
    }

    setNickname(nickname: string): void {
        this.nickname = nickname;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): Role {
        return this.globalRole;
    }

    setRole(globalRole: Role): void {
        this.globalRole = globalRole;
    }

    validate(user: { name?: string; email?: string; nickname: string; password: string, globalRole: Role; }): void {
        if (!user.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!this.isValidEmail(user.email)) {
            throw new Error('Email is not valid');
        }
        if (!user.nickname?.trim()) {
            throw new Error('Nickname is required');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
        if (!user.globalRole) {
            throw new Error('Role is required');
        }
    }

    equals(user: User): boolean {
        return (
            this.name === user.getName() &&
            this.nickname === user.getNickname() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.globalRole === user.getRole()
        );
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static from({
        id,
        name,
        email,
        nickname,
        password,
        createdAt,
        updatedAt,
        globalRole
    }: UserPrisma): User {
        return new User({
            id,
            name,
            email,
            nickname,
            password,
            createdAt,
            updatedAt,
            globalRole: globalRole as Role,
        });
    }
}
