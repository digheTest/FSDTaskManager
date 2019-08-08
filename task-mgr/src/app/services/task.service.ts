import { Injectable } from "@angular/core";
import { Task } from "../models/task";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ParentTask } from "../models/parent-task";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  static BASE_URL = "https://localhost:44366/api/values";

  tasks: Array<Task> = [];
  parentTasks: Array<ParentTask> = [];

  constructor(private http: HttpClient) {}

  saveTask({
    parentTaskId,
    endDate,
    isCompleted,
    parentTaskName,
    priority,
    startDate,
    taskId,
    taskName
  }: Task) {
    const task = new Task({
      taskId,
      taskName,
      endDate,
      isCompleted,
      priority,
      startDate
    });
    const parentTask: ParentTask = new ParentTask({
      parentTaskId,
      parentTaskName,
      task: [task]
    });
    return this.http
      .post(`${TaskService.BASE_URL}/ManageTask`, parentTask)
      .pipe(map(res => res));
  }

  endTask({ endDate, priority, startDate, taskId, taskName }: Task) {
    const task = new Task({
      endDate,
      priority,
      startDate,
      taskId,
      taskName,
      isCompleted: true
    });
    return this.http.put(`${TaskService.BASE_URL}/EditEndTask`, task);
  }

  getTask(taskId: number) {
    return this.tasks.find(task => task.taskId == taskId);
  }

  getParentTask(parentTaskId: number) {
    return this.parentTasks.find(
      parent => parent.parentTaskId === parentTaskId
    );
  }

  getAllParentTasks() {
    return this.parentTasks;
  }

  getAllTasks() {
    return this.http.get(`${TaskService.BASE_URL}/Get`).pipe(
      map((res: any) => {
        let parentTasks: Array<ParentTask> = [];
        let allTasks: Array<Task> = [];
        res.forEach(({ ParentTaskID, ParentTaskName, Task: Tasks }: any) => {
          let tasks: Array<Task> = [];
          if (Tasks.length) {
            Tasks.forEach(
              ({
                TaskId,
                TaskName,
                Priority,
                StartDate,
                EndDate,
                IsCompleted
              }) => {
                tasks.push(
                  new Task({
                    taskId: TaskId,
                    taskName: TaskName,
                    priority: Priority,
                    parentTaskId: ParentTaskID,
                    startDate: new Date(StartDate),
                    endDate: new Date(EndDate),
                    isCompleted: IsCompleted,
                    parentTaskName: ParentTaskID === 0 ? "N/A" : ParentTaskName
                  })
                );
              }
            );
            allTasks = [...allTasks, ...tasks];
          }
          parentTasks.push(
            new ParentTask({
              parentTaskId: ParentTaskID,
              parentTaskName: ParentTaskID === 0 ? "N/A" : ParentTaskName,
              task: tasks
            })
          );
        });
        this.tasks = allTasks;
        this.parentTasks = parentTasks;
        return this.tasks;
      })
    );
  }
}
