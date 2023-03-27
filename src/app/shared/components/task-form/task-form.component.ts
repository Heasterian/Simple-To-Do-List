import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
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


  constructor(private fb: FormBuilder, private taskService: TaskService) {};
  @Output() task = new EventEmitter<string[]>()

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item : ['', Validators.required]
    });
    this.taskService.edit.subscribe(isEditEnabled => {this.isEditEnabled = isEditEnabled;});
};
    
  

  passTask(item: string, selectedType: string){
    item = this.todoForm.value.item;
    selectedType = this.selected;
    this.task.emit([item, selectedType]);
    this.todoForm.reset();
  };

  
  
  onEditTask(i:number, item: string, taskType: string){
    this.taskService.onEditTask(i, item, taskType);
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
    this.isEditEnabled = true;
  };
  updateTask(){
    this.taskService.updateTask(this.todoForm.value.item);
    this.todoForm.reset();
  };
}
