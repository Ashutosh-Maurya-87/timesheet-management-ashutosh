import { TimesheetWeek } from "@/types/timesheet";

/**
 * =========================================================
 * MOCK USERS
 * =========================================================
 */

export const users = [
    {
        id: "1",
        name: "Ashutosh Maurya",
        email: "ashu@email.com",
        password: "123",
    },
];

/**
 * =========================================================
 * CONSTANTS
 * =========================================================
 */

const MAX_WEEKLY_HOURS = 40;

/**
 * =========================================================
 * DATE HELPERS
 * =========================================================
 */

/**
 * Format a Date as YYYY-MM-DD.
 */
function formatDate(
    date: Date
): string {
    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Get the first Monday of a year.
 *
 * Examples:
 *
 * 2024 → Jan 1
 * 2025 → Jan 6
 * 2026 → Jan 5
 */
function getFirstMonday(
    year: number
): Date {
    const firstDay =
        new Date(
            year,
            0,
            1
        );

    const dayOfWeek =
        firstDay.getDay();

    const daysUntilMonday =
        dayOfWeek === 0
            ? 1
            : dayOfWeek === 1
                ? 0
                : 8 - dayOfWeek;

    const firstMonday =
        new Date(
            firstDay
        );

    firstMonday.setDate(
        firstMonday.getDate() +
        daysUntilMonday
    );

    return firstMonday;
}

/**
 * =========================================================
 * PROJECTS / WORK TYPES
 * =========================================================
 */

const projects = [
    "Homepage Development",
    "Dashboard Development",
    "API Integration",
    "Authentication",
    "Timesheet Application",
    "Bug Fixing",
    "Responsive Design",
    "Testing",
];

const workTypes = [
    "Development",
    "Testing",
    "Bug",
    "Feature",
    "Meeting",
];

/**
 * =========================================================
 * DESCRIPTION
 * =========================================================
 */

function getDescription(
    project: string,
    workType: string
): string {
    if (
        workType ===
        "Bug"
    ) {
        return `Fixed issues related to ${project.toLowerCase()}`;
    }

    if (
        workType ===
        "Testing"
    ) {
        return `Performed testing for ${project.toLowerCase()}`;
    }

    if (
        workType ===
        "Feature"
    ) {
        return `Implemented a new feature for ${project.toLowerCase()}`;
    }

    if (
        workType ===
        "Meeting"
    ) {
        return `Participated in a meeting related to ${project.toLowerCase()}`;
    }

    return `Worked on ${project.toLowerCase()}`;
}

/**
 * =========================================================
 * GENERATE ENTRIES
 * =========================================================
 */

function generateEntries(
    year: number,
    week: number,
    startDate: Date,
    status:
        | "COMPLETED"
        | "INCOMPLETE"
        | "MISSING"
): ReturnType<
    typeof createEntry
>[] {
    /**
     * Missing week:
     *
     * No entries.
     */
    if (
        status ===
        "MISSING"
    ) {
        return [];
    }

    const entries:
        ReturnType<
            typeof createEntry
        >[] = [];

    /**
     * =====================================================
     * COMPLETED
     * =====================================================
     *
     * Exactly:
     *
     * 5 days × 8 hours = 40
     */

    if (
        status ===
        "COMPLETED"
    ) {
        for (
            let day = 0;
            day < 5;
            day++
        ) {
            const entryDate =
                new Date(
                    startDate
                );

            entryDate.setDate(
                startDate.getDate() +
                day
            );

            const project =
                projects[
                (year +
                    week +
                    day) %
                projects.length
                ];

            const workType =
                workTypes[
                (year +
                    week +
                    day) %
                workTypes.length
                ];

            entries.push(
                createEntry(
                    year,
                    week,
                    day,
                    entryDate,
                    project,
                    workType,
                    8
                )
            );
        }

        return entries;
    }

    /**
     * =====================================================
     * INCOMPLETE
     * =====================================================
     *
     * Generate 2–3 working days.
     *
     * Total stays below 40.
     */

    const numberOfDays =
        2 +
        (week % 2);

    for (
        let day = 0;
        day < numberOfDays;
        day++
    ) {
        const entryDate =
            new Date(
                startDate
            );

        entryDate.setDate(
            startDate.getDate() +
            day
        );

        const project =
            projects[
            (year +
                week +
                day) %
            projects.length
            ];

        const workType =
            workTypes[
            (year +
                week +
                day) %
            workTypes.length
            ];

        /**
         * 4, 5 or 6 hours.
         *
         * Maximum with 3 days:
         *
         * 6 + 6 + 6 = 18
         *
         * Therefore definitely
         * below 40.
         */
        const hours =
            4 +
            ((year +
                week +
                day) %
                3);

        entries.push(
            createEntry(
                year,
                week,
                day,
                entryDate,
                project,
                workType,
                hours
            )
        );
    }

    return entries;
}

/**
 * =========================================================
 * CREATE ENTRY
 * =========================================================
 */

function createEntry(
    year: number,
    week: number,
    day: number,
    entryDate: Date,
    projectName: string,
    workType: string,
    hours: number
) {
    return {
        id: `entry-${year}-${String(
            week
        ).padStart(
            2,
            "0"
        )}-${day + 1}`,

        date:
            formatDate(
                entryDate
            ),

        projectName,

        workType,

        description:
            getDescription(
                projectName,
                workType
            ),

        hours,
    };
}

/**
 * =========================================================
 * GENERATE ONE YEAR
 * =========================================================
 */

function generateTimesheets(
    year: number,
    startWeek: number,
    endWeek: number
): TimesheetWeek[] {
    const generated:
        TimesheetWeek[] = [];

    const firstMonday =
        getFirstMonday(
            year
        );

    for (
        let week =
            startWeek;
        week <=
        endWeek;
        week++
    ) {
        /**
         * Calculate Monday.
         */
        const startDate =
            new Date(
                firstMonday
            );

        startDate.setDate(
            firstMonday.getDate() +
            (week - 1) *
            7
        );

        /**
         * Calculate Friday.
         */
        const endDate =
            new Date(
                startDate
            );

        endDate.setDate(
            startDate.getDate() +
            4
        );

        /**
         * =================================================
         * ROTATE STATUS
         * =================================================
         *
         * This gives us realistic distribution:
         *
         * COMPLETED
         * INCOMPLETE
         * MISSING
         */

        const statusIndex =
            (year +
                week) %
            3;

        let status:
            | "COMPLETED"
            | "INCOMPLETE"
            | "MISSING";

        if (
            statusIndex ===
            0
        ) {
            status =
                "COMPLETED";
        } else if (
            statusIndex ===
            1
        ) {
            status =
                "INCOMPLETE";
        } else {
            status =
                "MISSING";
        }

        /**
         * Generate entries based
         * on the actual status.
         */
        const entries =
            generateEntries(
                year,
                week,
                startDate,
                status
            );

        /**
         * =================================================
         * IMPORTANT
         * =================================================
         *
         * Status is generated from
         * the actual entries.
         *
         * This keeps the mock database
         * internally consistent.
         */

        const totalHours =
            entries.reduce(
                (
                    total,
                    entry
                ) =>
                    total +
                    entry.hours,
                0
            );

        const calculatedStatus =
            totalHours === 0
                ? "MISSING"
                : totalHours <
                    MAX_WEEKLY_HOURS
                    ? "INCOMPLETE"
                    : "COMPLETED";

        generated.push({
            id: `week-${year}-${String(
                week
            ).padStart(
                2,
                "0"
            )}`,

            weekNumber:
                week,

            startDate:
                formatDate(
                    startDate
                ),

            endDate:
                formatDate(
                    endDate
                ),

            status:
                calculatedStatus,

            entries,
        });
    }

    return generated;
}

/**
 * =========================================================
 * TIMESHEETS DATABASE
 * =========================================================
 *
 * 35 weeks × 3 years = 105 records.
 *
 * 2024 → 35
 * 2025 → 35
 * 2026 → 35
 *
 * Total → 105
 */

export const timesheets:
    TimesheetWeek[] = [
        ...generateTimesheets(
            2024,
            1,
            35
        ),

        ...generateTimesheets(
            2025,
            1,
            35
        ),

        ...generateTimesheets(
            2026,
            1,
            35
        ),
    ];