import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './shared/components/settings/settings.component';

const routes: Routes = [
  {path:'', 
  loadChildren: () => import('./todo/todo.module').then(m => m.TodoModule),},
  {path:'settings', component: SettingsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
