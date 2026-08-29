"use client";

import Modal from "@/components/common/Modal";

interface DeleteEntryModalProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteEntryModal({
    open,
    loading,
    onClose,
    onConfirm,
}: DeleteEntryModalProps) {
    async function handleDelete() {
        await onConfirm();
    }

    return (
        <Modal
            open={open}
            title="Delete Entry"
            onClose={onClose}
        >
            <div className="p-5">
                <p className="text-sm leading-6 text-gray-600">
                    Are you sure you want to delete this
                    timesheet entry? This action cannot be undone.
                </p>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 rounded-md bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-md border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}