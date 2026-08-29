import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    timesheets,
} from "@/lib/mock-db";

import {
    getTimesheetStatus,
} from "@/lib/timesheet-utils";

export async function GET(
    request: NextRequest
) {
    try {
        const { searchParams } =
            new URL(request.url);

        const pageParam =
            searchParams.get("page");

        const pageSizeParam =
            searchParams.get("pageSize");

        const status =
            searchParams.get("status");

        const startDate =
            searchParams.get("startDate");

        const endDate =
            searchParams.get("endDate");

        /**
         * =====================================================
         * PAGINATION
         * =====================================================
         */

        const parsedPage =
            Number(pageParam || 1);

        const parsedPageSize =
            Number(pageSizeParam || 5);

        const page =
            Number.isFinite(
                parsedPage
            )
                ? Math.max(
                    parsedPage,
                    1
                )
                : 1;

        const pageSize =
            Number.isFinite(
                parsedPageSize
            )
                ? Math.max(
                    parsedPageSize,
                    1
                )
                : 5;

        /**
         * =====================================================
         * DATE FORMAT VALIDATION
         * =====================================================
         *
         * Expected:
         *
         * YYYY-MM-DD
         */

        const dateRegex =
            /^\d{4}-\d{2}-\d{2}$/;

        if (
            startDate &&
            !dateRegex.test(
                startDate
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid start date.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            endDate &&
            !dateRegex.test(
                endDate
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid end date.",
                },
                {
                    status: 400,
                }
            );
        }

        /**
         * =====================================================
         * VALIDATE ACTUAL DATE VALUES
         * =====================================================
         *
         * Regex alone would allow values such as:
         *
         * 2026-99-99
         *
         * So we also validate that the date actually exists.
         */

        function isValidDateString(
            value: string
        ): boolean {
            const date =
                new Date(
                    `${value}T00:00:00`
                );

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return false;
            }

            const [
                year,
                month,
                day,
            ] =
                value
                    .split("-")
                    .map(Number);

            return (
                date.getFullYear() ===
                year &&
                date.getMonth() + 1 ===
                month &&
                date.getDate() ===
                day
            );
        }

        if (
            startDate &&
            !isValidDateString(
                startDate
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid start date.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            endDate &&
            !isValidDateString(
                endDate
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid end date.",
                },
                {
                    status: 400,
                }
            );
        }

        /**
         * =====================================================
         * VALIDATE DATE RANGE
         * =====================================================
         */

        if (
            startDate &&
            endDate &&
            startDate > endDate
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Start date cannot be after end date.",
                },
                {
                    status: 400
                }
            );
        }

        /**
         * =====================================================
         * START WITH ALL TIMESHEETS
         * =====================================================
         */

        let filteredTimesheets =
            [...timesheets];

        /**
         * =====================================================
         * CALCULATE STATUS FROM ACTUAL ENTRIES
         * =====================================================
         *
         * We do not blindly trust:
         *
         * timesheet.status
         *
         * because the entries can change after:
         *
         * - Create
         * - Edit
         * - Delete
         *
         * Instead:
         *
         * entries -> calculate status
         */

        const timesheetsWithCalculatedStatus =
            filteredTimesheets.map(
                (timesheet) => ({
                    ...timesheet,

                    status:
                        getTimesheetStatus(
                            timesheet.entries
                        ),
                })
            );

        filteredTimesheets =
            timesheetsWithCalculatedStatus;

        /**
         * =====================================================
         * STATUS FILTER
         * =====================================================
         */

        if (
            status &&
            status !== "ALL"
        ) {
            filteredTimesheets =
                filteredTimesheets.filter(
                    (timesheet) =>
                        timesheet.status ===
                        status
                );
        }

        /**
         * =====================================================
         * DATE FILTERING
         * =====================================================
         *
         * A weekly timesheet matches when
         * its date range overlaps the selected
         * date range.
         *
         * Example:
         *
         * Timesheet:
         *
         * Jan 5 - Jan 9
         *
         * Selected:
         *
         * Jan 7 - Jan 20
         *
         * They overlap, therefore the week
         * is included.
         *
         * -----------------------------------------
         *
         * If only startDate is selected:
         *
         * week.endDate >= startDate
         *
         * -----------------------------------------
         *
         * If only endDate is selected:
         *
         * week.startDate <= endDate
         *
         * -----------------------------------------
         *
         * If both are selected:
         *
         * week.endDate >= startDate
         * AND
         * week.startDate <= endDate
         */

        if (startDate) {
            filteredTimesheets =
                filteredTimesheets.filter(
                    (timesheet) =>
                        timesheet.endDate >=
                        startDate
                );
        }

        if (endDate) {
            filteredTimesheets =
                filteredTimesheets.filter(
                    (timesheet) =>
                        timesheet.startDate <=
                        endDate
                );
        }

        /**
         * =====================================================
         * TOTAL AFTER FILTERING
         * =====================================================
         */

        const total =
            filteredTimesheets.length;

        /**
         * =====================================================
         * PAGINATION
         * =====================================================
         */

        const startIndex =
            (page - 1) *
            pageSize;

        const endIndex =
            startIndex +
            pageSize;

        const paginatedData =
            filteredTimesheets.slice(
                startIndex,
                endIndex
            );

        /**
         * =====================================================
         * RESPONSE
         * =====================================================
         */

        return NextResponse.json(
            {
                success: true,

                data:
                    paginatedData,

                total,

                page,

                pageSize,
            },
            {
                headers: {
                    "Cache-Control":
                        "no-store",
                },
            }
        );
    } catch (error) {
        console.error(
            "GET /api/timesheets error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch timesheets.",
            },
            {
                status: 500,
            }
        );
    }
}