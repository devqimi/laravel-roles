import { Pagination } from './pagination';
import { SingleRole } from './roles';

type ApplicationStatus = {
    id: number;
    status: string;
};

// ✅ Define Department and Category types
type Department = {
    id: number;
    dname: string;
};

type Category = {
    id: number;
    cname: string;
};

type Factor = {
    id: number;
    name: string;
}

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
    factor_id: number;
    user_id: number;
    department?: Department;
    category?: Category;
    factor?: Factor;
    user?: User;
    application_status_id: number;
    application_status?: ApplicationStatus;
    approved_by: number | null;
    approver?: User;
    assigned_to: number | null;
    it_remark?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Crf extends Pagination {
    data: SingleCrf[];
}

export interface CrfRole extends SingleCrf {
    roles: SingleRole[];
}
