'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import { UserPlus, Edit2, Trash2, X, Shield } from 'lucide-react';

export default function UsersManagementPage() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null); 
    
    // [BARU] Tambahan States untuk Kontrol Paginasi
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('staff');
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users', { 
                params: { 
                    page: page,
                    per_page: 8
                } 
            });
            // [PERBAIKAN]: Sesuaikan pembacaan objek response pagination Laravel
            setUsers(res.data.data); 
            setTotalPages(res.data.last_page);
        } catch (err) {
            console.error('Gagal mengambil data user', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) { router.push('/login'); return; }
        
        api.get('/auth/me')
            .then((res) => setCurrentUser(res.data))
            .catch(() => { localStorage.clear(); router.push('/login'); });
    }, [router]);

    // [BARU]: Trigger fetch data ulang setiap kali state nomor halaman berubah
    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleOpenModal = (userToEdit: any = null) => {
        if (userToEdit) {
            setSelectedUser(userToEdit);
            setName(userToEdit.name);
            setEmail(userToEdit.email);
            setRole(userToEdit.role); 
            setPassword('');
        } else {
            setSelectedUser(null);
            setName('');
            setEmail('');
            setPassword('');
            setRole('3'); 
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);

        const payload = { name, email, role, ...(password && { password }) };

        try {
            if (selectedUser) {
                await api.put(`/users/${selectedUser.id}`, payload);
                alert('User & Privilege sukses diperbarui!');
            } else {
                if (!password) return alert('Password wajib diisi untuk user baru');
                await api.post('/users', payload);
                alert('User baru berhasil ditambahkan!');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Terjadi kesalahan sistem.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteUser = async (id: number, name: string) => {
        if (id === currentUser?.id) return alert('Anda tidak bisa menghapus akun Anda sendiri.');
        if (!confirm(`Apakah Anda yakin ingin menghapus user: ${name}?`)) return;

        try {
            await api.delete(`/users/${id}`);
            alert('User berhasil dihapus.');
            fetchUsers();
        } catch (err) {
            alert('Gagal menghapus user.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <DashboardLayout user={currentUser} onLogout={handleLogout}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">User Control Management</h2>
                        <p className="text-slate-400 text-sm">Add a new team member or modify their privilege level (*role*).</p>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                    >
                        <UserPlus size={18} />
                        Add User
                    </button>
                </div>

                {/* TABEL USER */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading user database...</div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No users data found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-sm">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-800/30 transition">
                                            <td className="p-4 font-semibold text-slate-100">{u.name} {u.id === currentUser?.id && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-md font-mono ml-1">You</span>}</td>
                                            <td className="p-4 text-slate-400">{u.email}</td>
                                            <td className="p-4">
                                                {(() => {
                                                    const roleStyles: Record<string, string> = {
                                                        '1': 'bg-red-500/10 text-red-400 border-red-500/20',
                                                        '2': 'bg-amber-500/10 text-amber-400 border-amber-500/20', 
                                                        '3': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                                    };

                                                    const roleNames: Record<string, string> = {
                                                        '1': 'Admin',
                                                        '2': 'Instructor',
                                                        '3': 'User',
                                                    };

                                                    const currentStyle = roleStyles[u.role] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                                                    const currentName = roleNames[u.role] || 'Unknown';

                                                    return (
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${currentStyle}`}>
                                                            {currentName}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <button 
                                                    onClick={() => handleOpenModal(u)}
                                                    className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                                                    title="Edit User & Privilege"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                                    disabled={u.id === currentUser?.id}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent"
                                                    title="Hapus User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* [BARU]: Kontrol Navigasi Paginasi (Hanya muncul jika total halaman lebih dari 1) */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button 
                            disabled={page === 1} 
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm disabled:opacity-40 transition"
                        >
                            ← Previous
                        </button>
                        <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
                        <button 
                            disabled={page === totalPages} 
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm disabled:opacity-40 transition"
                        >
                            Next →
                        </button>
                    </div>
                )}

                {/* MODAL FORM TAMBAH / EDIT USER */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Shield size={20} className="text-indigo-400"/>
                                    {selectedUser ? 'Edit User Privilege' : 'Add New User'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                                        Password {selectedUser && <span className="text-[10px] text-amber-500 lowercase">(Leave blank to keep current)</span>}
                                    </label>
                                    <input type="password" required={!selectedUser} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Privileges Level (Role)</label>
                                    <select 
                                        value={role} 
                                        onChange={(e) => setRole(e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-300"
                                    >
                                        <option value="3">User</option> 
                                        <option value="2">Instructor</option> 
                                        <option value="1">Admin </option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold">Cancel</button>
                                    <button type="submit" disabled={submitLoading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold text-white transition">
                                        {submitLoading ? 'Saving...' : selectedUser ? 'Save Changes' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}