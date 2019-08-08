export class Task {
  taskId: number;
  taskName: string;
  startDate: Date;
  endDate: Date;
  priority: number;
  isCompleted: boolean;
  parentTaskId: number;
  parentTaskName: string;

  constructor(
    options: {
      taskId?: number;
      taskName?: string;
      startDate?: Date;
      endDate?: Date;
      priority?: number;
      isCompleted?: boolean;
      parentTaskId?: number;
      parentTaskName?: string;
    } = {}
  ) {
    this.taskId = options.taskId || 0;
    this.taskName = options.taskName || "";
    this.startDate = options.startDate || new Date();
    this.endDate = options.endDate || new Date();
    this.priority = options.priority || 0;
    this.isCompleted = options.isCompleted || false;
    this.parentTaskId = options.parentTaskId || 0;
    this.parentTaskName = options.parentTaskName || "";
  }
}
