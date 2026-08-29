import { TimesheetStatus } from "@/types/timesheet";

interface Props {
    status: TimesheetStatus;
}

const styles = {
    COMPLETED:
        "bg-[#dff5eb] text-[#35735d]",

    INCOMPLETE:
        "bg-[#fff2c9] text-[#8a6a17]",

    MISSING:
        "bg-[#f8e4ec] text-[#9b4860]",
};

export default function StatusBadge({
    status,
}: Props) {
    return (
        <span
            className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${styles[status]}`}
        >
            {status}
        </span>
    );
}