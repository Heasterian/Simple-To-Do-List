import { Injectable } from '@angular/core';
import { TaskInterface, TaskList } from '../shared/interfaces/task-interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageService } from '../shared/services/storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  todoForm!: FormGroup;

  TaskList: TaskList = {
    daily: [],
    weekly: [],
    monthly: [],
  };

  daily: TaskInterface[] = this.TaskList.daily;
  weekly: TaskInterface[] = this.TaskList.weekly;
  monthly: TaskInterface[] = this.TaskList.monthly;
  updateIndex!: number;
  updateType!: keyof typeof this.TaskList;
  item: string = '';
  counter: number = 0;

  _edit$ = new BehaviorSubject<boolean>(false);
  edit = this._edit$.asObservable();
  _itemDescription$ = new BehaviorSubject<string>('');
  itemDescription = this._itemDescription$.asObservable();

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService
  ) {}

  setEdit(edit: boolean) {
    this._edit$.next(edit);
  }

  setItemDescription(description: string) {
    this._itemDescription$.next(description);
  }

  addTask(description: string, taskType: keyof typeof this.TaskList) {
    const newTask: TaskInterface = {
      description: description,
      done: false,
    };
    this.TaskList[taskType].push(newTask);
    this.sortTask(this.TaskList);
    this.storageService.saveData('TaskList', JSON.stringify(this.TaskList));
  }

  loadTask(
    description: string,
    done: boolean,
    taskType: keyof typeof this.TaskList
  ) {
    const newTask: TaskInterface = {
      description: description,
      done: done,
    };
    this.TaskList[taskType].push(newTask);
    this.sortTask(this.TaskList);
  }
  loadLocalTaskList() {
    if (this.counter === 0) {
      const json: TaskList = JSON.parse(
        this.storageService.getData('TaskList')!
      );
      let key: keyof typeof json;
      for (key in json) {
        json[key].forEach((element: TaskInterface) => {
          this.loadTask(element.description, element.done, key);
        });
      }
      this.counter++;
    }
  }

  importTaskList(json: TaskList) {
    let key: keyof typeof json;
    for (key in json) {
      json[key]?.forEach((element: TaskInterface) => {
        this.loadTask(element.description, element.done, key);
      });
    }
    this.storageService.saveData('TaskList', JSON.stringify(this.TaskList));
    this.sortTask(this.TaskList);
  }

  getTasks(): TaskList {
    return this.TaskList;
  }

  deleteTask(i: number, taskType: keyof typeof this.TaskList) {
    this.TaskList[taskType].splice(i, 1);
    this.sortTask(this.TaskList);
    this.storageService.saveData('TaskList', JSON.stringify(this.TaskList));
  }

  clearTaskList() {
    this.storageService.saveData(
      'TaskList',
      '{"daily":[],"weekly":[],"monthly":[]}'
    );
    let key: keyof typeof this.TaskList;
    for (key in this.TaskList) {
      this.TaskList[key].splice(0);
    }
  }

  onEditTask(i: number, item: string, taskType: keyof typeof this.TaskList) {
    this.item = item;
    this.updateType = taskType;
    this.updateIndex = i;
    this.setEdit(true);
    this.setItemDescription(item);
  }

  updateTask(description: string) {
    this.TaskList[this.updateType][this.updateIndex].description = description;
    this.setEdit(false);
    this.sortTask(this.TaskList);
    this.storageService.saveData('TaskList', JSON.stringify(this.TaskList));
  }

  sortTask(TaskList: TaskList) {
    let key: keyof typeof this.TaskList;
    for (key in TaskList) {
      TaskList[key].sort(
        (a, b) => (a.done as unknown as number) - (b.done as unknown as number)
      );
    }
  }

  swapTaskStatus(taskType: keyof typeof this.TaskList, updateIndex: number) {
    this.TaskList[taskType][updateIndex].done =
      !this.TaskList[taskType][updateIndex].done;
    this.sortTask(this.TaskList);
    this.storageService.saveData('TaskList', JSON.stringify(this.TaskList));
  }

  resetAllTaskStatus(taskType: keyof typeof this.TaskList) {
    this.TaskList[taskType].forEach((element: TaskInterface) => {
      element.done = false;
    });
    this.sortTask(this.TaskList);
    this.storageService.saveData('TaskList', JSON.stringify(this.TaskList));
  }
}