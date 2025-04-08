import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports:[RouterModule, CommonModule, FormsModule], 
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  constructor(private router: Router){}

  groupedTasks: any = {};
  showSuccessPopup: boolean = false;
  showDeletePopup: boolean = false;
  isDeleteModalOpen: boolean = false;
deleteTargetProjectKey: string | null = null;
deleteTargetTaskIndex: number | null = null;







  ngOnInit() {
    this.loadTasks();
    
    //  Listen for localStorage updates
    window.addEventListener('storage', () => {
      this.loadTasks();
    });
  }
  
  loadTasks() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');

    this.groupedTasks = {};

    projects.forEach((project: any) => {
      if (project.tasks && project.tasks.length > 0) {
        this.groupedTasks[project.title] = project.tasks;
      }
    });

    console.log('Grouped Tasks:', this.groupedTasks);
  }

  getTaskKeys(): string[] {
    return Object.keys(this.groupedTasks || {}); // Ensure it doesn't crash if groupedTasks is undefined
  }






  openDeleteModal(projectKey: string, taskIndex: number) {
    this.isDeleteModalOpen = true;
    this.deleteTargetProjectKey = projectKey;
    this.deleteTargetTaskIndex = taskIndex;
  }
  
  cancelDeleteTask() {
    this.isDeleteModalOpen = false;
    this.deleteTargetProjectKey = null;
    this.deleteTargetTaskIndex = null;
  }
  

  confirmDeleteTask() {
    if (this.deleteTargetProjectKey !== null && this.deleteTargetTaskIndex !== null) {
      const projectKey = this.deleteTargetProjectKey;
      const taskIndex = this.deleteTargetTaskIndex;
  
      if (this.groupedTasks[projectKey]) {
        this.groupedTasks[projectKey].splice(taskIndex, 1);
  
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projects.forEach((project: any) => {
          if (project.title === projectKey) {
            project.tasks = this.groupedTasks[projectKey];
          }
        });
  
        localStorage.setItem('projects', JSON.stringify(projects));
        this.groupedTasks = { ...this.groupedTasks };
  
        console.log(`🗑️ Task deleted from "${projectKey}".`);
  
        // Show delete success popup
        this.showDeletePopup = true;
        setTimeout(() => {
          this.showDeletePopup = false;
        }, 3000);
      }
    }
  
    this.cancelDeleteTask(); // Close modal and reset
  }
  










  deleteTask(projectKey: string, taskIndex: number) {
    if (this.groupedTasks[projectKey]) {
      this.groupedTasks[projectKey].splice(taskIndex, 1);
  
      // Update the projects in localStorage
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      projects.forEach((project: any) => {
        if (project.title === projectKey) {
          project.tasks = this.groupedTasks[projectKey];
        }
      });
  
      localStorage.setItem('projects', JSON.stringify(projects));
  
      // Refresh UI
      this.groupedTasks = { ...this.groupedTasks };
  
      //  Show delete popup
      this.showDeletePopup = true;
      setTimeout(() => {
        this.showDeletePopup = false;
      }, 3000);
  
      console.log(`🗑️ Task deleted from "${projectKey}".`, this.groupedTasks);
    }
  }
  




  editingProjectKey: string | null = null;
editingTaskIndex: number | null = null;

editTaskData: any = {
  title: '',
  assignedTo: '',
  status: '',
  estimate: 0,
  timeSpent: 0
};


isEditModalOpen: boolean = false;




editTask(projectKey: string, taskIndex: number) {
  if (!this.groupedTasks[projectKey] || this.groupedTasks[projectKey][taskIndex] === undefined) {
    console.warn(`⚠ Invalid task edit attempt for project: ${projectKey}, index: ${taskIndex}`);
    return;
  }

  this.editingProjectKey = projectKey;
  this.editingTaskIndex = taskIndex;
  this.editTaskData = { ...this.groupedTasks[projectKey][taskIndex] };

  console.log(` Editing Task:`, this.editTaskData);

  this.isEditModalOpen = true; //  Open the modal
}



updateTask() {
  if (!this.editingProjectKey || this.editingTaskIndex === null) {
    console.warn(" No task selected for update!");
    return;
  }

  const projectKey = this.editingProjectKey;
  this.groupedTasks[projectKey][this.editingTaskIndex] = { ...this.editTaskData };

  // Update in localStorage
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  projects.forEach((project: any) => {
    if (project.title === projectKey) {
      project.tasks = [...this.groupedTasks[projectKey]];
    }
  });

  localStorage.setItem('projects', JSON.stringify(projects));

  // Refresh the UI
  this.groupedTasks = { ...this.groupedTasks };

  // Close modal
  this.cancelEditTask();

  // 💥 Show success popup
  this.showSuccessPopup = true;
  setTimeout(() => {
    this.showSuccessPopup = false;
  }, 3000);

  console.log(`✅ Task updated in "${projectKey}".`, this.groupedTasks[projectKey]);
}



getStatusClass(status: string): string {
  switch (status) {
    case 'Pending':
      return 'status-pending';
    case 'In Progress':
      return 'status-in-progress';
    case 'Completed':
      return 'status-completed';
    default:
      return '';
  }
}











cancelEditTask() {
  this.isEditModalOpen = false;
  this.editingProjectKey = null;
  this.editingTaskIndex = null;
  this.editTaskData = { title: '', assignedTo: '', status: '' };
}
































}
