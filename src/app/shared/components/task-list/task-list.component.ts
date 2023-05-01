import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { TaskInterface } from 'src/app/shared/interfaces/task-interface';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TaskListComponent {
  list!: keyof typeof this.TaskList;
  TaskList = this.taskService.TaskList;
  daily!: TaskInterface[];
  weekly!: TaskInterface[];
  monthly!: TaskInterface[];
  isEditEnabled: boolean = false;
  selected: string = 'daily';
  isEditEnabledAsync = this.taskService.edit;

  constructor(
    private taskService: TaskService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.taskService.loadLocalTaskList();
  }

  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.taskService.sortTask(this.TaskList);
    this.storageService.saveData('TaskList', JSON.stringify(this.TaskList));
  }

  deleteTask(i: number, taskType: keyof typeof this.taskService.TaskList) {
    this.taskService.deleteTask(i, taskType);
  }

  onEditTask(
    i: number,
    item: string,
    taskType: keyof typeof this.taskService.TaskList
  ) {
    this.taskService.onEditTask(i, item, taskType);
  }

  swapTaskStatus(taskType: keyof typeof this.taskService.TaskList, i: number) {
    this.taskService.swapTaskStatus(taskType, i);
  }
  resetAllTasksStatus(taskType: keyof typeof this.taskService.TaskList) {
    this.taskService.resetAllTaskStatus(taskType);
  }

  trackByTask: TrackByFunction<TaskInterface[]> = (id, item) => item[id];
}
