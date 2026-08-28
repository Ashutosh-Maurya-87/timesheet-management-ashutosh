import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <span className="text-2xl text-red-500">
                        !
                    </span>
                </div>

                <h1 className="text-xl font-semibold text-gray-800">
                    Unauthorized Access
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    You are not authorized to access this page.
                    Please sign in to continue.
                </p>

                <Link
                    href="/login"
                    className="mt-6 inline-flex rounded-md bg-[#315dbc] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#254fa8]"
                >
                    Go to Login
                </Link>
            </div>
        </main>
    );
}