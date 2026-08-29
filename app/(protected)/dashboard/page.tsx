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

function getTodayDate(): string {
    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
    /**
     * =====================================================
     * API DATA
     * =====================================================
     */

    const [
        timesheets,
        setTimesheets,
    ] = useState<
        TimesheetWeek[]
    >([]);

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
     * PAGINATION
     * =====================================================
     */

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        pageSize,
        setPageSize,
    ] = useState(5);

    /**
     * =====================================================
     * FILTERS
     * =====================================================
     */

    const [
        status,
        setStatus,
    ] = useState("ALL");

    const today =
        getTodayDate();

    const [
        startDate,
        setStartDate,
    ] = useState(today);

    const [
        endDate,
        setEndDate,
    ] = useState(today);

    /**
     * =====================================================
     * LOAD TIMESHEETS
     * =====================================================
     */

    const loadTimesheets =
        useCallback(
            async () => {
                /**
                 * -----------------------------------------
                 * Invalid date range protection
                 * -----------------------------------------
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
                    setLoading(true);

                    setError("");

                    /**
                     * -------------------------------------
                     * API REQUEST
                     * -------------------------------------
                     */

                    const result =
                        await getTimesheets(
                            page,
                            pageSize,
                            status,
                            startDate,
                            endDate
                        );

                    /**
                     * -------------------------------------
                     * Keep loader visible for 2 seconds
                     * -------------------------------------
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

                    /**
                     * -------------------------------------
                     * UPDATE DATA
                     * -------------------------------------
                     */

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
                     * -------------------------------------
                     * Keep loader visible for 2 seconds
                     * even when API fails.
                     * -------------------------------------
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
     * FETCH WHEN FILTER / PAGINATION CHANGES
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

        /**
         * Always return to first page
         * when changing filters.
         */
        setPage(1);
    }

    /**
     * =====================================================
     * START DATE CHANGE
     * =====================================================
     */

    function handleStartDateChange(
        value: string
    ) {
        setStartDate(
            value
        );

        /**
         * Filter changes should
         * always start from page 1.
         */
        setPage(1);

        /**
         * If selected start date is
         * after the current end date,
         * move the end date forward.
         *
         * Example:
         *
         * Start = Jan 20
         * End   = Jan 10
         *
         * becomes:
         *
         * Start = Jan 20
         * End   = Jan 20
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
         * Do not allow an end date
         * before the start date.
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

        setPage(1);
    }

    /**
     * =====================================================
     * CLEAR FILTERS
     * =====================================================
     */

    function handleClearFilters() {
        const currentDate =
            getTodayDate();

        setStatus(
            "ALL"
        );

        setStartDate(
            currentDate
        );

        setEndDate(
            currentDate
        );

        setPage(1);
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
                        status={status}
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

                                {/* =========================================
                                    BOTTOM CONTROLS
                                ========================================= */}

                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    {/* PAGE SIZE */}

                                    <select
                                        value={
                                            pageSize
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            setPageSize(
                                                Number(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            );

                                            setPage(
                                                1
                                            );
                                        }}
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
                                            setPage
                                        }
                                    />

                                </div>
                            </>
                        )}

                </div>

                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <footer className="mt-4 rounded-lg border border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
                    © 2026 Ashutosh Maurya. All rights reserved.
                </footer>

            </section>

        </main>
    );
}