'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            
            // Simpan token dan data user ke localStorage
            localStorage.setItem('auth_token', response.data.access_token);
            localStorage.setItem('user_data', JSON.stringify(response.data.user));

            // Redirect langsung ke dashboard utama setelah sukses
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
                        Task Management API
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        Sign in to manage your tasks and projects
                    </p>
                </div>
                
                {error && (
                    <div className="rounded-md bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400 text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="your_mail@example.com"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-indigo-600 p-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-800"
                        >
                            {loading ? 'Please wait, logging in....' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}