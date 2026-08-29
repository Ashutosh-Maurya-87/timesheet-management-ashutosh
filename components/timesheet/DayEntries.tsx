"use client";

import { useMemo, useState } from "react";

import {
    TimesheetEntry,
    TimesheetWeek,
} from "@/types/timesheet";

import EntryModal from "./EntryModal";
import EntryActions from "./EntryActions";
import DeleteEntryModal from "./DeleteEntryModal";

import {
    createEntry,
    deleteEntry,
    updateEntry,
} from "@/lib/api-client";

import {
    MAX_WEEKLY_HOURS,
    getTotalHours,
} from "@/lib/timesheet-utils";

interface DayEntriesProps {
    timesheet: TimesheetWeek;

    onTimesheetUpdated: () => Promise<void>;
}

type FormValues = {
    projectName: string;
    workType: string;
    description: string;
    hours: number;
};

export default function DayEntries({
    timesheet,
    onTimesheetUpdated,
}: DayEntriesProps) {
    /**
     * =====================================================
     * CREATE / EDIT MODAL STATE
     * =====================================================
     */

    const [entryModalOpen, setEntryModalOpen] =
        useState(false);

    const [modalMode, setModalMode] =
        useState<"create" | "edit">("create");

    const [selectedDate, setSelectedDate] =
        useState("");

    const [selectedEntry, setSelectedEntry] =
        useState<TimesheetEntry | null>(null);

    /**
     * =====================================================
     * DELETE MODAL STATE
     * =====================================================
     */

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [entryToDelete, setEntryToDelete] =
        useState<TimesheetEntry | null>(null);

    const [deleting, setDeleting] =
        useState(false);

    /**
     * =====================================================
     * CALCULATE TOTAL WEEKLY HOURS
     * =====================================================
     */

    const totalHours = useMemo(() => {
        return getTotalHours(
            timesheet.entries
        );
    }, [timesheet.entries]);

    /**
     * =====================================================
     * WEEKLY CAPACITY
     * =====================================================
     *
     * Example:
     *
     * 20 / 40 -> 20 hours available
     * 35 / 40 -> 5 hours available
     * 40 / 40 -> 0 hours available
     * 57 / 40 -> 0 hours available
     */

    const remainingHours = Math.max(
        MAX_WEEKLY_HOURS -
        totalHours,
        0
    );

    /**
     * =====================================================
     * IMPORTANT BUSINESS RULE
     * =====================================================
     *
     * 40 hours means the weekly capacity
     * has been reached.
     *
     * BUT:
     *
     * 40 hours does NOT mean the entries
     * become permanently locked.
     *
     * Therefore:
     *
     * Edit  -> allowed
     * Delete -> allowed
     * Add   -> blocked
     *
     * If an entry is edited from 8 -> 4,
     * total becomes 36 and Add becomes
     * available again.
     */

    const cannotAddMore =
        totalHours >=
        MAX_WEEKLY_HOURS;

    /**
     * =====================================================
     * CREATE ALL DAYS DYNAMICALLY
     * =====================================================
     */

    const days = useMemo(() => {
        const result: string[] = [];

        const current = new Date(
            `${timesheet.startDate}T00:00:00`
        );

        const end = new Date(
            `${timesheet.endDate}T00:00:00`
        );

        while (current <= end) {
            result.push(
                current
                    .toISOString()
                    .split("T")[0]
            );

            current.setDate(
                current.getDate() + 1
            );
        }

        return result;
    }, [
        timesheet.startDate,
        timesheet.endDate,
    ]);

    /**
     * =====================================================
     * GROUP ENTRIES BY DATE
     * =====================================================
     */

    const groupedEntries =
        useMemo(() => {
            return timesheet.entries.reduce(
                (
                    groups: Record<
                        string,
                        TimesheetEntry[]
                    >,
                    entry
                ) => {
                    if (
                        !groups[
                        entry.date
                        ]
                    ) {
                        groups[
                            entry.date
                        ] = [];
                    }

                    groups[
                        entry.date
                    ].push(entry);

                    return groups;
                },
                {}
            );
        }, [timesheet.entries]);

    /**
     * =====================================================
     * OPEN CREATE MODAL
     * =====================================================
     */

    function handleCreate(
        date: string
    ) {
        /**
         * Do not allow creating another
         * entry when weekly capacity
         * has already reached 40 hours.
         */
        if (cannotAddMore) {
            alert(
                `This week has reached the maximum of ${MAX_WEEKLY_HOURS} hours. Reduce or delete an existing entry before adding new hours.`
            );

            return;
        }

        setModalMode("create");

        setSelectedDate(date);

        setSelectedEntry(null);

        setEntryModalOpen(true);
    }

    /**
     * =====================================================
     * OPEN EDIT MODAL
     * =====================================================
     *
     * IMPORTANT:
     *
     * Editing is allowed even when
     * totalHours === 40.
     *
     * This allows the user to correct
     * an existing timesheet.
     */

    function handleEdit(
        entry: TimesheetEntry
    ) {
        setModalMode("edit");

        setSelectedDate(
            entry.date
        );

        setSelectedEntry(entry);

        setEntryModalOpen(true);
    }

    /**
     * =====================================================
     * CREATE / UPDATE ENTRY
     * =====================================================
     */

    async function handleEntrySubmit(
        data: FormValues
    ) {
        try {
            const newHours =
                Number(data.hours);

            /**
             * ---------------------------------------------
             * BASIC HOURS VALIDATION
             * ---------------------------------------------
             */

            if (
                !Number.isFinite(
                    newHours
                )
            ) {
                alert(
                    "Please enter a valid number of hours."
                );

                return;
            }

            if (
                newHours <= 0
            ) {
                alert(
                    "Hours must be greater than 0."
                );

                return;
            }

            /**
             * ---------------------------------------------
             * CREATE
             * ---------------------------------------------
             */

            if (
                modalMode ===
                "create"
            ) {
                /**
                 * No capacity left.
                 */
                if (
                    totalHours >=
                    MAX_WEEKLY_HOURS
                ) {
                    alert(
                        `This week has reached the maximum of ${MAX_WEEKLY_HOURS} hours. Reduce or delete an existing entry before adding new hours.`
                    );

                    return;
                }

                /**
                 * Calculate the total after
                 * adding this entry.
                 */
                const newTotal =
                    totalHours +
                    newHours;

                /**
                 * Never allow total > 40.
                 */
                if (
                    newTotal >
                    MAX_WEEKLY_HOURS
                ) {
                    const availableHours =
                        Math.max(
                            MAX_WEEKLY_HOURS -
                            totalHours,
                            0
                        );

                    alert(
                        `You can only add ${availableHours} more ${availableHours ===
                            1
                            ? "hour"
                            : "hours"
                        } to this week.`
                    );

                    return;
                }

                /**
                 * Create the entry.
                 */
                await createEntry(
                    timesheet.id,
                    {
                        date:
                            selectedDate,

                        ...data,

                        hours:
                            newHours,
                    }
                );
            }

            /**
             * ---------------------------------------------
             * UPDATE
             * ---------------------------------------------
             */

            if (
                modalMode ===
                "edit" &&
                selectedEntry
            ) {
                /**
                 * -----------------------------------------
                 * REMOVE CURRENT ENTRY FROM TOTAL
                 * -----------------------------------------
                 *
                 * Example:
                 *
                 * Weekly total = 40
                 * Current entry = 8
                 *
                 * 40 - 8 = 32
                 *
                 * If user changes 8 -> 4:
                 *
                 * 32 + 4 = 36
                 *
                 * Valid.
                 */

                const totalWithoutCurrentEntry =
                    totalHours -
                    Number(
                        selectedEntry.hours
                    );

                /**
                 * Calculate new weekly total.
                 */
                const newTotal =
                    totalWithoutCurrentEntry +
                    newHours;

                /**
                 * Prevent edit from making
                 * the week exceed 40 hours.
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

                    alert(
                        `You can only set this entry to ${availableHours} ${availableHours ===
                            1
                            ? "hour"
                            : "hours"
                        } or less. The weekly maximum is ${MAX_WEEKLY_HOURS} hours.`
                    );

                    return;
                }

                /**
                 * Update the entry.
                 */
                await updateEntry(
                    timesheet.id,
                    selectedEntry.id,
                    {
                        ...data,

                        hours:
                            newHours,
                    }
                );
            }

            /**
             * ---------------------------------------------
             * CLOSE MODAL
             * ---------------------------------------------
             */

            setEntryModalOpen(false);

            /**
             * ---------------------------------------------
             * REFRESH TIMESHEET
             * ---------------------------------------------
             */

            await onTimesheetUpdated();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong";

            alert(message);

            throw error;
        }
    }

    /**
     * =====================================================
     * OPEN DELETE CONFIRMATION
     * =====================================================
     *
     * Delete is allowed even when the week
     * has reached 40 hours.
     *
     * This is important because deleting
     * an entry can bring:
     *
     * 40 -> 32
     *
     * and then the user can add hours again.
     */

    function handleDeleteClick(
        entry: TimesheetEntry
    ) {
        setEntryToDelete(entry);

        setDeleteModalOpen(true);
    }

    /**
     * =====================================================
     * CONFIRM DELETE
     * =====================================================
     */

    async function handleDeleteConfirm() {
        if (!entryToDelete) {
            return;
        }

        try {
            setDeleting(true);

            await deleteEntry(
                timesheet.id,
                entryToDelete.id
            );

            setDeleteModalOpen(false);

            setEntryToDelete(null);

            /**
             * Refresh the timesheet.
             *
             * Example:
             *
             * 40 -> delete 8 -> 32
             *
             * After refresh Add becomes
             * available again.
             */
            await onTimesheetUpdated();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to delete entry";

            alert(message);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <div className="space-y-6">

                {days.map((day) => {
                    const entries =
                        groupedEntries[
                        day
                        ] || [];

                    return (
                        <div
                            key={day}
                            className="flex flex-col gap-3 sm:flex-row sm:gap-6"
                        >
                            {/* =================================================
                                DATE
                            ================================================= */}

                            <div className="w-full pt-2 text-sm font-medium text-gray-700 sm:w-16">
                                {new Date(
                                    `${day}T00:00:00`
                                ).toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday:
                                            "short",

                                        day:
                                            "numeric",
                                    }
                                )}
                            </div>

                            {/* =================================================
                                ENTRIES
                            ================================================= */}

                            <div className="flex-1 space-y-2">

                                {entries.map(
                                    (
                                        entry
                                    ) => (
                                        <div
                                            key={
                                                entry.id
                                            }
                                            className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2.5"
                                        >

                                            {/* ENTRY INFORMATION */}

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-medium text-gray-800">
                                                    {
                                                        entry.projectName
                                                    }
                                                </p>

                                                <p className="mt-1 truncate text-xs text-gray-500">

                                                    {
                                                        entry.workType
                                                    }

                                                    {" · "}

                                                    {
                                                        entry.description
                                                    }

                                                </p>

                                            </div>

                                            {/* =================================================
                                                HOURS + ACTIONS
                                            ================================================= */}

                                            <div className="ml-4 flex shrink-0 items-center gap-2">

                                                <span className="text-xs text-gray-500">
                                                    {
                                                        entry.hours
                                                    }{" "}
                                                    hrs
                                                </span>

                                                {/*
                                                 * IMPORTANT:
                                                 *
                                                 * Edit and Delete remain visible
                                                 * even when weekly total is 40.
                                                 *
                                                 * 40 hours means "capacity reached",
                                                 * NOT "locked".
                                                 */}

                                                <EntryActions
                                                    onEdit={() =>
                                                        handleEdit(
                                                            entry
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            entry
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>
                                    )
                                )}

                                {/* =================================================
                                    ADD NEW TASK
                                ================================================= */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCreate(
                                            day
                                        )
                                    }
                                    disabled={
                                        cannotAddMore
                                    }
                                    title={
                                        cannotAddMore
                                            ? `Weekly limit of ${MAX_WEEKLY_HOURS} hours reached`
                                            : "Add new task"
                                    }
                                    className="w-full rounded-md border border-dashed border-gray-300 py-2.5 text-sm text-gray-500 transition hover:border-[#315dbc] hover:bg-blue-50 hover:text-[#315dbc] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:hover:border-gray-200 disabled:hover:bg-gray-50 disabled:hover:text-gray-400"
                                >
                                    + Add new task

                                    {cannotAddMore && (
                                        <span className="ml-2 text-[11px]">
                                            (40-hour limit reached)
                                        </span>
                                    )}
                                </button>

                            </div>

                        </div>
                    );
                })}

            </div>

            {/* =====================================================
                CREATE / EDIT MODAL
            ===================================================== */}

            <EntryModal
                open={
                    entryModalOpen
                }

                mode={
                    modalMode
                }

                selectedDate={
                    selectedDate
                }

                entry={
                    selectedEntry
                }

                onClose={() =>
                    setEntryModalOpen(
                        false
                    )
                }

                onSubmit={
                    handleEntrySubmit
                }

                /**
                 * Pass the actual weekly
                 * total to EntryModal.
                 *
                 * This allows EntryModal to
                 * calculate the correct maximum.
                 */
                totalWeeklyHours={
                    totalHours
                }
            />

            {/* =====================================================
                DELETE MODAL
            ===================================================== */}

            <DeleteEntryModal
                open={
                    deleteModalOpen
                }

                loading={
                    deleting
                }

                onClose={() => {
                    if (
                        !deleting
                    ) {
                        setDeleteModalOpen(
                            false
                        );

                        setEntryToDelete(
                            null
                        );
                    }
                }}

                onConfirm={
                    handleDeleteConfirm
                }
            />
        </>
    );
}