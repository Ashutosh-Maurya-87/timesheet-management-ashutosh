"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import {
    getTimesheetById,
} from "@/lib/api-client";

import {
    TimesheetWeek,
} from "@/types/timesheet";

import DayEntries from "./DayEntries";

import Loader from "../common/Loader";

import {
    MAX_WEEKLY_HOURS,
    getTotalHours,
    getRemainingHours,
} from "@/lib/timesheet-utils";

export default function WeeklyTimesheet() {
    const params = useParams();

    const weekId =
        params.weekId as string;

    const [
        timesheet,
        setTimesheet,
    ] = useState<TimesheetWeek | null>(
        null
    );

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /**
     * =====================================================
     * LOAD TIMESHEET
     * =====================================================
     *
     * This function is used:
     *
     * 1. When the page first loads
     * 2. After creating an entry
     * 3. After updating an entry
     * 4. After deleting an entry
     */
    const loadTimesheet =
        useCallback(async () => {
            try {
                setError("");

                const data =
                    await getTimesheetById(
                        weekId
                    );

                setTimesheet(data);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to load timesheet";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, [weekId]);

    /**
     * =====================================================
     * INITIAL LOAD
     * =====================================================
     */
    useEffect(() => {
        setLoading(true);

        loadTimesheet();
    }, [loadTimesheet]);

    /**
     * =====================================================
     * LOADING STATE
     * =====================================================
     */
    if (loading) {
        return <Loader />;
    }

    /**
     * =====================================================
     * ERROR STATE
     * =====================================================
     */
    if (
        error ||
        !timesheet
    ) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <p className="text-sm text-red-500">
                    {error ||
                        "Timesheet not found"}
                </p>

                <button
                    type="button"
                    onClick={() => {
                        setLoading(true);
                        loadTimesheet();
                    }}
                    className="rounded-md bg-[#315dbc] px-4 py-2 text-sm text-white transition hover:bg-[#284fa5]"
                >
                    Try Again
                </button>
            </div>
        );
    }

    /**
     * =====================================================
     * WEEKLY HOURS
     * =====================================================
     *
     * Calculate the total from the actual entries.
     *
     * We do NOT rely on timesheet.status here.
     */
    const totalHours =
        getTotalHours(
            timesheet.entries
        );

    /**
     * =====================================================
     * REMAINING HOURS
     * =====================================================
     *
     * Example:
     *
     * 0  -> 40 remaining
     * 20 -> 20 remaining
     * 35 -> 5 remaining
     * 40 -> 0 remaining
     *
     * If invalid data is already above 40,
     * this function returns 0.
     */
    const remainingHours =
        getRemainingHours(
            timesheet.entries
        );

    /**
     * =====================================================
     * WEEK STATE
     * =====================================================
     */

    const isCompleted =
        totalHours ===
        MAX_WEEKLY_HOURS;

    const isIncomplete =
        totalHours > 0 &&
        totalHours <
        MAX_WEEKLY_HOURS;

    const isMissing =
        totalHours === 0;

    /**
     * Existing database/mock data can potentially
     * contain an invalid total such as 41 or 57.
     *
     * We detect that here.
     *
     * IMPORTANT:
     * We are NOT fixing the source of the invalid
     * data yet. That will be handled later in the
     * DayEntries + API steps.
     */
    const isInvalid =
        totalHours >
        MAX_WEEKLY_HOURS;

    /**
     * =====================================================
     * PROGRESS
     * =====================================================
     *
     * The progress bar must NEVER exceed 100%.
     */
    const percentage =
        Math.min(
            (totalHours /
                MAX_WEEKLY_HOURS) *
            100,
            100
        );

    return (
        <main className="min-h-screen bg-[#f7f8fa]">

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <section className="mx-auto max-w-[900px] px-3 py-6 sm:px-4">

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

                        <div>

                            <Link
                                href="/dashboard"
                                className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#315dbc]"
                            >
                                <ArrowLeft
                                    size={16}
                                />

                                <span>
                                    Back to Timesheets
                                </span>
                            </Link>

                            <h2 className="text-lg font-semibold text-gray-800">
                                This week&apos;s
                                timesheet
                            </h2>

                            <p className="mt-2 text-xs text-gray-500">
                                Week{" "}
                                {
                                    timesheet.weekNumber
                                }

                                {" · "}

                                {formatDateRange(
                                    timesheet.startDate,
                                    timesheet.endDate
                                )}
                            </p>

                        </div>

                        {/* =================================================
                            HOURS PROGRESS
                        ================================================= */}

                        <div className="w-full sm:w-[180px]">

                            <div className="mb-2 flex justify-between text-xs text-gray-500">

                                {/* HOURS */}
                                <div className="text-right">

                                    <div
                                        className={`text-sm ${isInvalid
                                                ? "font-medium text-red-500"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {totalHours}
                                        /
                                        {
                                            MAX_WEEKLY_HOURS
                                        }{" "}
                                        hrs
                                    </div>

                                    {/* STATUS TEXT */}

                                    <div className="text-xs text-gray-400">

                                        {isInvalid ? (
                                            <span className="text-red-500">
                                                Invalid total
                                            </span>
                                        ) : isCompleted ? (
                                            "Completed"
                                        ) : isIncomplete ? (
                                            `${remainingHours} hrs remaining`
                                        ) : isMissing ? (
                                            `${MAX_WEEKLY_HOURS} hrs remaining`
                                        ) : (
                                            `${remainingHours} hrs remaining`
                                        )}

                                    </div>

                                </div>

                                {/* PERCENTAGE */}

                                <span>
                                    {Math.round(
                                        percentage
                                    )}
                                    %
                                </span>

                            </div>

                            {/* PROGRESS BAR */}

                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">

                                <div
                                    className="h-full rounded-full bg-[#ef7f56] transition-all"
                                    style={{
                                        width: `${percentage}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        COMPLETED MESSAGE
                    ================================================= */}

                    {isCompleted && (
                        <div className="mb-5 rounded-md border border-green-100 bg-green-50 px-4 py-3">

                            <p className="text-xs font-medium text-green-700">
                                This timesheet is
                                completed.
                            </p>

                            <p className="mt-1 text-xs text-green-600">
                                You have reached the
                                maximum of{" "}
                                {
                                    MAX_WEEKLY_HOURS
                                }{" "}
                                hours for this week.
                            </p>

                        </div>
                    )}

                    {/* =================================================
                        INVALID DATA MESSAGE
                    ================================================= */}

                    {isInvalid && (
                        <div className="mb-5 rounded-md border border-red-100 bg-red-50 px-4 py-3">

                            <p className="text-xs font-medium text-red-700">
                                Invalid timesheet
                                total
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-600">
                                This timesheet currently
                                contains{" "}
                                <strong>
                                    {totalHours}
                                </strong>{" "}
                                hours. The maximum
                                allowed hours for a
                                week is{" "}
                                <strong>
                                    {
                                        MAX_WEEKLY_HOURS
                                    }
                                </strong>
                                .
                            </p>

                        </div>
                    )}

                    {/* =================================================
                        DAILY ENTRIES
                    ================================================= */}

                    <DayEntries
                        timesheet={
                            timesheet
                        }
                        onTimesheetUpdated={
                            loadTimesheet
                        }
                    />

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="mt-4 rounded-lg border border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
                    © 2026 Ashutosh Maurya.
                    All rights reserved.
                </footer>

            </section>

        </main>
    );
}

/**
 * =========================================================
 * FORMAT DATE RANGE
 * =========================================================
 */

function formatDateRange(
    start: string,
    end: string
) {
    const startDate =
        new Date(
            `${start}T00:00:00`
        );

    const endDate =
        new Date(
            `${end}T00:00:00`
        );

    const startFormatted =
        startDate.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    const endFormatted =
        endDate.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    return `${startFormatted} - ${endFormatted}`;
}