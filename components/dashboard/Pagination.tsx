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
    /**
     * =====================================================
     * CALCULATE TOTAL PAGES
     * =====================================================
     */

    const totalPages =
        pageSize > 0
            ? Math.ceil(
                total / pageSize
            )
            : 0;

    /**
     * Nothing to paginate.
     */
    if (
        totalPages <= 1
    ) {
        return null;
    }

    /**
     * =====================================================
     * CHANGE PAGE SAFELY
     * =====================================================
     *
     * This prevents the parent from receiving:
     *
     * 0
     * negative numbers
     * numbers greater than totalPages
     */

    function handlePageChange(
        newPage: number
    ) {
        const safePage =
            Math.min(
                Math.max(
                    newPage,
                    1
                ),
                totalPages
            );

        if (
            safePage === page
        ) {
            return;
        }

        onPageChange(
            safePage
        );
    }

    /**
     * =====================================================
     * GENERATE PAGE NUMBERS
     * =====================================================
     */

    function getPageNumbers(): Array<
        number | "ellipsis"
    > {
        /**
         * Show every page when
         * there are 7 or fewer.
         */
        if (
            totalPages <= 7
        ) {
            return Array.from(
                {
                    length:
                        totalPages,
                },
                (_, index) =>
                    index + 1
            );
        }

        const pages: Array<
            number | "ellipsis"
        > = [1];

        /**
         * =================================================
         * LEFT ELLIPSIS
         * =================================================
         */

        if (
            page > 3
        ) {
            pages.push(
                "ellipsis"
            );
        }

        /**
         * =================================================
         * MIDDLE PAGES
         * =================================================
         */

        const start =
            Math.max(
                2,
                page - 1
            );

        const end =
            Math.min(
                totalPages - 1,
                page + 1
            );

        for (
            let index = start;
            index <= end;
            index++
        ) {
            pages.push(
                index
            );
        }

        /**
         * =================================================
         * RIGHT ELLIPSIS
         * =================================================
         */

        if (
            page <
            totalPages - 2
        ) {
            pages.push(
                "ellipsis"
            );
        }

        /**
         * Always show the final page.
         */
        pages.push(
            totalPages
        );

        return pages;
    }

    const pageNumbers =
        getPageNumbers();

    return (
        <nav
            aria-label="Timesheet pagination"
            className="mt-4 flex flex-wrap items-center justify-end gap-1"
        >
            {/* =================================================
                PREVIOUS
            ================================================= */}

            <button
                type="button"
                disabled={
                    page <= 1
                }
                onClick={() =>
                    handlePageChange(
                        page - 1
                    )
                }
                aria-label="Go to previous page"
                className="rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Previous
            </button>

            {/* =================================================
                PAGE NUMBERS
            ================================================= */}

            {pageNumbers.map(
                (
                    item,
                    index
                ) => {
                    /**
                     * Ellipsis
                     */
                    if (
                        item ===
                        "ellipsis"
                    ) {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                aria-hidden="true"
                                className="px-2 text-sm text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    /**
                     * Page button
                     */
                    return (
                        <button
                            key={
                                item
                            }
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    item
                                )
                            }
                            aria-label={`Go to page ${item}`}
                            aria-current={
                                page ===
                                    item
                                    ? "page"
                                    : undefined
                            }
                            className={`h-9 min-w-9 rounded-md border px-3 text-xs transition ${page ===
                                    item
                                    ? "border-[#315dbc] bg-[#315dbc] text-white"
                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {
                                item
                            }
                        </button>
                    );
                }
            )}

            {/* =================================================
                NEXT
            ================================================= */}

            <button
                type="button"
                disabled={
                    page >=
                    totalPages
                }
                onClick={() =>
                    handlePageChange(
                        page + 1
                    )
                }
                aria-label="Go to next page"
                className="rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
            </button>
        </nav>
    );
}