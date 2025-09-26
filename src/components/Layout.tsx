import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
export function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const shortcuts = [
        {
            key: 'n',
            callback: () => {
                // This is a bit of a hack, but it allows us to trigger the dialog from anywhere.
                // A more robust solution would use a global state manager (like Zustand).
                // For this project's scope, this is sufficient.
                if (location.pathname === '/') {
                    document.getElementById('add-new-bin-button')?.click();
                }
            },
        },
        {
            key: 'f',
            metaKey: true,
            callback: () => {
                if (location.pathname === '/') {
                    document.getElementById('search-bar-input')?.focus();
                }
            },
        },
        {
            key: 'f',
            ctrlKey: true,
            callback: () => {
                if (location.pathname === '/') {
                    document.getElementById('search-bar-input')?.focus();
                }
            },
        },
        {
            key: '/',
            callback: () => {
                if (location.pathname === '/') {
                    document.getElementById('search-bar-input')?.focus();
                }
            }
        }
    ];
    useKeyboardShortcuts(shortcuts);
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <Outlet />
            </main>
            <Toaster richColors position="top-right" />
        </div>
    )
}