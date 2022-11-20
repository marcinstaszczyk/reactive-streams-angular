export interface TaskDTO {
    id: number;
    name: string;
    completed: boolean;
    description?: string;
    assignee?: string;
}
