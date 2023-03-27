import { Injectable, Output, EventEmitter } from '@angular/core';
import { TaskInterface, TaskList } from '../shared/interfaces/task-interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { ɵafterNextNavigation } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  todoForm !: FormGroup;
  constructor(private fb: FormBuilder){  }

  public TaskList: TaskList = {
    daily: [],
    weekly: [],
    monthly: [],
  };

  daily: TaskInterface[] = this.TaskList.daily;
  weekly: TaskInterface[] = this.TaskList.weekly;
  monthly: TaskInterface[] = this.TaskList.monthly;
  updateIndex!: number;
  updateType!: string;
  item: string = '';

  public edit = new EventEmitter<boolean>();

  addTask(description:string, taskType:string){
    const newTask: TaskInterface = {
      description:description,
      done:false
    }
    switch(taskType){
      case "monthly":
        this.monthly.push(newTask);
        break;
      case "daily":
        this.daily.push(newTask);
        break;
      case "weekly":
        this.weekly.push(newTask);
        break;
    };
  };

  getTasks(): TaskList {
    return this.TaskList;
  };

  deleteTask(i: number, taskType: string){
    switch(taskType){
      case "monthly":
        this.monthly.splice(i, 1);
        break;
      case "daily":
        this.daily.splice(i, 1);
        break;
      case "weekly":
        this.weekly.splice(i, 1);
        break;
    };
  };
  
  onEditTask(i:number, item: string, taskType: string){
    this.item = item;
    this.updateType = taskType;
    this.updateIndex = i;
    this.edit.emit(true);
  };
  updateTask(description: string){
    switch(this.updateType){
      case "monthly":
        this.monthly[this.updateIndex].description = description;
        break;
      case "daily":
        this.daily[this.updateIndex].description = description;
        break;
      case "weekly":
        this.weekly[this.updateIndex].description = description;
        break;
    };
    this.edit.emit(false);
  };
};
