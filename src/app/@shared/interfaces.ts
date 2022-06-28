export interface Task {
    id?: string;
    description: string;
    startTime: any;
    endTime: any;
    user: User;
    project: Project | null;
    period?: {
        days?: number,
        hours: number,
        // milliseconds: 18,
        minutes: number,
        months?: number,
        seconds: number,
        year?: number
    };
}

export interface User {
    name: string;
    email: string;
}

export interface Project{
    name: string;
}