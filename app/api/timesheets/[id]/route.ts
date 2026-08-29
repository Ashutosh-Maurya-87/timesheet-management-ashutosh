import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { timesheets } from "@/lib/mock-db";
import { CreateTimesheetEntry } from "@/types/timesheet";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

/**
 * GET
 * Get one complete timesheet by ID
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
                    message: "Timesheet not found",
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
                message: "Failed to fetch timesheet",
            },
            {
                status: 500,
            }
        );
    }
}

/**
 * POST
 * Add a new entry to a timesheet
 */
export async function POST(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        const body =
            (await request.json()) as CreateTimesheetEntry;

        /**
         * Basic API validation
         */
        if (
            !body.date ||
            !body.projectName ||
            !body.workType ||
            !body.description ||
            !body.hours
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                {
                    status: 400,
                }
            );
        }

        if (body.hours <= 0 || body.hours > 24) {
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

        const newEntry = {
            id: randomUUID(),
            date: body.date,
            projectName: body.projectName,
            workType: body.workType,
            description: body.description,
            hours: Number(body.hours),
        };

        timesheet.entries.push(newEntry);

        return NextResponse.json(
            {
                success: true,
                message: "Entry created successfully",
                data: newEntry,
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