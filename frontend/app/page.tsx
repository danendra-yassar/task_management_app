'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from './utils/api';
import DashboardLayout from './components/DashboardLayout';
import { PlusCircle, X, Calendar, Paperclip, Download, Trash2, UploadCloud, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // State Filter, Search, Pagination
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // State Modal Detail Tugas & Attachment
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [finishLoading, setFinishLoading] = useState(false); 

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks', {
                params: {
                    search: search || undefined,
                    status: status || undefined,
                    priority: priority || undefined,
                    page: page,
                    per_page: 6
                }
            });
            setTasks(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) { router.push('/login'); return; }
        api.get('/auth/me').then((res) => setUser(res.data)).catch(() => { localStorage.clear(); router.push('/login'); });
    }, [router]);

    useEffect(() => { if (user) fetchTasks(); }, [search, status, priority, page, user]);

    // Mengubah status individu menjadi 'in_progress' di tabel pivot saat detail dibuka
    const handleOpenDetail = async (task: any) => {
        try {
            // Ambil data fresh dari server
            const response = await api.get(`/tasks/${task.id}`);
            const freshTask = response.data.task;
            setSelectedTask(freshTask);

            // Jika yang membuka adalah user biasa (role 3), jalankan trigger progress
            if (user?.role === '3') {
                const currentUserPivot = freshTask.assigned_users?.find((u: any) => u.id === user.id);
                // Hanya ubah jika status pivotnya masih null/kosong
                if (!currentUserPivot || !currentUserPivot.pivot.status) {
                    const res = await api.post(`/tasks/${task.id}/toggle-progress`, { status: 'in_progress' });
                    setSelectedTask(res.data.task);
                    fetchTasks();
                }
            }
        } catch (err) {
            console.error('Gagal memuat detail tugas:', err);
            setSelectedTask(task);
        }
    };

    const handleUploadAttachment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !selectedTask) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post(`/tasks/${selectedTask.id}/attachments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Berkas jawaban sukses diunggah!');
            setSelectedFile(null);
            
            const response = await api.get(`/tasks/${selectedTask.id}`);
            setSelectedTask(response.data.task);
            fetchTasks();
        } catch (err) {
            alert('Gagal mengunggah berkas.');
        } finally {
            setUploading(false);
        }
    };

    // Mengubah status individu menjadi 'completed' di tabel pivot
    const handleFinishTask = async () => {
        if (!selectedTask) return;
        setFinishLoading(true);
        try {
            const res = await api.post(`/tasks/${selectedTask.id}/toggle-progress`, { status: 'completed' });
            alert('Sukses mengakhiri penugasan! Status Anda kini "Completed".');
            setSelectedTask(res.data.task); 
            fetchTasks(); 
        } catch (err) {
            alert('Gagal menyelesaikan tugas.');
        } finally {
            setFinishLoading(false);
        }
    };

    const handleDownloadFile = async (attachmentId: number, fileName: string) => {
        try {
            const response = await api.get(`/attachments/${attachmentId}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'download-file');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Gagal mengunduh berkas.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <DashboardLayout user={user} onLogout={handleLogout}>
            <div className="space-y-6">
                
                {/* Header Utama */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Dashboard Task Summary</h2>
                        <p className="text-slate-400 text-sm">Track instructions and the progress of the integrated document collection process.</p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Search Tasks</label>
                        <input type="text" placeholder="Type title..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Filter Priority</label>
                        <select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {/* GRID CARDS UTAMA */}
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Load information board data...</div>
                ) : tasks.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-xl text-center text-slate-400">No tasks found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task: any) => {
                            // Mencari baris data pivot khusus milik user yang sedang login saat ini
                            const myPivot = task.assigned_users?.find((u: any) => u.id === user?.id)?.pivot;
                            const myStatus = myPivot?.status; // Terbaca: null, 'in_progress', atau 'completed'

                            return (
                                <div key={task.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg relative overflow-hidden">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                                {task.priority}
                                            </span>

                                            {/* RENDER KONDISI STATUS BERDASARKAN ROLE */}
                                            {user?.role === '3' ? (
                                                /* TAMPILAN UNTUK ROLE USER (Membaca kolom pivot task_user) */
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                                    myStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    myStatus === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    {myStatus === 'completed' ? '✓ Completed' : myStatus === 'in_progress' ? '⚡ In Progress' : '⏰ Not Started'}
                                                </span>
                                            ) : (
                                                /* TAMPILAN UNTUK ROLE ADMIN & INSTRUCTOR (Bebas dari penanda status global) */
                                                <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">
                                                    Active Assignment
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-md font-bold line-clamp-1 text-slate-100">{task.title}</h3>
                                        <p className="text-sm text-slate-400 line-clamp-3">{task.description || 'Tidak ada deskripsi.'}</p>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Calendar size={14}/> {task.due_date || '-'}</span>
                                        <button onClick={() => handleOpenDetail(task)} className="text-indigo-400 hover:text-indigo-300 font-medium transition">
                                            Task Details →
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* MODAL DETAIL TUGAS */}
                {selectedTask && (() => {
                    const assignedUsersList = selectedTask.assigned_users || [];
                    const attachmentsList = selectedTask.attachments || [];

                    // Mengidentifikasi berkas milik akun login ini saja (Khusus role 3)
                    const myUploadedFile = attachmentsList.find((att: any) => String(att.user_id) === String(user?.id));
                    
                    // Filter untuk tracking monitor (Admin/Instructor)
                    const usersWhoUploaded = new Set(attachmentsList.map((att: any) => String(att.user_id)));
                    const isAllCollected = assignedUsersList.length > 0 && assignedUsersList.every((u: any) => usersWhoUploaded.has(String(u.id)));

                    // Ambil status pivot milik user login saat ini
                    const myCurrentPivotStatus = assignedUsersList.find((u: any) => u.id === user?.id)?.pivot?.status;

                    return (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                                
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Job Details Sheet</span>
                                    <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">{selectedTask.title}</h3>
                                    <p className="text-sm text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">{selectedTask.description || 'Tidak ada deskripsi rinci.'}</p>
                                </div>

                                {/* RENDER KONDISI KONTEN MODAL BERDASARKAN ROLE */}
                                {user?.role === '3' ? (
                                    /* TAMPILAN KONTEN MODAL KHUSUS USER BIASA (Upload & Preview Berkas Milik Sendiri) */
                                    <div className="border-t border-slate-800 pt-4 space-y-4">
                                        <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2"><Paperclip size={16}/> Your Answer Files</h4>
                                        {myUploadedFile ? (
                                            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm">
                                                <span className="truncate text-slate-300 font-medium">{myUploadedFile.file_name}</span>
                                                <button onClick={() => handleDownloadFile(myUploadedFile.id, myUploadedFile.file_name)} className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 shrink-0 ml-4">
                                                    <Download size={14}/> Download File
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleUploadAttachment} className="flex flex-col sm:flex-row gap-3 items-center">
                                                <input type="file" id="file-upload" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
                                                <label htmlFor="file-upload" className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 p-3 rounded-xl cursor-pointer text-sm text-slate-400 transition">
                                                    <UploadCloud size={18} className="text-indigo-400"/>
                                                    {selectedFile ? <span className="text-slate-200 font-medium truncate">{selectedFile.name}</span> : 'Pilih Berkas Tugas'}
                                                </label>
                                                <button type="submit" disabled={!selectedFile || uploading} className="w-full sm:w-fit bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-40">
                                                    {uploading ? 'Mengunggah...' : 'Unggah'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                ) : (
                                    /* TAMPILAN KONTEN MODAL KHUSUS ADMIN / INSTRUCTOR (Monitoring Seluruh Peserta) */
                                    <div className="border-t border-slate-800 pt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-slate-300">List of Task Recipients ({usersWhoUploaded.size}/{assignedUsersList.length})</h4>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isAllCollected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                {isAllCollected ? 'COMPLETE' : 'INCOMPLETE'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                                            {assignedUsersList.map((u: any) => {
                                                const uFile = attachmentsList.find((att: any) => String(att.user_id) === String(u.id));
                                                return (
                                                    <div key={u.id} className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-sm">
                                                        <div>
                                                            <p className="font-semibold text-slate-200">{u.name}</p>
                                                            <p className="text-xs text-slate-500">Status: <span className="capitalize text-slate-400">{u.pivot?.status?.replace('_', ' ') || 'Not Started'}</span></p>
                                                        </div>
                                                        {uFile && (
                                                            <button onClick={() => handleDownloadFile(uFile.id, uFile.file_name)} className="text-indigo-400 hover:text-indigo-300"><Download size={16}/></button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* FOOTER ACTIONS */}
                                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-800 gap-3">
                                    
                                    {/* LOGIKA SUBMIT TOMBOL SESUAI ROLE */}
                                    {user?.role === '3' ? (
                                        /* Logika tombol selesai untuk User biasa */
                                        myCurrentPivotStatus === 'completed' ? (
                                            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 order-2 sm:order-1">
                                                <CheckCircle size={14} /> Task Already Completed
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={handleFinishTask}
                                                disabled={!myUploadedFile || finishLoading}
                                                className="w-full sm:w-fit px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 order-2 sm:order-1 disabled:bg-slate-800 disabled:opacity-40"
                                            >
                                                <CheckCircle size={16} /> Finish Task
                                            </button>
                                        )
                                    ) : (
                                        /* Logika tombol selesai untuk Admin/Instructor monitoring */
                                        <div className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg font-mono order-2 sm:order-1">
                                            Mode: Instructor Task Monitoring
                                        </div>
                                    )}

                                    <button onClick={() => setSelectedTask(null)} className="w-full sm:w-fit px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition order-1 sm:order-2">Close Detail</button>
                                </div>

                            </div>
                        </div>
                    );
                })()}

            </div>
        </DashboardLayout>
    );
}