import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { TaskService } from '../../services/task.service';
import { TaskInterface } from '../../shared/interfaces/task-interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {
  todoForm!: FormGroup;
  TaskList = this.taskService.TaskList;
  daily!: TaskInterface[];
  weekly!: TaskInterface[];
  monthly!: TaskInterface[];
  isEditEnabled: boolean = false;
  selected: string = 'daily';

  constructor(private fb: FormBuilder, private taskService: TaskService) {};

  addTask(task: string[]){
    const description = task[0];
    const taskType = task[1];
    this.taskService.addTask(description, taskType);
    this.todoForm.reset();
  };
}
