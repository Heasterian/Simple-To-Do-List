import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TaskService } from 'src/app/services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../../interfaces/confirm-dialog-data';

@UntilDestroy()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  downloadJsonHref!: SafeUrl;
  fileToUpload: File | null = null;
  fileContent = '';

  constructor(
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private taskService: TaskService,
    public dialog: MatDialog
  ) {}

  saveJson() {
    const taskList = JSON.stringify(this.storageService.getData('TaskList'));
    this.downloadJsonHref = this.sanitizer.bypassSecurityTrustUrl(
      `data:text/json;charset=UTF-8,${encodeURIComponent(taskList)}`
    );
  }

  deleteTaskList() {
    this.taskService.clearTaskList();
  }

  importJson(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const json = JSON.parse(fileReader.result as string);
      this.taskService.importTaskList(JSON.parse(json));
    };
    fileReader.readAsText(file);
  }

  openDialog() {
    const message = `Are you sure you want delete all tasks?\r\nYou won't be able to recover your tasks if you didn't exported them` ;
    const title = 'Confirm Action';
    const newData: ConfirmDialogData = {
      title: title,
      message: message,
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: newData,
    });
    dialogRef
      .afterClosed()
      .pipe(filter(Boolean), untilDestroyed(this))
      .subscribe((result) => this.deleteTaskList());
  }
}
