import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TaskService } from 'src/app/services/task.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {
  constructor(private storageService: StorageService, private sanitizer: DomSanitizer, private taskService: TaskService, public dialog: MatDialog){};
  downloadJsonHref: SafeUrl = "";
  fileToUpload: File | null = null;
  fileContent: string = '';

  saveJson(){
    this.downloadJsonHref = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(JSON.stringify(this.storageService.getData("TaskList")!)));
  };

  deleteTaskList(){
    this.taskService.clearTaskList();
  };

  importJson(event: any){
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader;
    fileReader.onloadend = () => {
      let json = JSON.parse(fileReader.result as string)
      this.taskService.importTaskList(JSON.parse(json))
    };
    fileReader.readAsText(file);
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {this.deleteTaskList()};
    });
  }
    
};

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'cofirmation-dialog.html',
})
export class ConfirmationDialog {}


