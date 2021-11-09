export class User {
    id: number;
    uid: number;
    email: string;

    constructor(id: number, uid: number, email: string) {
        this.id = id;
        this.uid = uid;
        this.email = email;
    }
}
