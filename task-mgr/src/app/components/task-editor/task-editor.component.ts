import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { validDateCheck } from "src/app/utils/valid-date";
import { MatSnackBar } from "@angular/material";
import { Task } from "src/app/models/task";
import { TaskService } from "src/app/services/task.service";
import { map, startWith } from "rxjs/operators";
import { ParentTask } from "src/app/models/parent-task";
import { Observable } from "rxjs";

@Component({
  selector: "app-task-editor",
  templateUrl: "./task-editor.component.html",
  styleUrls: ["./task-editor.component.scss"]
})
export class TaskEditorComponent implements OnInit {
  mode: string;

  @Input("task") taskObj: Task;

  @Output() emitTask = new EventEmitter();

  taskForm: FormGroup;

  title: string;

  btnTxt: string;

  primaryDisable: boolean = true;
  secondaryDisable: boolean = false;

  parents: Array<ParentTask>;

  parentTaskName: string;

  filteredParents: Observable<Array<ParentTask>>;

  constructor(
    private taskService: TaskService,
    private _snackBar: MatSnackBar
  ) {
    this.parents = this.taskService.getAllParentTasks();
  }

  ngOnInit() {
    this.mode = !this.taskObj ? "create" : "update";

    this.title = this.mode === "create" ? "Add Task" : "Edit Task";
    this.btnTxt = this.mode === "create" ? "Save" : "Update";

    this.taskObj = this.taskObj || new Task();

    const parentTask: ParentTask = this.taskService.getParentTask(
      this.taskObj.parentTaskId
    );

    let taskFormGroup = {
      taskName: new FormControl(
        this.taskObj.taskName || "",
        Validators.required
      ),
      priority: new FormControl(
        this.taskObj.priority || "0",
        Validators.required
      ),
      parentTaskName: new FormControl(
        parentTask ? parentTask.parentTaskName : ""
      ),
      startDate: new FormControl(this.taskObj.startDate || new Date(), [
        Validators.required,
        validDateCheck
      ]),
      endDate: new FormControl(
        this.taskObj.endDate || new Date(),
        validDateCheck
      )
    };

    taskFormGroup.endDate.valueChanges.subscribe(() =>
      this._snackBar.dismiss()
    );

    taskFormGroup.startDate.valueChanges.subscribe(() =>
      this._snackBar.dismiss()
    );

    this.filteredParents = taskFormGroup.parentTaskName.valueChanges.pipe(
      startWith(""),
      map(val => {
        this.parentTaskName = val;
        return val ? this._filterParentTasks(val) : this.parents.slice();
      })
    );

    this.taskForm = new FormGroup(taskFormGroup);

    this.taskForm.statusChanges.subscribe(
      (status: string) => (this.primaryDisable = status !== "VALID")
    );
  }

  _filterParentTasks(val: string) {
    const filterValue: string = val.toLowerCase();
    let parentTask: string;
    return this.parents.filter(({ parentTaskName }: ParentTask) => {
      parentTask = parentTaskName || "";
      return parentTask.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  processTaskForm(taskFormObj: Task) {
    const { endDate, startDate, parentTaskName: name } = taskFormObj;
    if (endDate && +endDate - +startDate < 0) {
      this._snackBar.open("Mentioned End Date is prior to Start Date");
      this.taskForm.get("endDate").setErrors({ validRange: false });
    } else {
      const parentTaskObj: ParentTask = this.parents.find(
        ({ parentTaskName }: ParentTask) => parentTaskName === name
      );
      const parentTaskId = parentTaskObj ? parentTaskObj.parentTaskId : -1;
      this.emitTask.emit(
        Object.assign(taskFormObj, {
          parentTaskId,
          parentTaskName: this.parentTaskName
        })
      );
      this.primaryDisable = true;
      this.secondaryDisable = true;
    }
  }
}
