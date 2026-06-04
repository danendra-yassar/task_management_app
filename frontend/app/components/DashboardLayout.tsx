'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, Menu, X, FileText } from 'lucide-react';
import router from 'next/dist/client/router';
import api from '../utils/api';

export default function DashboardLayout({ children, user, onLogout }: any) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: 'Task List', icon: <LayoutDashboard size={20} />, href: '/', roles: ['1', '2', '3'] },
        { name: 'Users', icon: <Users size={20} />, href: '/users', roles: ['1'] }, // Hanya Admin
        { name: 'Task Assignments', icon: <FileText size={20} />, href: '/assignments', roles: ['1', '2'] },
    ];

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

    const allowedMenuItems = menuItems.filter(item => item.roles.includes(user?.role));
    
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            {/* MOBILE SIDEBAR OVERLAY */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6">
                        <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <LayoutDashboard size={24} />
                            </div>
                            <span>TaskCore APP</span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        {allowedMenuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white uppercase shrink-0">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button 
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
                    <button className="lg:hidden p-2 text-slate-400" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    
                    <div className="hidden lg:block">
                        <span className="text-slate-400 text-sm font-medium">Dashboard / <span className="text-slate-100">{pathname === '/users' ? 'User Management' : 'Task List'}</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs text-slate-500">Server Status</p>
                            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 
                                API Connected
                            </p>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE CONTENT */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}