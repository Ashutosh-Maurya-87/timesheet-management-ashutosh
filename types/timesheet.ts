export type TimesheetStatus =
    | "COMPLETED"
    | "INCOMPLETE"
    | "MISSING";

export interface TimesheetEntry {
    id: string;
    date: string;
    projectName: string;
    workType: string;
    description: string;
    hours: number;
}

export interface CreateTimesheetEntry {
    date: string;
    projectName: string;
    workType: string;
    description: string;
    hours: number;
}

export interface UpdateTimesheetEntry {
    projectName?: string;
    workType?: string;
    description?: string;
    hours?: number;
}

export interface TimesheetWeek {
    id: string;
    weekNumber: number;
    startDate: string;
    endDate: string;
    status: TimesheetStatus;
    entries: TimesheetEntry[];
}

export interface TimesheetListResponse {
    data: TimesheetWeek[];
    total: number;
    page: number;
    pageSize: number;
}