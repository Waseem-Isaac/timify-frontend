export interface Task {
    _id?: string;
    description: string;
    startTime: any;
    endTime: any;
    user?: string;
    project: Project | null;
    period?: string,

    tasks?: Task[],
    finishedTasks?: boolean,
    overalPeriod?: string;
}

export interface CategoizedTaskPerDay {
    day: string,
    tasks: Task[],
    finishedTasks?: boolean
}

export interface User {
    name: string;
    email: string;
}

export interface Project{
    name: string;
}

export interface LoginContext {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterContext {
    username: string;
    email: string;
    password: string;
    picture?: string;
}