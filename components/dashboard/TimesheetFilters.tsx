"use client";

interface TimesheetFiltersProps {
    status: string;
    startDate: string;
    endDate: string;

    onStatusChange: (
        value: string
    ) => void;

    onStartDateChange: (
        value: string
    ) => void;

    onEndDateChange: (
        value: string
    ) => void;

    onClear: () => void;
}

/**
 * Application data currently starts
 * from January 1, 2024.
 */
const MIN_DATE = "2024-01-01";

/**
 * Get today's date in YYYY-MM-DD format.
 *
 * We intentionally calculate this dynamically
 * so the date never becomes stale.
 */
function getTodayDate(): string {
    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function TimesheetFilters({
    status,
    startDate,
    endDate,
    onStatusChange,
    onStartDateChange,
    onEndDateChange,
    onClear,
}: TimesheetFiltersProps) {

    /**
     * Today's date is the maximum
     * selectable date.
     */
    const maxDate =
        getTodayDate();

    /**
     * Check whether the selected
     * range is invalid.
     */
    const invalidRange =
        Boolean(
            startDate &&
            endDate &&
            startDate >
            endDate
        );

    /**
     * =====================================================
     * START DATE CHANGE
     * =====================================================
     */

    function handleStartDateChange(
        value: string
    ) {
        /**
         * Empty value is allowed.
         *
         * This allows the user to clear
         * the start date.
         */
        if (!value) {
            onStartDateChange(
                ""
            );

            return;
        }

        /**
         * Never allow a date before
         * the application's minimum date.
         *
         * The native date input already
         * prevents this in the UI, but
         * this protects the component as well.
         */
        if (
            value <
            MIN_DATE
        ) {
            return;
        }

        /**
         * Never allow a future date.
         */
        if (
            value >
            maxDate
        ) {
            return;
        }

        onStartDateChange(
            value
        );
    }

    /**
     * =====================================================
     * END DATE CHANGE
     * =====================================================
     */

    function handleEndDateChange(
        value: string
    ) {
        /**
         * End date cannot be selected
         * before a start date exists.
         */
        if (!startDate) {
            return;
        }

        /**
         * Allow clearing the end date.
         */
        if (!value) {
            onEndDateChange(
                ""
            );

            return;
        }

        /**
         * Never allow a date before
         * the application minimum.
         */
        if (
            value <
            MIN_DATE
        ) {
            return;
        }

        /**
         * Never allow a future date.
         */
        if (
            value >
            maxDate
        ) {
            return;
        }

        /**
         * End date cannot be before
         * the selected start date.
         */
        if (
            value <
            startDate
        ) {
            return;
        }

        onEndDateChange(
            value
        );
    }

    return (
        <div className="mb-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* =================================================
                    START DATE
                ================================================= */}

                <div className="w-full sm:w-auto">

                    <label
                        htmlFor="startDate"
                        className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                        Start Date
                    </label>

                    <input
                        id="startDate"
                        type="date"
                        min={
                            MIN_DATE
                        }
                        max={
                            maxDate
                        }
                        value={
                            startDate
                        }
                        onChange={(
                            event
                        ) =>
                            handleStartDateChange(
                                event
                                    .target
                                    .value
                            )
                        }
                        className={`h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#315dbc] sm:w-[170px] ${invalidRange
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                    />

                </div>

                {/* =================================================
                    END DATE
                ================================================= */}

                <div className="w-full sm:w-auto">

                    <label
                        htmlFor="endDate"
                        className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                        End Date
                    </label>

                    <input
                        id="endDate"
                        type="date"
                        min={
                            startDate ||
                            MIN_DATE
                        }
                        max={
                            maxDate
                        }
                        value={
                            endDate
                        }
                        disabled={
                            !startDate
                        }
                        onChange={(
                            event
                        ) =>
                            handleEndDateChange(
                                event
                                    .target
                                    .value
                            )
                        }
                        className={`h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#315dbc] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 sm:w-[170px] ${invalidRange
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                    />

                </div>

                {/* =================================================
                    STATUS
                ================================================= */}

                <div className="w-full sm:w-auto">

                    <label
                        htmlFor="status"
                        className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        value={
                            status
                        }
                        onChange={(
                            event
                        ) =>
                            onStatusChange(
                                event
                                    .target
                                    .value
                            )
                        }
                        className="h-10 w-full min-w-40 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#315dbc] sm:w-auto"
                    >
                        <option value="ALL">
                            All Status
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="INCOMPLETE">
                            Incomplete
                        </option>

                        <option value="MISSING">
                            Missing
                        </option>
                    </select>

                </div>

                {/* =================================================
                    CLEAR FILTERS
                ================================================= */}

                <button
                    type="button"
                    onClick={
                        onClear
                    }
                    className="h-10 rounded-md px-3 text-sm font-medium text-[#315dbc] transition hover:bg-blue-50"
                >
                    Clear
                </button>

            </div>

            {/* =====================================================
                INVALID DATE RANGE
            ===================================================== */}

            {invalidRange && (
                <p className="mt-2 text-xs text-red-500">
                    End date must be on or after
                    the start date.
                </p>
            )}

            {/* =====================================================
                END DATE INFORMATION
            ===================================================== */}

            {!startDate && (
                <p className="mt-2 text-xs text-gray-400">
                    Select a start date before
                    selecting an end date.
                </p>
            )}

            {/* =====================================================
                WEEK-WISE INFORMATION
            ===================================================== */}

            {startDate &&
                endDate &&
                !invalidRange && (
                    <p className="mt-2 text-xs text-gray-400">
                        Timesheets are recorded
                        week-wise. Selecting a date
                        within a work week will show
                        that week's timesheet.
                    </p>
                )}

        </div>
    );
}