export interface Task {
    description: string;
    start_time: any;
    endTime: any;
    user: User;
    project: Project | null;
}

export interface User {
    name: string;
    email: string;
}

export interface Project{
    name: string;
}