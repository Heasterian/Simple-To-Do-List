export interface TaskInterface{
    description: string;
    done: boolean;
}

export interface TaskList{
    daily: TaskInterface[];
    weekly: TaskInterface[];
    monthly: TaskInterface[];
}