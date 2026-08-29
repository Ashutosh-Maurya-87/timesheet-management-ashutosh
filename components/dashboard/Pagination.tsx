"use client";

interface PaginationProps {
    page: number;
    total: number;
    pageSize: number;

    onPageChange: (page: number) => void;
}

export default function Pagination({
    page,
    total,
    pageSize,
    onPageChange,
}: PaginationProps) {
    const totalPages =
        Math.ceil(total / pageSize);

    if (totalPages <= 1) {
        return null;
    }

    function getPageNumbers() {
        if (totalPages <= 7) {
            return Array.from(
                {
                    length: totalPages,
                },
                (_, index) => index + 1
            );
        }

        const pages: Array<number | "ellipsis"> = [1];

        if (page > 3) {
            pages.push("ellipsis");
        }

        const start = Math.max(2, page - 1);

        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) {
            pages.push("ellipsis");
        }

        pages.push(totalPages);

        return pages;
    }

    return (
        <div className="mt-4 flex flex-wrap items-center justify-end gap-1">
            <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                    onPageChange(page - 1)
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Previous
            </button>

            {getPageNumbers().map(
                (item, index) => {
                    if (item === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-sm text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() =>
                                onPageChange(item)
                            }
                            className={`h-9 min-w-9 rounded-md border px-3 text-xs transition ${page === item
                                ? "border-[#315dbc] bg-[#315dbc] text-white"
                                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {item}
                        </button>
                    );
                }
            )}

            <button
                type="button"
                disabled={
                    page === totalPages
                }
                onClick={() =>
                    onPageChange(page + 1)
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}