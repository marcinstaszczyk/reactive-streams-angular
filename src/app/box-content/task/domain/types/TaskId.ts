import { getOrCreate } from '@/util';

export class TaskId {

    static taskIds = new Map<number, TaskId>();

    static create(taskId: number): TaskId {
        return getOrCreate(this.taskIds, taskId, () => new TaskId(taskId));
    }

    private constructor(
        readonly taskId: number
    ) {}

    toString(): string {
        return '' + this.taskId;
    }
}
