import { Task } from "./task";

export class ParentTask {
  parentTaskId: number;
  parentTaskName: string;
  task: Array<Task>;

  constructor(
    options: {
      parentTaskId?: number;
      parentTaskName?: string;
      task?: Array<Task>;
    } = {}
  ) {
    this.parentTaskId = options.parentTaskId;
    this.parentTaskName = options.parentTaskName || "";
    this.task = options.task || [];
  }
}
