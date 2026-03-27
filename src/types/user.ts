export type User = {
    id?: number;
    name: string;
    email: string;
    phone: string;
    password?: string;
    residency: string;
    role?: string;
    picture?: string;
    bio?: string;
}