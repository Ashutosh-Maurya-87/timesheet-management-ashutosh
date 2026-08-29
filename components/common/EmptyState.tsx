interface EmptyStateProps {
    title?: string;
    description?: React.ReactNode;
}

export default function EmptyState({
    title = "No data found",
    description = "There are no timesheets matching your filters.",
}: EmptyStateProps) {
    return (
        <div className="flex min-h-70 flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                >
                    <rect
                        width="18"
                        height="18"
                        x="3"
                        y="4"
                        rx="2"
                    />
                    <line
                        x1="16"
                        x2="16"
                        y1="2"
                        y2="6"
                    />
                    <line
                        x1="8"
                        x2="8"
                        y1="2"
                        y2="6"
                    />
                    <line
                        x1="3"
                        x2="21"
                        y1="10"
                        y2="10"
                    />
                </svg>
            </div>

            <h3 className="text-sm font-medium text-gray-700">
                {title}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
                {description}
            </p>
        </div>

    );
}