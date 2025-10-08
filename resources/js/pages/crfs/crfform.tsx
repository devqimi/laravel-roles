import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

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
    nric: string;
    email: string;
    department_id: number | null;
    department_name?: string;
};

type Props = {
    departments: Department[];
    categories: Category[];
    user: User;
};

export default function CrfForm({ user, departments, categories }: Props) {
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        department_id: user?.department_id ?? '',
        // other fields...
    });

    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        nric: user?.nric || '',
        department_id: user?.department_id || '',
        designation: '',
        extno: '',
        category_id: '',
        issue: '',
        reason: '',
        supporting_file: null as File | null,
    });

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            setFilePreview(null);
            setData('supporting_file', null); // ✅ Clear file from form data
            return;
        }

        setData('supporting_file', file);

        const fileType = file.type;
        if (fileType === 'application/pdf') {
            setFilePreview(URL.createObjectURL(file));
        } else if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev: ProgressEvent<FileReader>) =>
                setFilePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreview('unsupported');
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/crfs', {
            forceFormData: true, // ✅ Important for file uploads
        });
    };

    return (
        <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="mx-auto mt-7 w-full max-w-lg rounded bg-white p-6 shadow-md">
                <h1 className="mb-2 text-2xl text-gray-500">
                    Customer Request Form
                </h1>
                <p className="mb-1 text-sm text-red-500">
                    *1 CRF untuk 1 request sahaja. Sila isi CRF lain utk lebih
                    dari 1 request.
                </p>
                <p className="mb-1 text-sm text-red-500">
                    *Setiap CRF akan diproses dalam masa 3 - 5 hari bekerja
                    (Selepas acceptance oleh person incharge).
                </p>
                <p className="mb-4 text-sm text-red-500">
                    *CRF yang melibatkan setup/database akan melibatkan
                    perbincangan antara person incharge dengan pengguna serta
                    akan mengambil masa yang lebih panjang untuk diselesaikan.
                </p>
                <div>
                    <label className="mb-1 block">Name</label>
                    <input
                        className="w-full rounded border border-blue-900 px-2 py-1"
                        type="text"
                        name="name"
                        required
                        value={user?.name || ''}
                        readOnly
                    />
                </div>
                <div>
                    <label className="mb-1 block">NRIC</label>
                    <input
                        className="w-full rounded border border-blue-900 px-2 py-1"
                        type="text"
                        name="nric"
                        required
                        value={user?.nric || ''}
                        readOnly
                    />
                </div>
                <div>
                    <label className="mb-1 block">Department</label>
                    <input
                        name="department_id"
                        className="w-full rounded border border-blue-900 px-2 py-1"
                        required
                        value={
                            departments.find(
                                (d) => d.id === user?.department_id,
                            )?.dname || ''
                        }
                        readOnly
                    />
                </div>
                <div>
                    <label className="mb-1 block">Designation</label>
                    <input
                        className="w-full rounded border border-blue-900 px-2 py-1"
                        type="text"
                        name="designation"
                        value={data.designation}
                        onChange={(e) => setData('designation', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block">Ext & HP No</label>
                    <input
                        className="w-full rounded border border-blue-900 px-2 py-1"
                        type="text"
                        name="extno"
                        value={data.extno}
                        onChange={(e) => setData('extno', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block">Category</label>
                    <select
                        name="category_id"
                        className="w-full rounded border border-blue-900 px-2 py-1"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        required
                    >
                        <option value="">Select</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.cname}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block">
                        Change / Functionality Required
                    </label>
                    <textarea
                        className="w-full rounded border border-blue-900 px-2 py-1"
                        name="issue"
                        value={data.issue}
                        onChange={(e) => setData('issue', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block">
                        Reason to request (Optional)
                    </label>
                    <textarea
                        className="w-full rounded border border-blue-900 px-2 py-1"
                        name="reason"
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mb-1 block">
                        Upload Document (PDF/PNG/JPEG)
                    </label>
                    <input
                        className="mb-2 w-full rounded border border-blue-900 px-2 py-1"
                        type="file"
                        name="supporting_file"
                        accept=".pdf, image/png, image/jpeg"
                        onChange={handleFileChange}
                    />
                    {filePreview && (
                        <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-600">
                                Preview:
                            </p>
                            {filePreview === 'unsupported' ? (
                                <p className="text-red-500">
                                    Unsupported file type.
                                </p>
                            ) : filePreview.endsWith('.pdf') ? (
                                <iframe
                                    src={filePreview}
                                    className="h-32 w-full"
                                    frameBorder={0}
                                ></iframe>
                            ) : (
                                <img
                                    src={filePreview}
                                    className="max-h-32 rounded border"
                                    alt="Preview"
                                />
                            )}
                        </div>
                    )}
                </div>
                <p className="mt-2 text-sm text-red-500">
                    *Please print & sign before sending to IT Department.
                </p>
                <div className="mt-2 flex justify-center space-x-4">
                    <button
                        className="rounded bg-blue-900 px-4 py-2 text-white disabled:opacity-50"
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? 'Submitting...' : 'Submit and Print'}
                    </button>
                    <button
                        className="rounded bg-blue-900 px-4 py-2 text-white"
                        type="reset"
                        onClick={() => {
                            setData({
                                name: user?.name || '',
                                nric: user?.nric || '',
                                department_id: user?.department_id || '',
                                designation: '',
                                extno: '',
                                category_id: '',
                                issue: '',
                                reason: '',
                                supporting_file: null,
                            });
                            setFilePreview(null);
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </form>
    );
}
