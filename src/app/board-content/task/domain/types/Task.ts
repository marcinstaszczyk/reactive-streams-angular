import { Anemia } from '@/util';
import { TaskId } from './TaskId';

export class Task {

    readonly id: TaskId;
    readonly name: string;
    readonly completed: boolean;
    readonly description?: string;
    readonly assignee?: string;

    constructor(
        taskData: Anemia<Task>
    ) {
        this.id = taskData.id;
        this.name = taskData.name;
        this.completed = taskData.completed;
        this.description = taskData.description;
        this.assignee = taskData.assignee;
    }

}
