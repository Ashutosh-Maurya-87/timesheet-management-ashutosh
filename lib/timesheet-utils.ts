import {
    TimesheetEntry,
} from "@/types/timesheet";

/**
 * =========================================================
 * TIMESHEET CONSTANTS
 * =========================================================
 */

/**
 * Maximum number of hours allowed
 * in one timesheet week.
 */
export const MAX_WEEKLY_HOURS = 40;

/**
 * Minimum hours allowed for one entry.
 *
 * This must stay consistent with:
 *
 * - EntryModal
 * - POST API
 * - PATCH API
 */
export const MIN_ENTRY_HOURS = 0.5;

/**
 * Maximum hours allowed for
 * one individual entry.
 */
export const MAX_ENTRY_HOURS = 24;

/**
 * =========================================================
 * CALCULATE TOTAL HOURS
 * =========================================================
 *
 * Calculates the total hours from
 * all entries in a timesheet.
 *
 * Example:
 *
 * 8 + 8 + 4 = 20
 */
export function getTotalHours(
    entries: TimesheetEntry[]
): number {
    return entries.reduce(
        (total, entry) =>
            total +
            Number(
                entry.hours || 0
            ),
        0
    );
}

/**
 * =========================================================
 * CALCULATE REMAINING HOURS
 * =========================================================
 *
 * Example:
 *
 * 0  -> 40 remaining
 * 20 -> 20 remaining
 * 35 -> 5 remaining
 * 40 -> 0 remaining
 *
 * If invalid data contains 57 hours,
 * remaining hours will still be 0.
 */
export function getRemainingHours(
    entries: TimesheetEntry[]
): number {
    const totalHours =
        getTotalHours(entries);

    return Math.max(
        MAX_WEEKLY_HOURS -
        totalHours,
        0
    );
}

/**
 * =========================================================
 * GET TIMESHEET STATUS
 * =========================================================
 *
 * Status is calculated from actual
 * weekly hours.
 *
 * MISSING:
 * 0 hours
 *
 * INCOMPLETE:
 * More than 0 but less than 40
 *
 * COMPLETED:
 * Exactly 40
 *
 * INVALID:
 * More than 40
 *
 * IMPORTANT:
 *
 * We don't return INVALID here because
 * your existing TimesheetWeek status type
 * only supports:
 *
 * MISSING
 * INCOMPLETE
 * COMPLETED
 *
 * Therefore values above 40 are treated
 * separately using isTimesheetOverLimit().
 */
export function getTimesheetStatus(
    entries: TimesheetEntry[]
): "MISSING" | "INCOMPLETE" | "COMPLETED" {
    const totalHours =
        getTotalHours(entries);

    if (
        totalHours === 0
    ) {
        return "MISSING";
    }

    if (
        totalHours <
        MAX_WEEKLY_HOURS
    ) {
        return "INCOMPLETE";
    }

    return "COMPLETED";
}

/**
 * =========================================================
 * CHECK COMPLETED
 * =========================================================
 *
 * A timesheet has reached its weekly
 * capacity when it has 40 or more hours.
 *
 * This is useful for deciding whether
 * another entry can be added.
 *
 * IMPORTANT:
 *
 * This does NOT mean the timesheet
 * becomes read-only.
 *
 * At 40:
 *
 * Add    -> blocked
 * Edit   -> allowed
 * Delete -> allowed
 */
export function isTimesheetCompleted(
    entries: TimesheetEntry[]
): boolean {
    return (
        getTotalHours(entries) >=
        MAX_WEEKLY_HOURS
    );
}

/**
 * =========================================================
 * CHECK OVER LIMIT
 * =========================================================
 *
 * Detects invalid existing data.
 *
 * Example:
 *
 * 40 -> false
 * 41 -> true
 * 57 -> true
 */
export function isTimesheetOverLimit(
    entries: TimesheetEntry[]
): boolean {
    return (
        getTotalHours(entries) >
        MAX_WEEKLY_HOURS
    );
}

/**
 * =========================================================
 * CHECK WHETHER NEW ENTRY CAN BE ADDED
 * =========================================================
 *
 * Example:
 *
 * Existing = 35
 * New = 5
 *
 * 35 + 5 = 40
 * ✅ true
 *
 * Existing = 35
 * New = 6
 *
 * 35 + 6 = 41
 * ❌ false
 */
export function canAddHours(
    entries: TimesheetEntry[],
    newHours: number
): boolean {
    /**
     * Basic hours validation.
     */
    if (
        !Number.isFinite(
            newHours
        )
    ) {
        return false;
    }

    if (
        newHours <
        MIN_ENTRY_HOURS ||
        newHours >
        MAX_ENTRY_HOURS
    ) {
        return false;
    }

    const totalHours =
        getTotalHours(entries);

    return (
        totalHours +
        newHours <=
        MAX_WEEKLY_HOURS
    );
}

/**
 * =========================================================
 * CHECK WHETHER EXISTING ENTRY CAN BE UPDATED
 * =========================================================
 *
 * Important:
 *
 * When editing an entry, we first remove
 * the old entry's hours from the calculation.
 *
 * Example:
 *
 * Total = 40
 * Current entry = 8
 *
 * 40 - 8 = 32
 *
 * New entry = 4
 *
 * 32 + 4 = 36
 *
 * ✅ allowed
 */
export function canUpdateHours(
    entries: TimesheetEntry[],
    entryId: string,
    newHours: number
): boolean {
    /**
     * Validate new hours.
     */
    if (
        !Number.isFinite(
            newHours
        )
    ) {
        return false;
    }

    if (
        newHours <
        MIN_ENTRY_HOURS ||
        newHours >
        MAX_ENTRY_HOURS
    ) {
        return false;
    }

    /**
     * Find the existing entry.
     */
    const entry =
        entries.find(
            (item) =>
                item.id ===
                entryId
        );

    if (!entry) {
        return false;
    }

    /**
     * Remove the current entry from
     * the weekly total.
     */
    const totalWithoutCurrentEntry =
        getTotalHours(
            entries.filter(
                (item) =>
                    item.id !==
                    entryId
            )
        );

    /**
     * Add the new value.
     */
    const newTotal =
        totalWithoutCurrentEntry +
        newHours;

    /**
     * The final weekly total
     * must not exceed 40.
     */
    return (
        newTotal <=
        MAX_WEEKLY_HOURS
    );
}

/**
 * =========================================================
 * GET AVAILABLE HOURS FOR NEW ENTRY
 * =========================================================
 *
 * This helper tells us exactly how many
 * hours can still be added.
 *
 * Example:
 *
 * 35 -> 5
 * 40 -> 0
 * 57 -> 0
 */
export function getAvailableHours(
    entries: TimesheetEntry[]
): number {
    return Math.max(
        MAX_WEEKLY_HOURS -
        getTotalHours(entries),
        0
    );
}

/**
 * =========================================================
 * GET AVAILABLE HOURS FOR EDIT
 * =========================================================
 *
 * Example:
 *
 * Total = 35
 * Existing entry = 4
 *
 * 35 - 4 = 31
 * 40 - 31 = 9
 *
 * Therefore:
 *
 * maximum allowed for edited entry = 9
 */
export function getAvailableHoursForUpdate(
    entries: TimesheetEntry[],
    entryId: string
): number {
    const entry =
        entries.find(
            (item) =>
                item.id ===
                entryId
        );

    if (!entry) {
        return 0;
    }

    const totalWithoutCurrentEntry =
        getTotalHours(
            entries.filter(
                (item) =>
                    item.id !==
                    entryId
            )
        );

    return Math.max(
        MAX_WEEKLY_HOURS -
        totalWithoutCurrentEntry,
        0
    );
}