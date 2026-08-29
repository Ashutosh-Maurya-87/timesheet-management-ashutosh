import { describe, expect, it } from "vitest";

import {
    MAX_WEEKLY_HOURS,
    MIN_ENTRY_HOURS,
    getTotalHours,
    getRemainingHours,
    getTimesheetStatus,
    isTimesheetCompleted,
    canAddHours,
    canUpdateHours,
} from "@/lib/timesheet-utils";

import {
    TimesheetEntry,
} from "@/types/timesheet";

/**
 * =========================================================
 * TEST DATA HELPERS
 * =========================================================
 */

function createEntry(
    id: string,
    hours: number
): TimesheetEntry {
    return {
        id,
        date: "2026-01-05",
        projectName:
            "Dashboard Development",
        workType:
            "Development",
        description:
            "Worked on dashboard functionality",
        hours,
    };
}

/**
 * =========================================================
 * getTotalHours
 * =========================================================
 */

describe(
    "getTotalHours",
    () => {
        it(
            "should calculate total hours correctly",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        8
                    ),
                    createEntry(
                        "2",
                        8
                    ),
                    createEntry(
                        "3",
                        4
                    ),
                ];

                expect(
                    getTotalHours(
                        entries
                    )
                ).toBe(20);
            }
        );

        it(
            "should return 0 when there are no entries",
            () => {
                expect(
                    getTotalHours(
                        []
                    )
                ).toBe(0);
            }
        );
    }
);

/**
 * =========================================================
 * getRemainingHours
 * =========================================================
 */

describe(
    "getRemainingHours",
    () => {
        it(
            "should return 40 hours for an empty week",
            () => {
                expect(
                    getRemainingHours(
                        []
                    )
                ).toBe(
                    MAX_WEEKLY_HOURS
                );
            }
        );

        it(
            "should return the correct remaining hours",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        8
                    ),
                    createEntry(
                        "2",
                        8
                    ),
                ];

                expect(
                    getRemainingHours(
                        entries
                    )
                ).toBe(24);
            }
        );

        it(
            "should never return negative remaining hours",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        24
                    ),
                    createEntry(
                        "2",
                        24
                    ),
                ];

                expect(
                    getRemainingHours(
                        entries
                    )
                ).toBe(0);
            }
        );
    }
);

/**
 * =========================================================
 * getTimesheetStatus
 * =========================================================
 */

describe(
    "getTimesheetStatus",
    () => {
        it(
            "should return MISSING when there are no entries",
            () => {
                expect(
                    getTimesheetStatus(
                        []
                    )
                ).toBe(
                    "MISSING"
                );
            }
        );

        it(
            "should return INCOMPLETE when total hours are below 40",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        8
                    ),
                    createEntry(
                        "2",
                        6
                    ),
                ];

                expect(
                    getTimesheetStatus(
                        entries
                    )
                ).toBe(
                    "INCOMPLETE"
                );
            }
        );

        it(
            "should return COMPLETED when total hours are exactly 40",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        8
                    ),
                    createEntry(
                        "2",
                        8
                    ),
                    createEntry(
                        "3",
                        8
                    ),
                    createEntry(
                        "4",
                        8
                    ),
                    createEntry(
                        "5",
                        8
                    ),
                ];

                expect(
                    getTimesheetStatus(
                        entries
                    )
                ).toBe(
                    "COMPLETED"
                );
            }
        );
    }
);

/**
 * =========================================================
 * isTimesheetCompleted
 * =========================================================
 */

describe(
    "isTimesheetCompleted",
    () => {
        it(
            "should return false below 40 hours",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        20
                    ),
                ];

                expect(
                    isTimesheetCompleted(
                        entries
                    )
                ).toBe(
                    false
                );
            }
        );

        it(
            "should return true at exactly 40 hours",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        40
                    ),
                ];

                expect(
                    isTimesheetCompleted(
                        entries
                    )
                ).toBe(
                    true
                );
            }
        );

        it(
            "should return true when total is greater than 40",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        45
                    ),
                ];

                expect(
                    isTimesheetCompleted(
                        entries
                    )
                ).toBe(
                    true
                );
            }
        );
    }
);

/**
 * =========================================================
 * canAddHours
 * =========================================================
 */

describe(
    "canAddHours",
    () => {
        it(
            "should allow an entry when total stays below 40",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        20
                    ),
                ];

                expect(
                    canAddHours(
                        entries,
                        10
                    )
                ).toBe(
                    true
                );
            }
        );

        it(
            "should allow an entry that reaches exactly 40 hours",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        32
                    ),
                ];

                expect(
                    canAddHours(
                        entries,
                        8
                    )
                ).toBe(
                    true
                );
            }
        );

        it(
            "should reject an entry that exceeds 40 hours",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        35
                    ),
                ];

                expect(
                    canAddHours(
                        entries,
                        6
                    )
                ).toBe(
                    false
                );
            }
        );

        it(
            "should reject hours below the minimum",
            () => {
                expect(
                    canAddHours(
                        [],
                        MIN_ENTRY_HOURS -
                        0.5
                    )
                ).toBe(
                    false
                );
            }
        );
    }
);

/**
 * =========================================================
 * canUpdateHours
 * =========================================================
 */

describe(
    "canUpdateHours",
    () => {
        it(
            "should allow editing an entry without counting its old hours twice",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        20
                    ),
                    createEntry(
                        "2",
                        20
                    ),
                ];

                /**
                 * Total = 40.
                 *
                 * Editing entry 1:
                 *
                 * Remove old 20
                 * Remaining = 20
                 *
                 * New value = 20
                 *
                 * Final = 40
                 *
                 * Therefore allowed.
                 */
                expect(
                    canUpdateHours(
                        entries,
                        "1",
                        20
                    )
                ).toBe(
                    true
                );
            }
        );

        it(
            "should reject an update that exceeds 40 hours",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        20
                    ),
                    createEntry(
                        "2",
                        20
                    ),
                ];

                /**
                 * Remove entry 1:
                 *
                 * Remaining = 20
                 *
                 * New value = 21
                 *
                 * Final = 41
                 *
                 * Therefore rejected.
                 */
                expect(
                    canUpdateHours(
                        entries,
                        "1",
                        21
                    )
                ).toBe(
                    false
                );
            }
        );

        it(
            "should reject an update for an unknown entry",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        20
                    ),
                ];

                expect(
                    canUpdateHours(
                        entries,
                        "unknown",
                        10
                    )
                ).toBe(
                    false
                );
            }
        );

        it(
            "should reject hours below the minimum",
            () => {
                const entries = [
                    createEntry(
                        "1",
                        20
                    ),
                ];

                expect(
                    canUpdateHours(
                        entries,
                        "1",
                        MIN_ENTRY_HOURS -
                        0.5
                    )
                ).toBe(
                    false
                );
            }
        );
    }
);