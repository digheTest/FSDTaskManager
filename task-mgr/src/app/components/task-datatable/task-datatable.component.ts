import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";
import { TaskService } from "src/app/services/task.service";
import { Task } from "src/app/models/task";
import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { MatTableDataSource, MatSnackBar } from "@angular/material";
import { of } from "rxjs";

@Component({
  selector: "app-task-datatable",
  templateUrl: "./task-datatable.component.html",
  styleUrls: ["./task-datatable.component.scss"]
})
export class TaskDatatableComponent implements OnInit, OnChanges {
  allColumns: Array<string> = [
    "task",
    "parent",
    "priority",
    "startDate",
    "endDate",
    "actions"
  ];

  filterForm: FormGroup;

  filters = [];

  @Input() tasks: Array<Task>;

  @Output() refresh = new EventEmitter();

  dataSource = new MatTableDataSource();

  filterValues = {
    task: "",
    parentTask: "",
    priorityFrom: "",
    priorityTo: "",
    startDate: "",
    endDate: ""
  };

  constructor(
    private router: Router,
    private taskService: TaskService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnChanges() {
    if (this.tasks) {
      of(this.tasks).subscribe(tasks => (this.dataSource.data = tasks));
    }
  }

  ngOnInit() {
    const filterFormGroup = {
      task: new FormControl(),
      parentTask: new FormControl(),
      priorityFrom: new FormControl(),
      priorityTo: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl()
    };

    filterFormGroup.task.valueChanges.subscribe(task => {
      this.filterValues.task = task;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    filterFormGroup.parentTask.valueChanges.subscribe(parentTask => {
      this.filterValues.parentTask = parentTask;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    filterFormGroup.priorityFrom.valueChanges.subscribe(priorityFrom => {
      this.filterValues.priorityFrom = priorityFrom;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    filterFormGroup.priorityTo.valueChanges.subscribe(priorityTo => {
      this.filterValues.priorityTo = priorityTo;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    filterFormGroup.startDate.valueChanges.subscribe(startDate => {
      this.filterValues.startDate = startDate;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    filterFormGroup.endDate.valueChanges.subscribe(endDate => {
      this.filterValues.endDate = endDate;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.filterForm = new FormGroup(filterFormGroup);

    this.dataSource.filterPredicate = this.createFilter();
  }

  createFilter() {
    return (data, filter) => {
      const searchTerms = JSON.parse(filter);
      const taskCheck =
        data.taskName.toLowerCase().indexOf(searchTerms.task) !== -1;
      const parentTaskCheck =
        this.taskService
          .getParentTask(data.parentTaskId)
          .parentTaskName.toLowerCase()
          .indexOf(searchTerms.parentTask) !== -1;
      const priorityFromCheck = searchTerms.priorityFrom
        ? parseInt(data.priority) >= parseInt(searchTerms.priorityFrom)
        : true;
      const priorityToCheck = searchTerms.priorityTo
        ? parseInt(searchTerms.priorityTo) >= parseInt(data.priority)
        : true;
      const startDateCheck = searchTerms.startDate
        ? +new Date(searchTerms.startDate) - +data.startDate >= 0
        : true;
      const endDateCheck = searchTerms.endDate
        ? +data.endDate - +new Date(searchTerms.endDate) >= 0
        : true;

      return (
        taskCheck &&
        parentTaskCheck &&
        priorityFromCheck &&
        priorityToCheck &&
        startDateCheck &&
        endDateCheck
      );
    };
  }

  edit(task: Task) {
    this.router.navigate(["/update", task.taskId]);
  }

  endTask(task: Task) {
    this.taskService.endTask(task).subscribe(res => {
      this.refresh.emit(res);
      this._snackBar.open(
        `Task ${task.taskName} ended successfully!`,
        "Close",
        {
          duration: 3000
        }
      );
    });
  }

  getParentTask(parentTaskId: number) {
    return this.taskService.getParentTask(parentTaskId);
  }
}
