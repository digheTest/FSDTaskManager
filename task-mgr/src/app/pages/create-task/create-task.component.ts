import { Component, OnInit } from "@angular/core";
import { TaskService } from "src/app/services/task.service";
import { Task } from "src/app/models/task";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.component.html",
  styleUrls: ["./create-task.component.scss"]
})
export class CreateTaskComponent implements OnInit {
  task: Task;

  constructor(
    private taskService: TaskService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {}

  processTask(task: Task) {
    this.task = task;
    this.taskService.saveTask(this.task).subscribe(() => {
      this._snackBar
        .open(`Task ${task.taskName} created successfully!`, "Close", {
          duration: 3000
        })
        .afterDismissed()
        .subscribe(() => this.router.navigate(["/view"]));
    });
  }
}
