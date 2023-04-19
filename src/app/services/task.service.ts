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
  counter: number = 0;

  public edit = new EventEmitter<boolean>();
  public itemDescription = new EventEmitter<string>();

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
    this.sortTask(this.TaskList);
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
    this.sortTask(this.TaskList);
  };
  loadLocalTaskList(){
     if (this.counter === 0) {
      let json: TaskList = JSON.parse(this.storageService.getData("TaskList")!);
      json.daily.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "daily")});
      json.weekly.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "weekly")});
      json.monthly.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "monthly")});
      this.counter ++;
     }
  };

  importTaskList(json: TaskList){
    json.daily?.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "daily")});
    json.weekly?.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "weekly")});
    json.monthly?.forEach((element: TaskInterface) => {this.loadTask(element.description, element.done, "monthly")});
    this.storageService.saveData("TaskList", JSON.stringify(this.TaskList));
    this.sortTask(this.TaskList);
  }

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
    this.sortTask(this.TaskList);
    this.storageService.saveData("TaskList", JSON.stringify(this.TaskList));
  };
  
  clearTaskList(){
    this.storageService.saveData("TaskList", "{\"daily\":[],\"weekly\":[],\"monthly\":[]}");
    this.daily.splice(0)
    this.weekly.splice(0)
    this.monthly.splice(0)
  };
  
  onEditTask(i:number, item: string, taskType: string){
    this.item = item;
    this.updateType = taskType;
    this.updateIndex = i;
    this.edit.emit(true);
    this.itemDescription.emit(item);
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
    this.sortTask(this.TaskList);
    this.storageService.saveData("TaskList", JSON.stringify(this.TaskList));
  };

  sortTask(TaskList: TaskList) {
    TaskList.daily.sort((a, b) => a.done as unknown as number - (b.done as unknown as number));
    TaskList.weekly.sort((a, b) => a.done as unknown as number - (b.done as unknown as number));
    TaskList.monthly.sort((a, b) => a.done as unknown as number - (b.done as unknown as number));
  }

  swapTaskStatus(updateType:string, updateIndex: number){
    switch(updateType){
      case "monthly":
        this.monthly[updateIndex].done = !this.monthly[updateIndex].done;
        break;
      case "daily":
        this.daily[updateIndex].done = !this.daily[updateIndex].done;
        break;
      case "weekly":
        this.weekly[updateIndex].done = !this.weekly[updateIndex].done;
        break;
    };
    this.sortTask(this.TaskList);
    this.storageService.saveData("TaskList", JSON.stringify(this.TaskList));
  };

  resetAllTaskStatus(updateType:string){
    switch(updateType){
      case "monthly":
        this.monthly.forEach((element: TaskInterface) => {element.done = false});
        break;
      case "daily":
        this.daily.forEach((element: TaskInterface) => {element.done = false});
        break;
      case "weekly":
        this.weekly.forEach((element: TaskInterface) => {element.done = false});
        break;
    };
    this.sortTask(this.TaskList);
    this.storageService.saveData("TaskList", JSON.stringify(this.TaskList));
  };
};
