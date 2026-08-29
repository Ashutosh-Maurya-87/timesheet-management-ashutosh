import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { timesheets } from "@/lib/mock-db";
import { CreateTimesheetEntry } from "@/types/timesheet";

import {
    MAX_WEEKLY_HOURS,
    getTotalHours,
} from "@/lib/timesheet-utils";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

/**
 * =========================================================
 * GET
 * =========================================================
 *
 * Get one complete timesheet by ID.
 */
export async function GET(
    _request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        const timesheet = timesheets.find(
            (item) => item.id === id
        );

        if (!timesheet) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Timesheet not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            data: timesheet,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch timesheet",
            },
            {
                status: 500,
            }
        );
    }
}

/**
 * =========================================================
 * POST
 * =========================================================
 *
 * Add a new entry to a timesheet.
 *
 * IMPORTANT:
 *
 * The frontend already checks the 40-hour limit.
 *
 * But we MUST also check it here on the server.
 *
 * This prevents somebody from bypassing the UI and
 * directly sending a POST request with invalid hours.
 */
export async function POST(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        /**
         * =================================================
         * FIND TIMESHEET
         * =================================================
         */

        const timesheet =
            timesheets.find(
                (item) =>
                    item.id === id
            );

        if (!timesheet) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Timesheet not found",
                },
                {
                    status: 404,
                }
            );
        }

        /**
         * =================================================
         * READ REQUEST BODY
         * =================================================
         */

        const body =
            (await request.json()) as CreateTimesheetEntry;

        /**
         * =================================================
         * BASIC API VALIDATION
         * =================================================
         */

        if (
            !body.date ||
            !body.projectName ||
            !body.workType ||
            !body.description ||
            body.hours === undefined ||
            body.hours === null
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "All fields are required",
                },
                {
                    status: 400,
                }
            );
        }

        /**
         * =================================================
         * CONVERT HOURS TO NUMBER
         * =================================================
         */

        const hours =
            Number(body.hours);

        /**
         * Make sure hours are actually numeric.
         */
        if (
            !Number.isFinite(
                hours
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Hours must be a valid number",
                },
                {
                    status: 400,
                }
            );
        }

        /**
         * =================================================
         * PER-ENTRY VALIDATION
         * =================================================
         *
         * One individual entry:
         *
         * minimum = 0.5
         * maximum = 24
         */

        if (
            hours < 0.5 ||
            hours > 24
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Hours must be at least 0.5 and less than or equal to 24",
                },
                {
                    status: 400,
                }
            );
        }

        /**
         * =================================================
         * CURRENT WEEKLY TOTAL
         * =================================================
         */

        const currentTotal =
            getTotalHours(
                timesheet.entries
            );

        /**
         * =================================================
         * CHECK WEEKLY LIMIT
         * =================================================
         *
         * Example:
         *
         * Current = 35
         * New     = 4
         *
         * 35 + 4 = 39
         *
         * ✅ Allowed
         *
         * -----------------------------------------------
         *
         * Current = 35
         * New     = 6
         *
         * 35 + 6 = 41
         *
         * ❌ Rejected
         */

        const newTotal =
            currentTotal +
            hours;

        if (
            newTotal >
            MAX_WEEKLY_HOURS
        ) {
            const remainingHours =
                Math.max(
                    MAX_WEEKLY_HOURS -
                    currentTotal,
                    0
                );

            return NextResponse.json(
                {
                    success: false,

                    message:
                        remainingHours >
                            0
                            ? `You can only add ${remainingHours} more ${remainingHours ===
                                1
                                ? "hour"
                                : "hours"
                            } to this week. The weekly maximum is ${MAX_WEEKLY_HOURS} hours.`
                            : `This week has already reached the maximum of ${MAX_WEEKLY_HOURS} hours.`,
                },
                {
                    status: 400,
                }
            );
        }

        /**
         * =================================================
         * CREATE ENTRY
         * =================================================
         */

        const newEntry = {
            id: randomUUID(),

            date:
                body.date,

            projectName:
                body.projectName,

            workType:
                body.workType,

            description:
                body.description,

            hours,
        };

        /**
         * =================================================
         * SAVE ENTRY
         * =================================================
         */

        timesheet.entries.push(
            newEntry
        );

        /**
         * =================================================
         * SUCCESS RESPONSE
         * =================================================
         */

        return NextResponse.json(
            {
                success: true,

                message:
                    "Entry created successfully",

                data:
                    newEntry,
            },
            {
                status: 201,
            }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create entry",
            },
            {
                status: 500,
            }
        );
    }
}