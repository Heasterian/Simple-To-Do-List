import { Injectable, EventEmitter } from '@angular/core';
import { TaskInterface, TaskList } from '../shared/interfaces/task-interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageService } from '../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  todoForm !: FormGroup;
  constructor(private fb: FormBuilder, private storageService: StorageService){  }

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
    this.storageService.saveData("TaskList", JSON.stringify(this.TaskList));
  };

  loadTask(description:string, done: boolean, taskType:string){
    const newTask: TaskInterface = {
      description:description,
      done:done
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
  loadLocalTaskList(){
    let json: TaskList = JSON.parse(this.storageService.getData("TaskList")!);
    json.daily.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "daily")});
    json.weekly.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "weekly")});
    json.monthly.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "monthly")});
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
    this.storageService.saveData("TaskList", JSON.stringify(this.TaskList));
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
    this.storageService.saveData("TaskList", JSON.stringify(this.TaskList));
  };
};
