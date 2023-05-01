import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TaskService } from 'src/app/services/task.service';
import { TaskInterface } from 'src/app/shared/interfaces/task-interface';

@UntilDestroy()
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  todoForm: FormGroup = this.fb.group({
    item: ['', Validators.required],
  });
  selected: keyof typeof this.taskService.TaskList = 'daily';
  daily!: TaskInterface[];
  weekly!: TaskInterface[];
  monthly!: TaskInterface[];
  item: string = '';
  itemDescription!: string;
  isEditEnabledAsync = this.taskService.edit;

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit(): void {
    this._pushToEdit();
  }

  passTask(item: string, selectedType: keyof typeof this.taskService.TaskList) {
    item = this.todoForm.value.item;
    selectedType = this.selected;
    this.taskService.addTask(item, selectedType);
    this.todoForm.reset();
  }

  onEditTask(
    i: number,
    item: string,
    taskType: keyof typeof this.taskService.TaskList
  ) {
    this.todoForm.controls['item'].setValue(
      this.taskService.TaskList[taskType][this.taskService.updateIndex]
        .description
    );
    this.taskService.onEditTask(i, item, taskType);
    this.taskService.setEdit(true);
  }
  updateTask() {
    const description = this.todoForm.getRawValue().item;
    this.taskService.updateTask(description);
    this.todoForm.reset();
  }

  private _pushToEdit() {
    this.taskService.itemDescription
      .pipe(untilDestroyed(this))
      .subscribe((itemDescription) => {
        this.todoForm.controls['item'].setValue(itemDescription);
      });
  }
}
