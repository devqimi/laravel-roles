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

type FilePreview = {
    file: File;
    preview: string | 'unsupported';
};

export default function CrfForm({ user, departments, categories }: Props) {
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
     const [fileErrors, setFileErrors] = useState<string[]>([]);

     const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

     const { data, setData, post, processing,} = useForm({
        name: user?.name || '',
        nric: user?.nric || '',
        department_id: user?.department_id || '',
        designation: '',
        extno: '',
        category_id: '',
        issue: '',
        reason: '',
        supporting_files: [] as File[],
    });

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) {
            return;
        }

            const errors: string[] = [];

        // Process each file and add to previews
        files.forEach((file) => {
            const fileType = file.type;
            const fileName = file.name.toLowerCase();
            let preview: string | 'unsupported';

                // Check file size
                if (file.size > MAX_FILE_SIZE) {
                    errors.push(`${file.name} exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                    return;
                }

            // Check for PDF
            if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
                preview = URL.createObjectURL(file);
                setFilePreviews((prev) => [...prev, { file, preview }]);
            }
            // Check for images (jpg, gif, png)
            else if (fileType.startsWith('image/') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.gif') || fileName.endsWith('.png')) {
                const reader = new FileReader();
                reader.onload = (ev: ProgressEvent<FileReader>) => {
                    const imgPreview = ev.target?.result as string;
                    setFilePreviews((prev) => [...prev, { file, preview: imgPreview }]);
                };
                reader.readAsDataURL(file);
            }
            // For documents (doc, docx, xls, xlsx) - show as unsupported (no preview)
            else if (
                fileName.endsWith('.doc') ||
                fileName.endsWith('.docx') ||
                fileName.endsWith('.xls') ||
                fileName.endsWith('.xlsx') ||
                fileType === 'application/msword' ||
                fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                fileType === 'application/vnd.ms-excel' ||
                fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) {
                preview = 'unsupported';
                setFilePreviews((prev) => [...prev, { file, preview }]);
            } else {
                preview = 'unsupported';
                setFilePreviews((prev) => [...prev, { file, preview }]);
            }
        });

        // Add files to form data
        setData('supporting_files', [...data.supporting_files, ...files]);
        setFileErrors(errors);
    }

    function removeFile(index: number) {
        setFilePreviews((prev) => prev.filter((_, i) => i !== index));
        setData('supporting_files', data.supporting_files.filter((_, i) => i !== index));
           // Clear errors when removing a file
           setFileErrors([]);
    }

    function downloadFile(file: File) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                        Upload Document (JPG/GIF/PDF/DOC/DOCX/XLS/XLSX)
                    </label>
                    <input
                        className="mb-2 w-full rounded border border-blue-900 px-2 py-1"
                        type="file"
                        name="supporting_files"
                        accept=".pdf,.jpg,.jpeg,.gif,.doc,.docx,.xls,.xlsx"
                        multiple
                        onChange={handleFileChange}
                    />
                        {fileErrors.length > 0 && (
                            <div className="mb-3 rounded border border-red-300 bg-red-50 p-3">
                                <p className="mb-1 text-sm font-semibold text-red-700">
                                    File Upload Errors:
                                </p>
                                <ul className="space-y-1">
                                    {fileErrors.map((error, idx) => (
                                        <li key={idx} className="text-xs text-red-600">
                                            • {error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    {filePreviews.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-semibold text-gray-600">
                                Uploaded Files ({filePreviews.length}):
                            </p>
                            <div className="space-y-3">
                                {filePreviews.map((item, index) => (
                                    <div
                                        key={index}
                                        className="rounded border border-gray-300 bg-gray-50 p-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">
                                                {item.file.name}
                                            </span>
                                            <div className="space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        downloadFile(item.file)
                                                    }
                                                    className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                                                >
                                                    Download
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        {item.preview === 'unsupported' ? (
                                            <p className="text-xs text-red-500">
                                                Unsupported file type preview.
                                            </p>
                                        ) : item.file.type ===
                                          'application/pdf' ? (
                                            <iframe
                                                src={item.preview}
                                                className="h-40 w-full rounded border border-gray-200"
                                                frameBorder={0}
                                            ></iframe>
                                        ) : (
                                            <img
                                                src={item.preview}
                                                className="max-h-40 rounded border border-gray-200"
                                                alt={`Preview ${index}`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
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
                                supporting_files: [],
                            });
                            setFilePreviews([]);
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </form>
    );
}
