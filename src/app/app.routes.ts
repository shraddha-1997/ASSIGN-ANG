// import { Routes } from '@angular/router';

// export const routes: Routes = [];
import { Routes } from '@angular/router';  // Import Routes type
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectComponent } from './project/project.component';
import { CreateComponent } from './create/create.component';
import { TasksComponent } from './tasks/tasks.component';

// Declare the routes array and export it
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route to login   
  { path: 'login', component: LoginComponent },  // Login route
  { path: 'profile', component: ProfileComponent },  // Profile route
  { path: 'create', component: CreateComponent },
  { path: 'project', component:ProjectComponent },   //Project Component rout
  { path: 'tasks', component: TasksComponent},
];
