import { Pagination } from "./pagination";
import { SingleRole } from "./roles";

export interface SingleUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
}

export interface User extends Pagination {
    data: SingleUser[];
}

export interface UserRole extends SingleUser {
    roles: SingleRole[];
}