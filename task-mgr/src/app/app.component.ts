import { Component, OnInit } from "@angular/core";
import { NavLink } from "./models/nav-link";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title: string = "task-mgr";
  navLinks: Array<NavLink> = [
    {
      path: ["/view"],
      label: "View Tasks"
    },
    {
      path: ["/add"],
      label: "Add Task"
    }
  ];
  activeLink: Array<string>;
}
