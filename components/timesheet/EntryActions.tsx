"use client";

import { useEffect, useRef, useState } from "react";
import {
    Ellipsis,
    Pencil,
    Trash2,
} from "lucide-react";

interface EntryActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export default function EntryActions({
    onEdit,
    onDelete,
}: EntryActionsProps) {
    const [open, setOpen] = useState(false);

    const menuRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent
        ) {
            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    function handleEdit() {
        setOpen(false);
        onEdit();
    }

    function handleDelete() {
        setOpen(false);
        onDelete();
    }

    return (
        <div
            ref={menuRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() =>
                    setOpen((value) => !value)
                }
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Entry actions"
            >
                <Ellipsis size={18} />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                        type="button"
                        onClick={handleEdit}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <Pencil size={14} />

                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={14} />

                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}