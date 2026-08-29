import DashboardHeader from "@/components/dashboard/DashboardHeader";

import {
    DashboardFilterProvider,
} from "@/components/dashboard/DashboardFilterProvider";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardFilterProvider>
            <div className="min-h-screen bg-[#f7f8fa]">

                <DashboardHeader />

                {children}

            </div>
        </DashboardFilterProvider>
    );
}