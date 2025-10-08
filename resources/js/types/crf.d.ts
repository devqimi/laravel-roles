import { Pagination } from './pagination';
import { SingleRole } from './roles';

// ✅ Define Department and Category types
type Department = {
    id: number;
    dname: string;
};

type Category = {
    id: number;
    cname: string;
};

type User = {
    id: number;
    name: string;
    email: string;
};

export interface SingleCrf {
    id: number;
    fname: string;
    email: string;
    nric: string;
    designation: string;
    extno: string;
    issue: string;
    reason: string;
    department_id: number;
    category_id: number;
    user_id: number;
    department?: Department; // ✅ Add this
    category?: Category; // ✅ Add this
    user?: User; // ✅ Add this for the user relationship
    created_at: string;
    updated_at: string;
}

export interface Crf extends Pagination {
    data: SingleCrf[];
}

export interface CrfRole extends SingleCrf {
    roles: SingleRole[];
}
