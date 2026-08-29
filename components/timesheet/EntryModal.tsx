"use client";

import { useEffect, useMemo } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import Modal from "@/components/common/Modal";

import {
    TimesheetEntry,
} from "@/types/timesheet";

import {
    MAX_WEEKLY_HOURS,
} from "@/lib/timesheet-utils";

/**
 * =========================================================
 * TYPES
 * =========================================================
 */

interface EntryModalProps {
    open: boolean;

    mode:
    | "create"
    | "edit";

    selectedDate: string;

    entry?:
    | TimesheetEntry
    | null;

    onClose: () => void;

    onSubmit: (
        data: FormValues
    ) => Promise<void>;

    /**
     * Current total number of hours
     * already entered for the week.
     *
     * Example:
     *
     * 35
     */
    totalWeeklyHours?: number;
}

/**
 * =========================================================
 * FORM VALIDATION
 * =========================================================
 *
 * The basic validation remains the same.
 *
 * Weekly validation is handled separately below because
 * the maximum depends on the current week's total.
 */

const entrySchema =
    z.object({
        projectName:
            z.string().min(
                1,
                "Please select a project"
            ),

        workType:
            z.string().min(
                1,
                "Please select a work type"
            ),

        description:
            z.string().min(
                5,
                "Description must contain at least 5 characters"
            ),

        hours:
            z.number({
                message:
                    "Hours are required",
            })
                .min(
                    0.5,
                    "Hours must be at least 0.5"
                )
                .max(
                    24,
                    "Hours cannot exceed 24"
                ),
    });

type FormValues =
    z.infer<
        typeof entrySchema
    >;

/**
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function EntryModal({
    open,
    mode,
    selectedDate,
    entry,
    onClose,
    onSubmit,
    totalWeeklyHours = 0,
}: EntryModalProps) {

    /**
     * =====================================================
     * CALCULATE AVAILABLE HOURS
     * =====================================================
     *
     * CREATE:
     *
     * If week has 35 hours:
     *
     * 40 - 35 = 5
     *
     * So the new entry can be max 5 hours.
     *
     * EDIT:
     *
     * If week has 35 hours and current entry is 4:
     *
     * 35 - 4 = 31
     *
     * 40 - 31 = 9
     *
     * So the edited entry can be max 9 hours.
     */

    const availableHours =
        useMemo(() => {
            /**
             * CREATE
             */
            if (
                mode ===
                "create"
            ) {
                return Math.max(
                    MAX_WEEKLY_HOURS -
                    totalWeeklyHours,
                    0
                );
            }

            /**
             * EDIT
             */
            if (
                mode === "edit" &&
                entry
            ) {
                const hoursWithoutCurrentEntry =
                    totalWeeklyHours -
                    Number(
                        entry.hours
                    );

                return Math.max(
                    MAX_WEEKLY_HOURS -
                    hoursWithoutCurrentEntry,
                    0
                );
            }

            return 0;
        }, [
            mode,
            entry,
            totalWeeklyHours,
        ]);

    /**
     * =====================================================
     * EFFECTIVE MAXIMUM
     * =====================================================
     *
     * One entry can never exceed 24 hours.
     *
     * The weekly limit may be lower.
     *
     * Therefore:
     *
     * min(24, remaining weekly hours)
     */

    const maximumHours =
        Math.min(
            24,
            availableHours
        );

    /**
     * =====================================================
     * REACT HOOK FORM
     * =====================================================
     */

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<FormValues>({
        resolver:
            zodResolver(
                entrySchema
            ),

        defaultValues: {
            projectName:
                "",

            workType:
                "",

            description:
                "",

            hours:
                1,
        },
    });

    /**
     * =====================================================
     * RESET FORM
     * =====================================================
     */

    useEffect(() => {
        if (
            entry &&
            mode === "edit"
        ) {
            reset({
                projectName:
                    entry.projectName,

                workType:
                    entry.workType,

                description:
                    entry.description,

                hours:
                    entry.hours,
            });
        } else {
            reset({
                projectName:
                    "",

                workType:
                    "",

                description:
                    "",

                hours:
                    1,
            });
        }
    }, [
        entry,
        mode,
        open,
        reset,
    ]);

    /**
     * =====================================================
     * FORM SUBMIT
     * =====================================================
     */

    async function handleFormSubmit(
        data: FormValues
    ) {
        /**
         * -----------------------------------------------
         * WEEKLY LIMIT VALIDATION
         * -----------------------------------------------
         */

        if (
            data.hours >
            maximumHours
        ) {
            setError(
                "hours",
                {
                    type: "manual",

                    message:
                        `You can enter a maximum of ${maximumHours} ${maximumHours ===
                            1
                            ? "hour"
                            : "hours"
                        } for this week.`,
                }
            );

            return;
        }

        /**
         * -----------------------------------------------
         * WEEK COMPLETED
         * -----------------------------------------------
         */

        if (
            maximumHours <=
            0 &&
            mode === "create"
        ) {
            setError(
                "hours",
                {
                    type: "manual",

                    message:
                        "This timesheet is already completed. No more hours can be added.",
                }
            );

            return;
        }

        /**
         * -----------------------------------------------
         * SUBMIT TO PARENT
         * -----------------------------------------------
         */

        await onSubmit(data);
    }

    /**
     * =====================================================
     * CLOSE MODAL
     * =====================================================
     */

    function handleClose() {
        if (!isSubmitting) {
            reset();

            onClose();
        }
    }

    return (
        <Modal
            open={open}
            title={
                mode ===
                    "create"
                    ? "Add New Entry"
                    : "Edit Entry"
            }
            onClose={
                handleClose
            }
        >
            <form
                onSubmit={handleSubmit(
                    handleFormSubmit
                )}
                className="space-y-4 p-5"
            >

                {/* =================================================
                    SELECTED DATE
                ================================================= */}

                <div>
                    <p className="text-xs text-gray-500">
                        Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                        {new Date(
                            `${selectedDate}T00:00:00`
                        ).toLocaleDateString(
                            "en-US",
                            {
                                weekday:
                                    "short",

                                day:
                                    "numeric",

                                month:
                                    "short",

                                year:
                                    "numeric",
                            }
                        )}
                    </p>
                </div>

                {/* =================================================
                    PROJECT
                ================================================= */}

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Select Project *
                    </label>

                    <select
                        {...register(
                            "projectName"
                        )}
                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#315dbc]"
                    >
                        <option value="">
                            Select Project
                        </option>

                        <option value="Homepage Development">
                            Homepage Development
                        </option>

                        <option value="Dashboard Development">
                            Dashboard Development
                        </option>

                        <option value="API Integration">
                            API Integration
                        </option>

                        <option value="Bug Fixing">
                            Bug Fixing
                        </option>
                    </select>

                    {errors.projectName && (
                        <p className="mt-1 text-xs text-red-500">
                            {
                                errors
                                    .projectName
                                    .message
                            }
                        </p>
                    )}
                </div>

                {/* =================================================
                    WORK TYPE
                ================================================= */}

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Type of Work *
                    </label>

                    <select
                        {...register(
                            "workType"
                        )}
                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#315dbc]"
                    >
                        <option value="">
                            Select Work Type
                        </option>

                        <option value="Bug">
                            Bug
                        </option>

                        <option value="Feature">
                            Feature
                        </option>

                        <option value="Development">
                            Development
                        </option>

                        <option value="Testing">
                            Testing
                        </option>

                        <option value="Meeting">
                            Meeting
                        </option>
                    </select>

                    {errors.workType && (
                        <p className="mt-1 text-xs text-red-500">
                            {
                                errors
                                    .workType
                                    .message
                            }
                        </p>
                    )}
                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Task Description *
                    </label>

                    <textarea
                        {...register(
                            "description"
                        )}
                        placeholder="Write your task description..."
                        className="min-h-27.5 w-full resize-none rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-[#315dbc]"
                    />

                    {errors.description && (
                        <p className="mt-1 text-xs text-red-500">
                            {
                                errors
                                    .description
                                    .message
                            }
                        </p>
                    )}
                </div>

                {/* =================================================
                    HOURS
                ================================================= */}

                <div>

                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="block text-xs font-medium text-gray-700">
                            Number of Hours *
                        </label>

                        <span className="text-[11px] text-gray-400">
                            Max{" "}
                            {maximumHours}{" "}
                            hrs
                        </span>
                    </div>

                    <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max={
                            maximumHours
                        }
                        {...register(
                            "hours",
                            {
                                valueAsNumber:
                                    true,
                            }
                        )}
                        className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#315dbc]"
                    />

                    {/* WEEKLY LIMIT INFO */}

                    {maximumHours >
                        0 && (
                            <p className="mt-1 text-[11px] text-gray-400">
                                You can enter up to{" "}
                                {
                                    maximumHours
                                }{" "}
                                hours for this entry.
                            </p>
                        )}

                    {/* COMPLETED */}

                    {maximumHours <=
                        0 && (
                            <p className="mt-1 text-xs text-red-500">
                                This week has reached
                                the maximum of{" "}
                                {
                                    MAX_WEEKLY_HOURS
                                }{" "}
                                hours.
                            </p>
                        )}

                    {errors.hours && (
                        <p className="mt-1 text-xs text-red-500">
                            {
                                errors
                                    .hours
                                    .message
                            }
                        </p>
                    )}

                </div>

                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="flex gap-3 border-t border-gray-200 pt-4">

                    <button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            maximumHours <=
                            0
                        }
                        className="flex-1 rounded-md bg-[#315dbc] py-2.5 text-sm font-medium text-white transition hover:bg-[#254fa8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? mode ===
                                "create"
                                ? "Adding..."
                                : "Updating..."
                            : mode ===
                                "create"
                                ? "Add Entry"
                                : "Update Entry"}
                    </button>

                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        disabled={
                            isSubmitting
                        }
                        className="flex-1 rounded-md border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>

                </div>

            </form>
        </Modal>
    );
}