import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConfirmationDialog, SettingsComponent } from './components/settings/settings.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    TaskFormComponent,
    NavbarComponent,
    TaskListComponent,
    SettingsComponent,
    ConfirmationDialog
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    DragDropModule,
    MatDialogModule
  ],
  exports: [
    TaskFormComponent,
    NavbarComponent,
    TaskListComponent,
    SettingsComponent,
    ConfirmationDialog
  ]
})
export class SharedModule { 
}
