export class User {
    private id?: number | undefined;
    private name: string;
    private email: string;
    private nickname: string;

    constructor(user: { id?: number; name: string; email: string; nickname: string }) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.nickname = user.nickname;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getEmail(): string {
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
}
