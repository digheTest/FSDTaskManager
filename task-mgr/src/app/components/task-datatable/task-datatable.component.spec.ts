import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDatatableComponent } from './task-datatable.component';

describe('TaskDatatableComponent', () => {
  let component: TaskDatatableComponent;
  let fixture: ComponentFixture<TaskDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
