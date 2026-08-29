"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
}

export default function Modal({
    open,
    title,
    children,
    onClose,
}: ModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-125 rounded-lg bg-white shadow-xl"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h2 className="text-sm font-semibold text-gray-800">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}