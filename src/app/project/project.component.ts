import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Needed for *ngFor, *ngIf
import { RouterModule, Router } from '@angular/router';  // Needed for navigation
import { CreateComponent } from '../create/create.component'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project', 
  standalone: true,
  imports: [RouterModule, CommonModule ,  FormsModule], 
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'] 
})
export class ProjectComponent implements OnInit {


  showSuccessPopup = false;

  showDeletedPopup = false;

  deleteConfirmationIndex: number | null = null;
  isDeletePopupVisible: boolean = false;
  


  projects: any[] = [];
  newTaskData: any = {}; 

  isTaskModalOpen = false;
  isModalOpen = false; // Track if the modal is open

  selectedProjectIndex: number | null = null;
  
  editingIndex: number | null = null;
  editProjectData: any = {
    title: '',
    description: '',
    createdBy: '',
    manager: '',
    startDate: '',
    endDate: '',
    teamMembers: '',
    dueDate: '',
    tasks: []
  };


  constructor(private router: Router) {}

  ngOnInit() {
    console.log(" Loading projects...");
    this.loadProjects();
    
    console.log(" Projects after loading:", this.projects);

  }

  loadProjects() {
  console.log(" Reloading projects from localStorage...");
  this.projects = JSON.parse(localStorage.getItem('projects') || '[]');

  console.log(" Updated projects list:", this.projects);

  // Debugging Line
  setTimeout(() => {
    console.log(" Is `projects` updating?", this.projects.length);
  }, 1000);
}









  
deleteProject(index: number) {
  this.projects.splice(index, 1);
  localStorage.setItem('projects', JSON.stringify(this.projects)); 
  console.log("🗑 Project deleted. Updated list:", this.projects);

  this.showDeletedPopup = true;
  setTimeout(() => {
    this.showDeletedPopup = false;
  }, 2000);
}



confirmDelete(index: number) {
  this.deleteConfirmationIndex = index;
  this.isDeletePopupVisible = true;
}

deleteProjectConfirmed() {
  if (this.deleteConfirmationIndex !== null) {
    this.deleteProject(this.deleteConfirmationIndex); // <— Call your original delete function!
  }
  this.cancelDelete();
}

cancelDelete() {
  this.deleteConfirmationIndex = null;
  this.isDeletePopupVisible = false;
}




  editProject(index: number) {
    this.editingIndex = index;  //  Store the index correctly
    this.editProjectData = { ...this.projects[index] }; 
    this.isModalOpen = true; 
  }
  
  
  updateProject() {
    if (this.editingIndex !== null) {
      this.projects[this.editingIndex] = { ...this.editProjectData };
      localStorage.setItem('projects', JSON.stringify(this.projects));
      this.projects = [...this.projects];
  
      // 🎉 Trigger the success popup here
      this.showSuccessPopup = true;
      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 2000);
    } else {
      console.warn("No project index set for update!");
    }
  
    this.cancelEdit(); // Close modal
  }
  

// Close the modal without saving
cancelEdit() {
  this.isModalOpen = false; // Close modal
  this.editingIndex = null;
  this.editProjectData = {
    title: '',
    description: '',
    createdBy: '',
    manager: '',
    startDate: '',
    endDate: '',
    teamMembers: '',
    dueDate: ''
  };
}

  toTasks(event: Event) {
    event.preventDefault();
    this.router.navigate(['/tasks']);
  }
 


  onProjectAdded(newProject: any) {
    this.projects.push(newProject); //  Instantly add the new project
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }


















  // Open Create Task Modal
  openTaskModal(index: null | number) {
    this.selectedProjectIndex = index;
    this.newTaskData = {
      title: '',
      assignedTo: '',
      status: 'Pending',
      assignedUser: '',
      estimate: '',
      timeSpent: ''
    };
    this.isTaskModalOpen = true;
  }








  createTask() {
    if (this.selectedProjectIndex !== null) {
      console.log("📝 Adding task to project:", this.projects[this.selectedProjectIndex]);
  
      // Ensure tasks array exists
      if (!this.projects[this.selectedProjectIndex].tasks) {
        this.projects[this.selectedProjectIndex].tasks = [];
      }
  
      this.projects[this.selectedProjectIndex].tasks.push({ ...this.newTaskData });
      
      console.log(" Task added:", this.newTaskData);
      console.log(" Updated project:", this.projects[this.selectedProjectIndex]);
  
      localStorage.setItem('projects', JSON.stringify(this.projects));
  
      // 🎉 Trigger popup here too
      this.showSuccessPopup = true;
      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 2000);
    }
  
    this.cancelTask(); // Close modal
  }
  













  // Cancel Task Creation
  cancelTask() {
    this.isTaskModalOpen = false;
    this.selectedProjectIndex = null;
  }








}
