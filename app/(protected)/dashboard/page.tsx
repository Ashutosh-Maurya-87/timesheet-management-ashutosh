"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getTimesheets,
} from "@/lib/api-client";

import {
    TimesheetWeek,
} from "@/types/timesheet";

import TimesheetFilters from "@/components/dashboard/TimesheetFilters";
import TimesheetTable from "@/components/dashboard/TimesheetTable";
import Pagination from "@/components/dashboard/Pagination";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";

import {
    useDashboardFilters,
} from "@/components/dashboard/DashboardFilterProvider";

export default function DashboardPage() {
    /**
     * =====================================================
     * DASHBOARD FILTER STATE
     * =====================================================
     *
     * This state comes from DashboardFilterProvider.
     *
     * Because the provider is inside:
     *
     * app/dashboard/layout.tsx
     *
     * the filter state remains alive while navigating
     * between dashboard pages.
     */

    const {
        status,
        startDate,
        endDate,
        page,
        pageSize,

        setStatus,
        setStartDate,
        setEndDate,
        setPage,
        setPageSize,
    } = useDashboardFilters();

    /**
     * =====================================================
     * API DATA
     * =====================================================
     */

    const [
        timesheets,
        setTimesheets,
    ] = useState<TimesheetWeek[]>(
        []
    );

    const [
        total,
        setTotal,
    ] = useState(0);

    /**
     * =====================================================
     * LOADING / ERROR
     * =====================================================
     */

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    /**
     * =====================================================
     * LOAD TIMESHEETS
     * =====================================================
     */

    const loadTimesheets =
        useCallback(
            async () => {
                /**
                 * Prevent invalid date range requests.
                 */

                if (
                    startDate &&
                    endDate &&
                    startDate >
                    endDate
                ) {
                    return;
                }

                const loadingStartTime =
                    Date.now();

                try {
                    setLoading(
                        true
                    );

                    setError("");

                    const result =
                        await getTimesheets(
                            page,
                            pageSize,
                            status,
                            startDate,
                            endDate
                        );

                    /**
                     * Keep loader visible
                     * for at least 2 seconds.
                     */

                    const elapsedTime =
                        Date.now() -
                        loadingStartTime;

                    const minimumLoadingTime =
                        2000;

                    const remainingTime =
                        Math.max(
                            minimumLoadingTime -
                            elapsedTime,
                            0
                        );

                    if (
                        remainingTime >
                        0
                    ) {
                        await new Promise(
                            (
                                resolve
                            ) =>
                                setTimeout(
                                    resolve,
                                    remainingTime
                                )
                        );
                    }

                    setTimesheets(
                        result.data
                    );

                    setTotal(
                        result.total
                    );
                } catch (
                requestError
                ) {
                    /**
                     * Keep loader visible
                     * for at least 2 seconds
                     * even when API fails.
                     */

                    const elapsedTime =
                        Date.now() -
                        loadingStartTime;

                    const minimumLoadingTime =
                        2000;

                    const remainingTime =
                        Math.max(
                            minimumLoadingTime -
                            elapsedTime,
                            0
                        );

                    if (
                        remainingTime >
                        0
                    ) {
                        await new Promise(
                            (
                                resolve
                            ) =>
                                setTimeout(
                                    resolve,
                                    remainingTime
                                )
                        );
                    }

                    const message =
                        requestError instanceof
                            Error
                            ? requestError.message
                            : "Failed to load timesheets";

                    setTimesheets(
                        []
                    );

                    setTotal(
                        0
                    );

                    setError(
                        message
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            },
            [
                page,
                pageSize,
                status,
                startDate,
                endDate,
            ]
        );

    /**
     * =====================================================
     * FETCH DATA
     * =====================================================
     */

    useEffect(() => {
        loadTimesheets();
    }, [
        loadTimesheets,
    ]);

    /**
     * =====================================================
     * STATUS CHANGE
     * =====================================================
     */

    function handleStatusChange(
        value: string
    ) {
        setStatus(
            value
        );

        setPage(
            1
        );
    }

    /**
     * =====================================================
     * START DATE CHANGE
     * =====================================================
     */

    function handleStartDateChange(
        value: string
    ) {
        /**
         * If the selected start date is after
         * the existing end date, automatically
         * move the end date to the same date.
         */

        if (
            !endDate ||
            value >
            endDate
        ) {
            setEndDate(
                value
            );
        }

        setStartDate(
            value
        );

        setPage(
            1
        );
    }

    /**
     * =====================================================
     * END DATE CHANGE
     * =====================================================
     */

    function handleEndDateChange(
        value: string
    ) {
        /**
         * Prevent an end date before
         * the start date.
         */

        if (
            startDate &&
            value <
            startDate
        ) {
            setEndDate(
                startDate
            );

            return;
        }

        setEndDate(
            value
        );

        setPage(
            1
        );
    }

    /**
     * =====================================================
     * CLEAR FILTERS
     * =====================================================
     */

    function handleClearFilters() {
        /**
         * We intentionally use the provider's
         * reset behavior by setting today's date.
         *
         * The provider itself owns the filter state.
         */

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );

        const currentDate =
            `${year}-${month}-${day}`;

        setStatus(
            "ALL"
        );

        setStartDate(
            currentDate
        );

        setEndDate(
            currentDate
        );

        setPage(
            1
        );

        setPageSize(
            5
        );
    }

    /**
     * =====================================================
     * PAGE SIZE CHANGE
     * =====================================================
     */

    function handlePageSizeChange(
        value: number
    ) {
        setPageSize(
            value
        );

        setPage(
            1
        );
    }

    /**
     * =====================================================
     * PAGE CHANGE
     * =====================================================
     */

    function handlePageChange(
        nextPage: number
    ) {
        setPage(
            nextPage
        );
    }

    /**
     * =====================================================
     * RENDER
     * =====================================================
     */

    return (
        <main className="min-h-screen bg-[#f7f8fa]">

            <section className="mx-auto max-w-255 px-3 py-5 sm:px-4 sm:py-6">

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        Your Timesheets
                    </h2>

                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <TimesheetFilters
                        status={
                            status
                        }
                        startDate={
                            startDate
                        }
                        endDate={
                            endDate
                        }
                        onStatusChange={
                            handleStatusChange
                        }
                        onStartDateChange={
                            handleStartDateChange
                        }
                        onEndDateChange={
                            handleEndDateChange
                        }
                        onClear={
                            handleClearFilters
                        }
                    />

                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (
                        <Loader />
                    )}

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {!loading &&
                        error && (
                            <div className="flex flex-col items-center justify-center gap-4 py-16">

                                <p className="text-sm text-red-500">
                                    {
                                        error
                                    }
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        loadTimesheets
                                    }
                                    className="rounded-md bg-[#315dbc] px-4 py-2 text-sm text-white transition hover:bg-[#254fa8]"
                                >
                                    Try Again
                                </button>

                            </div>
                        )}

                    {/* =================================================
                        EMPTY STATE
                    ================================================= */}

                    {!loading &&
                        !error &&
                        timesheets.length ===
                        0 && (
                            <EmptyState
                                title="No timesheets found"
                                description={
                                    startDate ||
                                        endDate
                                        ? "No timesheets match the selected date range. Timesheets are recorded week-wise, so please select a date range that overlaps an available timesheet week."
                                        : status !==
                                            "ALL"
                                            ? "No timesheets match the selected status. Try changing the status filter."
                                            : "There are currently no timesheets available."
                                }
                            />
                        )}

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    {!loading &&
                        !error &&
                        timesheets.length >
                        0 && (
                            <>
                                <TimesheetTable
                                    timesheets={
                                        timesheets
                                    }
                                />

                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    {/* PAGE SIZE */}

                                    <select
                                        value={
                                            pageSize
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handlePageSizeChange(
                                                Number(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            )
                                        }
                                        className="h-9 w-fit rounded-md border border-gray-300 bg-white px-3 text-xs text-gray-600 outline-none focus:border-[#315dbc]"
                                    >
                                        <option value={5}>
                                            5 per page
                                        </option>

                                        <option value={10}>
                                            10 per page
                                        </option>

                                        <option value={20}>
                                            20 per page
                                        </option>
                                    </select>

                                    {/* PAGINATION */}

                                    <Pagination
                                        page={
                                            page
                                        }
                                        total={
                                            total
                                        }
                                        pageSize={
                                            pageSize
                                        }
                                        onPageChange={
                                            handlePageChange
                                        }
                                    />

                                </div>
                            </>
                        )}

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="mt-4 rounded-lg border border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
                    © 2026 Ashutosh Maurya. All rights reserved.
                </footer>

            </section>

        </main>
    );
}