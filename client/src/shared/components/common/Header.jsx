import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title, onMenuClick }) => {
    const { user } = useAuth();

    // --- Dark Mode Logic ---
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
            
            {/* Left Side: Menu Toggle & Title */}
            <div className="flex items-center gap-4">
                {onMenuClick && (
                    <button 
                        className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={onMenuClick}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">{title}</h1>
            </div>
            
            {/* Right Side: Search, Theme, Notification, Profile */}
            <div className="flex items-center space-x-3 sm:space-x-5">
                
                {/* Toggle Dark Mode */}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notification */}
                <button className="relative p-2.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500"></span>
                </button>
                
                {/* Separator */}
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {user?.username || 'Pengguna'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                            {user?.role || 'Role'}
                        </span>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm group-hover:border-blue-100 dark:group-hover:border-blue-800 transition-all">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;