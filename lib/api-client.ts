import {
    CreateTimesheetEntry,
    TimesheetEntry,
    TimesheetListResponse,
    TimesheetWeek,
    UpdateTimesheetEntry,
} from "@/types/timesheet";

/**
 * Get all timesheets
 */
export async function getTimesheets(
    page = 1,
    pageSize = 5,
    status?: string,
    startDate?: string,
    endDate?: string
): Promise<TimesheetListResponse> {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    if (status && status !== "ALL") {
        params.set("status", status);
    }

    if (startDate) {
        params.set("startDate", startDate);
    }

    if (endDate) {
        params.set("endDate", endDate);
    }

    const response = await fetch(
        `/api/timesheets?${params.toString()}`,
        { cache: "no-store" }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch timesheets"
        );
    }

    return {
        data: result.data,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
    };
}

/**
 * Get one timesheet
 */
export async function getTimesheetById(
    id: string
): Promise<TimesheetWeek> {
    const response = await fetch(
        `/api/timesheets/${id}`,
        {
            cache: "no-store",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch timesheet"
        );
    }

    return result.data;
}

/**
 * Create a new entry
 */
export async function createEntry(
    timesheetId: string,
    entry: CreateTimesheetEntry
): Promise<TimesheetEntry> {
    const response = await fetch(
        `/api/timesheets/${timesheetId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entry),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to create entry"
        );
    }

    return result.data;
}

/**
 * Update an entry
 */
export async function updateEntry(
    timesheetId: string,
    entryId: string,
    entry: UpdateTimesheetEntry
): Promise<TimesheetEntry> {
    const response = await fetch(
        `/api/timesheets/${timesheetId}/entries/${entryId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entry),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to update entry"
        );
    }

    return result.data;
}

/**
 * Delete an entry
 */
export async function deleteEntry(
    timesheetId: string,
    entryId: string
): Promise<void> {
    const response = await fetch(
        `/api/timesheets/${timesheetId}/entries/${entryId}`,
        {
            method: "DELETE",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to delete entry"
        );
    }
}