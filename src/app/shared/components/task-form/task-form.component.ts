import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { TaskInterface } from 'src/app/shared/interfaces/task-interface';


@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  todoForm !: FormGroup;
  selected: string = 'daily';
  daily!: TaskInterface[];
  weekly!: TaskInterface[];
  monthly!: TaskInterface[];
  item :string = '';
  isEditEnabled: boolean = false;
  itemDescription!: string;
  private signal$ = new Subject();


  constructor(private fb: FormBuilder, private taskService: TaskService) {};

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item : ['', Validators.required]
    });
    this.taskService.edit.pipe(takeUntil(this.signal$)).subscribe(isEditEnabled => {this.isEditEnabled = isEditEnabled;});
    this.taskService.itemDescription.pipe(takeUntil(this.signal$)).subscribe(itemDescription => {this.todoForm.controls["item"].setValue(itemDescription)});
};
    
  

  passTask(item: string, selectedType: string){
    item = this.todoForm.value.item;
    selectedType = this.selected;
    this.taskService.addTask(item, selectedType);
    this.todoForm.reset();
  };

  
  
  onEditTask(i:number, item: string, taskType: string){
    switch(taskType){
      case "monthly":
        this.todoForm.controls["item"].setValue(this.monthly[this.taskService.updateIndex].description);
        break;
      case "daily":
        this.todoForm.controls['item'].setValue(this.daily[this.taskService.updateIndex].description);
        break;
      case "weekly":
        this.todoForm.controls['item'].setValue(this.weekly[this.taskService.updateIndex].description); 
        break;
    };
    this.taskService.onEditTask(i, item, taskType);
    this.isEditEnabled = true;
  };
  updateTask(){
    this.taskService.updateTask(this.todoForm.value.item);
    this.todoForm.reset();
  };

  ngOnDestroy(){
    this.signal$.next;
    this.signal$.complete();
  };
}
