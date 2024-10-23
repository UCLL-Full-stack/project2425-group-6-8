export class User {
    private userid: number;
    private name: string;
    private email: string;
    private nickname: string;

    constructor(userid: number, name: string, email: string, nickname: string) {
        this.userid = userid;
        this.name = name;
        this.email = email;
        this.nickname = nickname;
    }

    getId(): number | undefined {
        return this.userid;
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