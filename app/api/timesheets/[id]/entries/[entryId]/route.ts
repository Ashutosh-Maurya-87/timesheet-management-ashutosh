import { NextRequest, NextResponse } from "next/server";

import { timesheets } from "@/lib/mock-db";
import { UpdateTimesheetEntry } from "@/types/timesheet";

type RouteParams = {
    params: Promise<{
        id: string;
        entryId: string;
    }>;
};

/**
 * PATCH
 * Update an existing timesheet entry
 */
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id, entryId } = await params;

        const body =
            (await request.json()) as UpdateTimesheetEntry;

        const timesheet = timesheets.find(
            (item) => item.id === id
        );

        if (!timesheet) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Timesheet not found",
                },
                {
                    status: 404,
                }
            );
        }

        const entry = timesheet.entries.find(
            (item) => item.id === entryId
        );

        if (!entry) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Entry not found",
                },
                {
                    status: 404,
                }
            );
        }

        /**
         * Update only the fields that were sent
         */
        if (body.projectName !== undefined) {
            entry.projectName = body.projectName;
        }

        if (body.workType !== undefined) {
            entry.workType = body.workType;
        }

        if (body.description !== undefined) {
            entry.description = body.description;
        }

        if (body.hours !== undefined) {
            const hours = Number(body.hours);

            if (hours <= 0 || hours > 24) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Hours must be greater than 0 and less than or equal to 24",
                    },
                    {
                        status: 400,
                    }
                );
            }

            entry.hours = hours;
        }

        return NextResponse.json({
            success: true,
            message: "Entry updated successfully",
            data: entry,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update entry",
            },
            {
                status: 500,
            }
        );
    }
}

/**
 * DELETE
 * Delete an existing timesheet entry
 */
export async function DELETE(
    _request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id, entryId } = await params;

        const timesheet = timesheets.find(
            (item) => item.id === id
        );

        if (!timesheet) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Timesheet not found",
                },
                {
                    status: 404,
                }
            );
        }

        const entryIndex =
            timesheet.entries.findIndex(
                (item) => item.id === entryId
            );

        if (entryIndex === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Entry not found",
                },
                {
                    status: 404,
                }
            );
        }

        timesheet.entries.splice(entryIndex, 1);

        return NextResponse.json({
            success: true,
            message: "Entry deleted successfully",
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete entry",
            },
            {
                status: 500,
            }
        );
    }
}