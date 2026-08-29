"use client";

import {
    createContext,
    useContext,
    useState,
} from "react";

interface DashboardFilterContextValue {
    status: string;
    startDate: string;
    endDate: string;

    page: number;
    pageSize: number;

    setStatus: (
        value: string
    ) => void;

    setStartDate: (
        value: string
    ) => void;

    setEndDate: (
        value: string
    ) => void;

    setPage: (
        value: number
    ) => void;

    setPageSize: (
        value: number
    ) => void;

    resetFilters: () => void;
}

/**
 * =========================================================
 * GET TODAY
 * =========================================================
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

/**
 * =========================================================
 * CONTEXT
 * =========================================================
 */

const DashboardFilterContext =
    createContext<
        DashboardFilterContextValue | undefined
    >(undefined);

/**
 * =========================================================
 * PROVIDER
 * =========================================================
 */

export function DashboardFilterProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const today =
        getTodayDate();

    const [
        status,
        setStatus,
    ] = useState("ALL");

    const [
        startDate,
        setStartDate,
    ] = useState(today);

    const [
        endDate,
        setEndDate,
    ] = useState(today);

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        pageSize,
        setPageSize,
    ] = useState(5);

    function resetFilters() {
        const currentDate =
            getTodayDate();

        setStatus(
            "ALL"
        );

        setStartDate(
            currentDate
        );

        setEndDate(
            currentDate
        );

        setPage(
            1
        );

        setPageSize(
            5
        );
    }

    return (
        <DashboardFilterContext.Provider
            value={{
                status,
                startDate,
                endDate,
                page,
                pageSize,

                setStatus,
                setStartDate,
                setEndDate,
                setPage,
                setPageSize,

                resetFilters,
            }}
        >
            {children}
        </DashboardFilterContext.Provider>
    );
}

/**
 * =========================================================
 * CUSTOM HOOK
 * =========================================================
 */

export function useDashboardFilters() {
    const context =
        useContext(
            DashboardFilterContext
        );

    if (!context) {
        throw new Error(
            "Something went wrong"
        );
    }

    return context;
}