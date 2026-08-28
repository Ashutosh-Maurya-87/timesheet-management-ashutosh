import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mb-4 text-5xl font-bold text-[#315dbc]">
                    404
                </div>

                <h1 className="text-xl font-semibold text-gray-800">
                    Page Not Found
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    The page you are looking for does not exist
                    or may have been moved.
                </p>

                <Link
                    href="/dashboard"
                    className="mt-6 inline-flex rounded-md bg-[#315dbc] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#254fa8]"
                >
                    Back to Dashboard
                </Link>
            </div>
        </main>
    );
}