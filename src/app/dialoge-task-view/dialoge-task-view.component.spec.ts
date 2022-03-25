import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogeTaskViewComponent } from './dialoge-task-view.component';

describe('DialogeTaskViewComponent', () => {
  let component: DialogeTaskViewComponent;
  let fixture: ComponentFixture<DialogeTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogeTaskViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogeTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
