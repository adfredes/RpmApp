export interface UserAccount {
    userName: string;
    created: Date;
    lastActive?: Date;
    firstName: string;
    lastName: string;
    roles?: string[];
}
