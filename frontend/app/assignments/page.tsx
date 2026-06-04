'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import { PlusCircle, X, Calendar, Paperclip, Download, Trash2, UploadCloud, CheckCircle } from 'lucide-react';


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

    // State Modal Tambah Tugas
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPriority, setNewPriority] = useState('medium');
    const [newDueDate, setNewDueDate] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    // State Modal Detail Tugas & Attachment
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [finishLoading, setFinishLoading] = useState(false); // State loading untuk tombol Finish Task

    // State untuk manajemen user/siswa
    const [availableUsers, setAvailableUsers] = useState<any[]>([]); // Untuk menampung list siswa/user biasa
    const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]); // Menyimpan ID user yang dipilih

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

    useEffect(() => { fetchTasks(); }, [search, status, priority, page]);

    useEffect(() => {
        // inactivity timeout setup (15 minutes = 900.000 ms)
        const INACTIVITY_LIMIT = 15 * 60 * 1000; 
        let timeoutId: NodeJS.Timeout;

        // reset timer once user performs any activity
        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                alert('Sesi Anda telah berakhir karena tidak ada aktivitas.');
                handleLogout(); // call logout function to clear session and redirect
            }, INACTIVITY_LIMIT);
        };

        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        // cleanup event listeners on component unmount
        return () => {
            clearTimeout(timeoutId);
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    // useEffect(() => {
    // if (user?.role === '1' || user?.role === '2') {
    //     api.get('/users').then((res) => {
    //         // Hanya ambil user biasa (role 3) untuk dijadikan kandidat penerima tugas
    //         const fields = res.data.filter((u: any) => u.role === '3');
    //         setAvailableUsers(fields);
    //     });
    // }
    // }, [user]);

    useEffect(() => {
        if (user?.role === '1' || user?.role === '2') {
            api.get('/users').then((res) => {
                // [PERBAIKAN]: Ambil array dari res.data.data jika backend menggunakan pagination
                // Gunakan fallback res.data jika suatu saat backend dikembalikan ke non-pagination
                const userArray = res.data.data || res.data;

                if (Array.isArray(userArray)) {
                    // Hanya ambil user biasa (role 3) untuk dijadikan kandidat penerima tugas
                    const fields = userArray.filter((u: any) => String(u.role) === '3');
                    setAvailableUsers(fields);
                } else {
                    console.error("Format data yang diterima bukan berbentuk array:", res.data);
                }
            }).catch((err) => {
                console.error("Gagal memuat daftar user kandidat:", err);
            });
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.clear();
            router.push('/login');
        }
    };

    // Fungsi Tambah Tugas Baru (Status Otomatis 'pending')
    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await api.post('/tasks', {
                title: newTitle,
                description: newDesc,
                status: 'pending',
                priority: newPriority,
                due_date: newDueDate || undefined,
                assigned_user_ids: assignedUserIds
            });
            setNewTitle('');
            setNewDesc('');
            setNewDueDate('');
            setAssignedUserIds([]);
            setIsModalOpen(false);
            fetchTasks();
        } catch (err) {
            alert('Gagal membuat tugas baru');
        } finally {
            setSubmitLoading(false);
        }
    };

    // 1. Perbarui Fungsi handleOpenDetail agar menembak detail spesifik
    const handleOpenDetail = async (task: any) => {
        try {
            const response = await api.get(`/tasks/${task.id}`);
            const freshTask = response.data.task; 
            setSelectedTask(freshTask);
        } catch (err) {
            console.error(err);
            setSelectedTask(task);
        }
    };

    // 2. Perbarui Fungsi handleUploadAttachment pada bagian pemanggilan setelah sukses
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
            alert('Berkas sukses dilampirkan!');
            setSelectedFile(null);
            
            // [PERBAIKAN UTAMA DI SINI]: Panggil endpoint show spesifik untuk refresh modal detail
            const response = await api.get(`/tasks/${selectedTask.id}`);
            const freshTaskData = response.data.task || response.data;
            
            setSelectedTask(freshTaskData); // State data assignedUsers & attachments dijamin utuh 100%
            fetchTasks(); // Refresh grid dashboard belakang
        } catch (err) {
            alert('Gagal mengunggah berkas. Pastikan ukuran < 20MB dan format sesuai.');
        } finally {
            setUploading(false);
        }
    };

    // finish task
    const handleFinishTask = async () => {
        if (!selectedTask) return;
        setFinishLoading(true);
        try {
            const res = await api.put(`/tasks/${selectedTask.id}`, { status: 'completed' });
            alert('Selamat! Tugas telah diselesaikan.');
            setSelectedTask(null); // close modal
            fetchTasks(); // Refresh list task
        } catch (err) {
            alert('Gagal memperbarui status tugas menjadi selesai.');
            console.error(err);
        } finally {
            setFinishLoading(false);
        }
    };

    const handleDownloadFile = async (attachmentId: number, fileName: string) => {
        try {
            // Request ke backend dengan responseType blob agar file terbaca sebagai binary data
            const response = await api.get(`/attachments/${attachmentId}/download`, {
                responseType: 'blob', 
            });

            // Membuat tiruan link unduhan di memori browser
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Menentukan nama file saat diunduh
            link.setAttribute('download', fileName || 'download-file'); 
            
            document.body.appendChild(link);
            link.click();
            
            // Bersihkan memori link setelah sukses memicu download otomatis
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Gagal mengunduh berkas. Anda mungkin tidak memiliki akses.');
            console.error(err);
        }
    };

    // [BARU] Cek ketersediaan file lampiran (baik dari backend maupun yang sedang dipilih)
    const hasAttachments = (selectedTask?.attachments && selectedTask.attachments.length > 0);

    return (
        <DashboardLayout user={user} onLogout={handleLogout}>
            <div className="space-y-6">
                {/* Header & Tombol Tambah Tugas */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Task List Management</h2>
                        <p className="text-slate-400 text-sm">Manage and track your users' task progress here.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 w-fit shadow-lg shadow-indigo-600/20"
                    >
                        <PlusCircle size={18} />
                        Add New Task
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Search Tasks</label>
                        <input type="text" placeholder="Type title..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Filter Status</label>
                        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Filter Priorities</label>
                        <select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {/* Task Grid Cards */}
                {tasks.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-xl text-center text-slate-400">No tasks found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task: any) => (
                            <div key={task.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                            {task.priority}
                                        </span>
                                        {/* <span className={`text-xs font-medium px-2 py-0.5 rounded ${task.status === 'completed' ? 'bg-emerald-600' : task.status === 'in_progress' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                            {task.status.replace('_', ' ')}
                                        </span> */}
                                    </div>
                                    <h3 className="text-md font-bold line-clamp-1 text-slate-100">{task.title}</h3>
                                    <p className="text-sm text-slate-400 line-clamp-3">{task.description || 'No description available.'}</p>
                                </div>
                                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Calendar size={14}/> {task.due_date || '-'}</span>
                                    <button onClick={() => handleOpenDetail(task)} className="text-indigo-400 hover:text-indigo-300 font-medium transition">Detail & Files →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* MODAL 1: FORM TAMBAH TUGAS */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="text-xl font-bold text-white">Add New Task</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Task Title</label>
                                    <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Example: Implement Websocket" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                                    <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Write task details..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Assign Task To (Select User):</label>
                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                                        {availableUsers.map((u) => (
                                            <label key={u.id} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:text-white transition">
                                                <input 
                                                    type="checkbox"
                                                    value={u.id}
                                                    checked={assignedUserIds.includes(u.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setAssignedUserIds([...assignedUserIds, u.id]);
                                                        } else {
                                                            setAssignedUserIds(assignedUserIds.filter(id => id !== u.id));
                                                        }
                                                    }}
                                                    className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                />
                                                <span>{u.name} <span className="text-xs text-slate-500">({u.email})</span></span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Priority</label>
                                        <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Due Date</label>
                                        <input 
                                            type="date" 
                                            value={newDueDate} 
                                            onChange={(e) => setNewDueDate(e.target.value)} 
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-300 scheme-dark"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold">Cancel</button>
                                    <button type="submit" disabled={submitLoading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold text-white transition">{submitLoading ? 'Saving...' : 'Save Task'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


                {/* MODAL 2: DETAIL TUGAS & MONITORING PENGUMPULAN MULTI-USER */}
                {selectedTask && (() => {
                    const assignedUsersList = selectedTask.assigned_users || [];
    
                    const attachmentsList = selectedTask.attachments || [];

                    // Mengumpulkan user_id unik yang sudah sukses upload berkas ke dalam Set
                    const usersWhoUploaded = new Set(attachmentsList.map((att: any) => String(att.user_id)));
                    
                    // Mengecek apakah SEMUA peserta di list sudah upload berkasnya masing-masing
                    const isAllCollected = assignedUsersList.length > 0 && assignedUsersList.every((u: any) => usersWhoUploaded.has(String(u.id)));
                    
                    return (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                                
                                {/* Header Modal */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Detail Information & User Progress</span>
                                    <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                                </div>

                                {/* Konten Informasi Utama Tugas */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                                            selectedTask.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                            selectedTask.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                                            'bg-green-500/10 text-green-400 border border-green-500/20'
                                        }`}>
                                            {selectedTask.priority}
                                        </span>
                                        {/* <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${
                                            selectedTask.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                                        }`}>
                                            {selectedTask.status.replace('_', ' ')}
                                        </span> */}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{selectedTask.title}</h3>
                                    <p className="text-sm text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">
                                        {selectedTask.description || 'Tidak ada deskripsi rinci.'}
                                    </p>
                                </div>

                                {/* MONITOR LIST USER PENERIMA (Bisa digeser naik turun / Scrollable) */}
                                <div className="border-t border-slate-800 pt-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-slate-300">
                                            List of Task User Recipients ({usersWhoUploaded.size}/{assignedUsersList.length} User)
                                        </h4>
                                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                            isAllCollected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {isAllCollected ? 'ALL FILES COLLECTED' : 'PENDING COLLECTION'}
                                        </span>
                                    </div>

                                    {/* Pembungkus List Peserta dengan Fitur Scrollable (max-h-60 overflow-y-auto) */}
                                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1 scrollstring-thin">
                                        {assignedUsersList.length === 0 ? (
                                            <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-950 rounded-xl">Tidak ada peserta yang didaftarkan pada tugas ini.</p>
                                        ) : (
                                            assignedUsersList.map((u: any) => {
                                                // Mencari berkas milik user_id ini di dalam list attachments tugas terkait
                                                const userFile = attachmentsList.find((att: any) => String(att.user_id) === String(u.id));
                                                
                                                return (
                                                    <div key={u.id} className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-sm gap-4">
                                                        <div className="truncate">
                                                            <p className="font-semibold text-slate-200 truncate">{u.name}</p>
                                                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                                        </div>
                                                        
                                                        <div className="shrink-0">
                                                            {userFile ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                                                        File Submitted
                                                                    </span>
                                                                    <button 
                                                                        onClick={() => handleDownloadFile(userFile.id, userFile.file_name)}
                                                                        className="text-indigo-400 hover:text-indigo-300 p-1 rounded hover:bg-indigo-500/10 transition"
                                                                        title={`Download file from ${u.name}`}
                                                                    >
                                                                        <Download size={14}/>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                                                                    Not Submitted
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* FORM UPLOAD MANDIRI (Hanya muncul jika yang sedang login adalah User Biasa / Role '3') */}
                                {user?.role === '3' && (
                                    <div className="border-t border-slate-800 pt-4 space-y-3">
                                        <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2"><Paperclip size={16}/> Submit Your Task Answer</h4>
                                        <form onSubmit={handleUploadAttachment} className="flex flex-col sm:flex-row gap-3 items-center">
                                            <input type="file" id="file-upload" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
                                            <label htmlFor="file-upload" className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 p-3 rounded-xl cursor-pointer text-sm text-slate-400 transition">
                                                <UploadCloud size={18} className="text-indigo-400"/>
                                                {selectedFile ? <span className="text-slate-200 font-medium truncate">{selectedFile.name}</span> : 'Select Answer File'}
                                            </label>
                                            <button type="submit" disabled={!selectedFile || uploading} className="w-full sm:w-fit bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-40 shrink-0">
                                                {uploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* FOOTER MODAL / AKSI AKHIR */}
                                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-800 gap-3">
                                    
                                    {/* Mengikuti Logika Validasi Pengumpulan Total Sesuai Keinginan Anda */}
                                    {isAllCollected ? (
                                        /* Jika ke-8 orang (semuanya) sudah upload berkas, tombol Finish Task terbuka untuk Admin/Instructor */
                                        ['1', '2'].includes(user?.role) ? (
                                            <button 
                                                onClick={handleFinishTask}
                                                disabled={finishLoading}
                                                className="w-full sm:w-fit px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 order-2 sm:order-1 shadow-lg shadow-emerald-600/20"
                                            >
                                                <CheckCircle size={16} />
                                                {finishLoading ? 'Processing...' : 'Finish Task'}
                                            </button>
                                        ) : (
                                            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 order-2 sm:order-1">
                                                <CheckCircle size={14} /> All Participants Have Submitted Their Tasks
                                            </div>
                                        )
                                    ) : (
                                        /* Jika ada minimal 1 orang belum upload, tampilkan pesan menunggu */
                                        <div className="w-full sm:w-fit text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 order-2 sm:order-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                            Status: Pending File Collection
                                        </div>
                                    )}

                                    <button onClick={() => setSelectedTask(null)} className="w-full sm:w-fit px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition order-1 sm:order-2">
                                        Close Details
                                    </button>
                                </div>

                            </div>
                        </div>
                    );
                })()}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button disabled={page === 1} onClick={() => setPage(prev => Math.max(prev - 1, 1))} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm disabled:opacity-40">← Previous</button>
                        <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm disabled:opacity-40">Next →</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}