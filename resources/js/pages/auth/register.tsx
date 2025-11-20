import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useMemo } from 'react';

type Department = {
    id: number;
    dname: string;
};

type Role = {
    id: number;
    name: string;
};

type RegisterProps = {
    departments: Department[];
    roles: Role[];
};

export default function Register({ departments, roles }: RegisterProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        nric: '',
        email: '',
        password: '',
        password_confirmation: '',
        department_id: '',
        role: '',
        phone: '',
    });

    // Check if selected department is "Unit Teknologi Maklumat"
    const selectedDepartment = useMemo(() => {
        return departments.find(
            (d) => d.id === parseInt(data.department_id)
        );
    }, [data.department_id, departments]);

    const isITDepartment = selectedDepartment?.dname === 'Unit Teknologi Maklumat';

    // Filter roles based on department
    const availableRoles = useMemo(() => {
        if (isITDepartment) {
            // IT Department can select any role
            return roles;
        } else {
            // Other departments can only be USER or HOU
            return roles.filter((r) => r.name === 'USER' || r.name === 'HOU');
        }
    }, [isITDepartment, roles]);

    // Auto-set role to USER when non-IT department is selected
    const handleDepartmentChange = (departmentId: string) => {
        setData('department_id', departmentId);
        
        const dept = departments.find((d) => d.id === parseInt(departmentId));
        
        // If not IT department, automatically set role to USER
        if (dept && dept.dname !== 'Unit Teknologi Maklumat') {
            setData('role', 'USER');
        } else {
            // Clear role selection when switching to IT department
            setData('role', '');
        }
    };

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/register', {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="nric">NRIC</Label>
                    <Input
                        id="nric"
                        name="nric"
                        value={data.nric}
                        onChange={(e) => setData('nric', e.target.value)}
                        required
                    />
                    <InputError message={errors.nric} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">
                        Confirm Password
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="department_id">Department</Label>
                    <select
                        id="department_id"
                        className="rounded border px-2 py-1"
                        value={data.department_id}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        required
                    >
                        <option value="">Select department</option>
                        {departments.map((d) => (
                            <option
                                key={d.id}
                                value={d.id}
                                className="text-black">
                                {d.dname}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.department_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    {isITDepartment ? (
                        <select
                            id="role"
                            className="rounded border px-2 py-1"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="">Select role</option>
                            {availableRoles.map((r) => (
                                <option key={r.id} value={r.name}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="USER"
                                    checked={data.role === 'USER'}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="h-4 w-4"
                                    required
                                />
                                <span>USER</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="HOU"
                                    checked={data.role === 'HOU'}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="h-4 w-4"
                                    required
                                />
                                <span>HOU</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="TIMBALAN PENGARAH"
                                    checked={data.role === 'TIMBALAN PENGARAH'}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="h-4 w-4"
                                    required
                                />
                                <span>Timbalan Pengarah</span>
                            </label>
                        </div>
                    )}

                    <InputError message={errors.role} />
                    {!isITDepartment && (
                        <p className="text-xs text-gray-500">
                            Non-IT departments can only be assigned USER or HOU roles
                        </p>
                    )}

                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="mt-2 w-full"
                >
                    {processing && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create account
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href="/login" tabIndex={7}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}