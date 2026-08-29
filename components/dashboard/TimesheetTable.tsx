import Link from "next/link";

import {
    TimesheetWeek,
} from "@/types/timesheet";

import StatusBadge from "./StatusBadge";

interface TimesheetTableProps {
    timesheets: TimesheetWeek[];
}

export default function TimesheetTable({
    timesheets,
}: TimesheetTableProps) {
    return (
        <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full min-w-[650px] text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500">
                            Week #
                        </th>

                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500">
                            Date
                        </th>

                        <th className="px-4 py-3 text-xs font-medium uppercase text-gray-500">
                            Status
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {timesheets.map(
                        (timesheet) => (
                            <tr
                                key={timesheet.id}
                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                            >
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {timesheet.weekNumber}
                                </td>

                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {formatDateRange(
                                        timesheet.startDate,
                                        timesheet.endDate
                                    )}
                                </td>

                                <td className="px-4 py-3">
                                    <StatusBadge
                                        status={
                                            timesheet.status
                                        }
                                    />
                                </td>

                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/dashboard/timesheets/${timesheet.id}`}
                                        className="text-sm font-medium text-[#315dbc] hover:underline"
                                    >
                                        {getActionText(
                                            timesheet.status
                                        )}
                                    </Link>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

function getActionText(
    status: TimesheetWeek["status"]
) {
    if (status === "MISSING") {
        return "Create";
    }

    if (status === "INCOMPLETE") {
        return "Update";
    }

    return "View";
}

function formatDateRange(
    start: string,
    end: string
) {
    const startDate =
        new Date(
            `${start}T00:00:00`
        );

    const endDate =
        new Date(
            `${end}T00:00:00`
        );

    const startFormatted =
        startDate.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    const endFormatted =
        endDate.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    return `${startFormatted} - ${endFormatted}`;
}