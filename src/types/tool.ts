import type { User } from "./user";

interface Requirement {
    verify: "",
    score: "",
    knowledge: ""
}

export type Tool = {
    id: number;
    owner: User;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    location: string;
    quantity: number;
    requirements: Requirement[];
    availability: string;
};  