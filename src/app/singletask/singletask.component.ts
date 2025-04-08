import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-singletask',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './singletask.component.html',
  styleUrls: ['./singletask.component.css']
})
export class SingletaskComponent implements OnInit {
  projectTitle: string = '';
  tasks: any[] = [];
  isEditModalOpen: boolean = false;
  editingTaskIndex: number | null = null;
  editTaskData: any = {
    title: '',
    assignedTo: '',
    status: '',
    estimate: '',
    timeSpent: ''
  };
  deleteIndex: number | null = null;
  showDeleteConfirm = false;
  showDeletedPopup = false;
  showUpdatedPopup = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectTitle = this.route.snapshot.paramMap.get('title') || '';
    this.loadTasks();
  }
  loadTasks() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const matchedProject = projects.find((proj: any) => proj.title === this.projectTitle);
    if (matchedProject && matchedProject.tasks) {
      this.tasks = matchedProject.tasks;
      this.applyStatusFilter();  // Apply initial filter
    } else {
      this.tasks = [];
      this.filteredTasks = [];
    }
  }
  
  // Handle Task Edit
  editTask(index: number) {
    this.editingTaskIndex = index;
    this.editTaskData = { ...this.tasks[index] }; // Clone the task data
    this.isEditModalOpen = true;
  }

  // Save Task after editing
  // updateTask() {
  //   if (this.editingTaskIndex !== null) {
  //     this.tasks[this.editingTaskIndex] = { ...this.editTaskData };
  //     this.saveTasksToLocalStorage();
  //     this.cancelEditTask(); // Close the modal
  //   }
  // }



  updateTask() {
    if (this.editingTaskIndex !== null) {
      this.tasks[this.editingTaskIndex] = { ...this.editTaskData };
      this.saveTasksToLocalStorage();
      this.cancelEditTask(); // Close the modal
  
      // Show the "Updated Successfully" popup
      this.showUpdatedPopup = true;
  
      // Hide the success popup after 3 seconds
      setTimeout(() => {
        this.showUpdatedPopup = false;
      }, 3000);
    }
  }
  



  // Close the edit modal
  cancelEditTask() {
    this.isEditModalOpen = false;
    this.editTaskData = { title: '', assignedTo: '', status: '', estimate: '', timeSpent: '' };
    this.editingTaskIndex = null;
  }

  // Show the delete confirmation popup
  // Show the delete confirmation popup
deleteTask(index: number) {
  this.deleteIndex = index;
  this.showDeleteConfirm = true;
}


  // Cancel the delete operation
  cancelDelete() {
    this.deleteIndex = null;
    this.showDeleteConfirm = false;
  }

  // Confirm the deletion
// Confirm the deletion
confirmDelete() {
  if (this.deleteIndex !== null) {
    // Delete the task from the tasks array
    this.tasks.splice(this.deleteIndex, 1);

    // Save the updated tasks to localStorage
    this.saveTasksToLocalStorage();

    // Close the delete confirmation popup
    this.showDeleteConfirm = false;

    // Show the deleted success popup
    this.showDeletedPopup = true;

    // Hide the success popup after 3 seconds
    setTimeout(() => {
      this.showDeletedPopup = false;
    }, 3000);
  }
}


  // Save updated tasks to localStorage
  saveTasksToLocalStorage() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex((p: any) => p.title === this.projectTitle);
    if (projectIndex !== -1) {
      projects[projectIndex].tasks = this.tasks;
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }

  // Get status class for each task (for styling purposes)
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











  selectedStatusFilter: string = 'All';
filteredTasks: any[] = [];
showStatusFilter: boolean = false;

statusOptions = ['All', 'Pending', 'In Progress', 'Completed'];

// statusOptions: string[] = ['All', 'Pending', 'In Progress', 'Completed'];

applyStatusFilter() {
  if (this.selectedStatusFilter === 'All') {
    this.filteredTasks = [...this.tasks];
  } else {
    this.filteredTasks = this.tasks.filter(task => task.status === this.selectedStatusFilter);
  }
}




toggleStatusFilterDropdown() {
  this.showStatusFilter = !this.showStatusFilter;
}



  
}
