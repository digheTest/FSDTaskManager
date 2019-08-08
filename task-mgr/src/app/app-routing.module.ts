import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateTaskComponent } from "./pages/create-task/create-task.component";
import { UpdateTaskComponent } from "./pages/update-task/update-task.component";
import { ViewTasksComponent } from "./pages/view-tasks/view-tasks.component";

const routes: Routes = [
  {
    path: "add",
    component: CreateTaskComponent
  },
  {
    path: "update/:taskId",
    component: UpdateTaskComponent
  },
  {
    path: "view",
    component: ViewTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
