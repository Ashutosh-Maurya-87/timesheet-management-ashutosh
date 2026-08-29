import { NextRequest, NextResponse } from "next/server";

import { timesheets } from "@/lib/mock-db";

import {
    UpdateTimesheetEntry,
} from "@/types/timesheet";

import {
    MAX_WEEKLY_HOURS,
    getTotalHours,
} from "@/lib/timesheet-utils";

type RouteParams = {
    params: Promise<{
        id: string;
        entryId: string;
    }>;
};

/**
 * =========================================================
 * PATCH
 * =========================================================
 *
 * Update an existing timesheet entry.
 *
 * IMPORTANT:
 *
 * We allow editing even when the weekly total is already
 * 40 hours.
 *
 * But the NEW weekly total must never exceed 40 hours.
 *
 * Formula:
 *
 * current weekly total
 * - old entry hours
 * + new entry hours
 * <= 40
 */
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const {
            id,
            entryId,
        } = await params;

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
         * FIND ENTRY
         * =================================================
         */

        const entry =
            timesheet.entries.find(
                (item) =>
                    item.id === entryId
            );

        if (!entry) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Entry not found",
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
            (await request.json()) as UpdateTimesheetEntry;

        /**
         * =================================================
         * HOURS VALIDATION
         * =================================================
         *
         * Only validate hours when hours were included
         * in the PATCH request.
         */

        let newHours =
            Number(entry.hours);

        if (
            body.hours !==
            undefined
        ) {
            newHours =
                Number(
                    body.hours
                );

            /**
             * Make sure the value is actually numeric.
             */

            if (
                !Number.isFinite(
                    newHours
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
             * One entry:
             *
             * Minimum = 0.5
             * Maximum = 24
             */

            if (
                newHours <
                0.5 ||
                newHours > 24
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
         * REMOVE OLD ENTRY FROM TOTAL
         * =================================================
         *
         * Example:
         *
         * Current weekly total = 40
         * Current entry = 8
         *
         * 40 - 8 = 32
         *
         * This is the amount of hours that remain
         * after temporarily removing the entry being edited.
         */

        const totalWithoutCurrentEntry =
            currentTotal -
            Number(
                entry.hours
            );

        /**
         * =================================================
         * CALCULATE NEW WEEKLY TOTAL
         * =================================================
         */

        const newTotal =
            totalWithoutCurrentEntry +
            newHours;

        /**
         * =================================================
         * CHECK WEEKLY MAXIMUM
         * =================================================
         *
         * This is the most important validation.
         */

        if (
            newTotal >
            MAX_WEEKLY_HOURS
        ) {
            const availableHours =
                Math.max(
                    MAX_WEEKLY_HOURS -
                    totalWithoutCurrentEntry,
                    0
                );

            return NextResponse.json(
                {
                    success: false,

                    message:
                        `You can only set this entry to ${availableHours} ${availableHours ===
                            1
                            ? "hour"
                            : "hours"
                        }. The weekly maximum is ${MAX_WEEKLY_HOURS} hours.`,
                },
                {
                    status: 400,
                }
            );
        }

        /**
         * =================================================
         * UPDATE FIELDS
         * =================================================
         *
         * We update only fields that were actually
         * included in the request.
         */

        if (
            body.projectName !==
            undefined
        ) {
            entry.projectName =
                body.projectName;
        }

        if (
            body.workType !==
            undefined
        ) {
            entry.workType =
                body.workType;
        }

        if (
            body.description !==
            undefined
        ) {
            entry.description =
                body.description;
        }

        if (
            body.hours !==
            undefined
        ) {
            entry.hours =
                newHours;
        }

        /**
         * =================================================
         * SUCCESS RESPONSE
         * =================================================
         */

        return NextResponse.json({
            success: true,

            message:
                "Entry updated successfully",

            data: entry,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update entry",
            },
            {
                status: 500,
            }
        );
    }
}

/**
 * =========================================================
 * DELETE
 * =========================================================
 *
 * Delete an existing timesheet entry.
 *
 * There is no weekly-hour restriction here because
 * deleting an entry can only decrease the weekly total.
 *
 * Example:
 *
 * 40 -> delete 8 -> 32
 *
 * After deletion, the user can add hours again.
 */
export async function DELETE(
    _request: NextRequest,
    { params }: RouteParams
) {
    try {
        const {
            id,
            entryId,
        } = await params;

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
         * FIND ENTRY
         * =================================================
         */

        const entryIndex =
            timesheet.entries.findIndex(
                (item) =>
                    item.id ===
                    entryId
            );

        if (
            entryIndex ===
            -1
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Entry not found",
                },
                {
                    status: 404,
                }
            );
        }

        /**
         * =================================================
         * DELETE ENTRY
         * =================================================
         */

        timesheet.entries.splice(
            entryIndex,
            1
        );

        /**
         * =================================================
         * SUCCESS RESPONSE
         * =================================================
         */

        return NextResponse.json({
            success: true,

            message:
                "Entry deleted successfully",
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to delete entry",
            },
            {
                status: 500,
            }
        );
    }
}