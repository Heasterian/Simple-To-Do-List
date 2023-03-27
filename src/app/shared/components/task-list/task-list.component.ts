import { Component } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskInterface } from 'src/app/shared/interfaces/task-interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  TaskList = this.taskService.TaskList;
  daily!: TaskInterface[];
  weekly!: TaskInterface[];
  monthly!: TaskInterface[];
  isEditEnabled: boolean = false;
  selected: string = 'daily';

  constructor(private taskService: TaskService) {};

  ngOnInit(): void {
      this.daily =  this.taskService.TaskList.daily;
      this.weekly = this.taskService.TaskList.weekly;
      this.monthly = this.taskService.TaskList.monthly;
      this.taskService.edit.subscribe(isEditEnabled => {this.isEditEnabled = isEditEnabled;});
  };
  
  
  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    };
  };

  addTask(task: string[]){
    const description = task[0];
    const taskType = task[1];
    this.taskService.addTask(description, taskType);
  };

  deleteTask(i: number, taskType: string) {
    this.taskService.deleteTask(i, taskType);
  };
  
  onEditTask(i:number, item: string, taskType: string){
    this.taskService.onEditTask(i, item, taskType);
  };

  printJson(){
    JSON.stringify(this.TaskList);
  }
}
