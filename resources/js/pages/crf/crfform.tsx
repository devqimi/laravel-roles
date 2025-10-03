import React, { useState, useEffect  } from 'react';

type Department = { id: number; dname: string };

export default function CrfForm() {
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch departments from backend API
    useEffect(() => {
        async function fetchDepartments() {
            try {
                const response = await fetch("/api/departments"); // ✅ adjust endpoint to match your backend
                if (!response.ok) {
                    throw new Error("Failed to fetch departments");
                }
                const data: Department[] = await response.json();
                setDepartments(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchDepartments();
    }, []);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            setFilePreview(null);
            return;
        }
        const fileType = file.type;
        if (fileType === "application/pdf") {
            setFilePreview(URL.createObjectURL(file));
        } else if (fileType.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (ev) => setFilePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreview("unsupported");
        }
    }

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto mt-7">
            <h1 className="text-2xl text-gray-500 mb-2">Customer Request Form</h1>
            <p className="text-red-500 text-sm mb-1">*1 CRF untuk 1 request sahaja. Sila isi CRF lain utk lebih dari 1 request.</p>
            <p className="text-red-500 text-sm mb-1">*Setiap CRF akan diproses dalam masa 3 - 5 hari bekerja (Selepas acceptance oleh person incharge).</p>
            <p className="text-red-500 text-sm mb-4">*CRF yang melibatkan setup/database akan melibatkan perbincangan antara person incharge dengan pengguna serta akan mengambil masa yang lebih panjang untuk diselesaikan.</p>
            <form className="space-y-3">
                <div>
                    <label className="block mb-1">Name</label>
                    <input className="w-full border border-blue-900 rounded px-2 py-1" type="text" name="name" required />
                </div>
                <div>
                    <label className="block mb-1">NRIC</label>
                    <input className="w-full border border-blue-900 rounded px-2 py-1" type="text" name="nric" required />
                </div>
                <div>
                    <label className="block mb-1">Department</label>
                    {loading ? (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500 text-sm">{error}</p>
                    ) : (
                        <select name="department_id" className="w-full border border-blue-900 rounded px-2 py-1" required>
                            <option value="">Select</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.dname}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div>
                    <label className="block mb-1">Designation</label>
                    <input className="w-full border border-blue-900 rounded px-2 py-1" type="text" name="designation" required />
                </div>
                <div>
                    <label className="block mb-1">Ext & HP No</label>
                    <input className="w-full border border-blue-900 rounded px-2 py-1" type="text" name="ext_hp_no" required />
                </div>
                <div>
                    <label className="block mb-1">Category</label>
                    <select className="w-full border border-blue-900 rounded px-2 py-1" name="category_id" required>
                        <option value="">Select</option>
                        {/* Add category options here */}
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Change / Functionality Required</label>
                    <textarea className="w-full border border-blue-900 rounded px-2 py-1" name="change_required" required />
                </div>
                <div>
                    <label className="block mb-1">Reason to request (Optional)</label>
                    <textarea className="w-full border border-blue-900 rounded px-2 py-1" name="reason" />
                </div>
                <div>
                    <label className="block mb-1">Upload Document (PDF/PNG/JPEG)</label>
                    <input
                        className="w-full border border-blue-900 rounded px-2 py-1 mb-2"
                        type="file"
                        name="supporting_file"
                        accept=".pdf, image/png, image/jpeg"
                        onChange={handleFileChange}
                    />
                    {filePreview && (
                        <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-600">Preview:</p>
                            {filePreview === "unsupported" ? (
                                <p className="text-red-500">Unsupported file type.</p>
                            ) : filePreview.endsWith(".pdf") ? (
                                <iframe src={filePreview} className="w-full h-32" frameBorder={0}></iframe>
                            ) : (
                                <img src={filePreview} className="max-h-32 rounded border" alt="Preview" />
                            )}
                        </div>
                    )}
                </div>
                <p className="text-red-500 text-sm mt-2">*Please print & sign before sending to IT Department.</p>
                <div className="flex space-x-4 justify-center mt-2">
                    <button className="bg-blue-900 text-white px-4 py-2 rounded" type="submit">Submit and Print</button>
                    <button className="bg-blue-900 text-white px-4 py-2 rounded" type="reset">Reset</button>
                </div>
            </form>
        </div>
    );
}