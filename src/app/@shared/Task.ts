import { Project, User } from "./interfaces";

export class Task {
   task: any;

    constructor(added: Task){
        this.task = {...added};
    }
}