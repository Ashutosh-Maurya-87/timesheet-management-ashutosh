"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function DashboardHeader() {
    async function handleLogout() {
        await signOut({
            callbackUrl: "/login",
        });
    }

    return (
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
            <div className="flex items-center gap-6 sm:gap-8">
                <h1 className="text-lg font-semibold tracking-wide text-gray-800">
                    ticktock
                </h1>

                <span className="text-sm text-gray-600">
                    Timesheets
                </span>
            </div>

            <div className="flex items-center gap-3">
                <span className="hidden text-sm text-gray-500 sm:inline">
                    Ashutosh Maurya
                </span>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                >
                    <LogOut size={16} />

                    <span className="hidden sm:inline">
                        Logout
                    </span>
                </button>
            </div>
        </header>
    );
}