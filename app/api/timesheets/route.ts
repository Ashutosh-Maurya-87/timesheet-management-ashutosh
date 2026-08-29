import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    timesheets,
} from "@/lib/mock-db";

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

        const page = Math.max(
            Number(pageParam || 1),
            1
        );

        const pageSize = Math.max(
            Number(pageSizeParam || 5),
            1
        );

        /*
         * ----------------------------------------
         * Validate date format
         * ----------------------------------------
         */

        const dateRegex =
            /^\d{4}-\d{2}-\d{2}$/;

        if (
            startDate &&
            !dateRegex.test(startDate)
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
            !dateRegex.test(endDate)
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

        /*
         * ----------------------------------------
         * Validate date range
         * ----------------------------------------
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
                    status: 400,
                }
            );
        }

        /*
         * ----------------------------------------
         * Start with all timesheets
         * ----------------------------------------
         */

        let filteredTimesheets =
            [...timesheets];

        /*
         * ----------------------------------------
         * Status filter
         * ----------------------------------------
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

        /*
         * ----------------------------------------
         * Date filtering
         *
         * A weekly timesheet matches when
         * its date range overlaps the selected
         * date range.
         * ----------------------------------------
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

        /*
         * ----------------------------------------
         * Total AFTER filtering
         * ----------------------------------------
         */

        const total =
            filteredTimesheets.length;

        /*
         * ----------------------------------------
         * Pagination
         * ----------------------------------------
         */

        const startIndex =
            (page - 1) * pageSize;

        const endIndex =
            startIndex + pageSize;

        const paginatedData =
            filteredTimesheets.slice(
                startIndex,
                endIndex
            );

        return NextResponse.json(
            {
                success: true,
                data: paginatedData,
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