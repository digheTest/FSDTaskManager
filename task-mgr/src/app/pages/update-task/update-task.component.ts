import { Component, OnInit } from "@angular/core";
import { TaskService } from "src/app/services/task.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Task } from "src/app/models/task";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-update-task",
  templateUrl: "./update-task.component.html",
  styleUrls: ["./update-task.component.scss"]
})
export class UpdateTaskComponent implements OnInit {
  task: Task;
  taskId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.taskId = params.get("taskId");
      this.task = this.taskService.getTask(parseInt(this.taskId));
    });
  }

  processTask(task: Task) {
    this.taskService
      .saveTask(Object.assign(task, { taskId: this.taskId }))
      .subscribe(() =>
        this._snackBar
          .open(`Task ${task.taskName} updated successfully!`, "Close", {
            duration: 3000
          })
          .afterDismissed()
          .subscribe(() => this.router.navigate(["/view"]))
      );
  }
}
