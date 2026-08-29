interface EmptyStateProps {
    title?: string;
    description?: string;
}

export default function EmptyState({
    title = "No data found",
    description = "There are no timesheets matching your filters.",
}: EmptyStateProps) {
    return (
        <div className="py-12 text-center">
            <h3 className="text-sm font-medium text-gray-700">
                {title}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
                {description}
            </p>
        </div>
    );
}