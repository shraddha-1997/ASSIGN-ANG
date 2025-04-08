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
    this.loadProjects(); // or however you load
    this.filteredProjects = this.projects;
  }




  viewTasks(projectTitle: string) {
    this.router.navigate(['/singletask', projectTitle]);
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

  // 🔥 Refresh filtered projects
  this.searchProjects();

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
  
      // 🔥 Keep filtered list fresh
      this.searchProjects();
  
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
      if (!this.projects[this.selectedProjectIndex].tasks) {
        this.projects[this.selectedProjectIndex].tasks = [];
      }
  
      this.projects[this.selectedProjectIndex].tasks.push({ ...this.newTaskData });
      localStorage.setItem('projects', JSON.stringify(this.projects));
  
      // Refresh view 🧼
      this.searchProjects();
  
      this.showSuccessPopup = true;
      setTimeout(() => {
        this.showSuccessPopup = false;
      }, 2000);
    }
  
    this.cancelTask();
  }
  






  // Cancel Task Creation
  cancelTask() {
    this.isTaskModalOpen = false;
    this.selectedProjectIndex = null;
  }





  // Add these variables in your component
currentPage: number = 1;
pageSize: number = 10;  // Adjust page size as needed



// Pagination methods
prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage() {
  if (this.currentPage < this.getTotalPages()) {
    this.currentPage++;
  }
}

getTotalPages() {
  return Math.max(1, Math.ceil(this.projects.length / this.pageSize));
}









searchQuery: string = '';
filteredProjects: any[] = [];

searchProjects() {
  const query = this.searchQuery.toLowerCase().trim();
  this.filteredProjects = this.projects.filter(project =>
    project.title.toLowerCase().includes(query) ||
    project.description.toLowerCase().includes(query) ||
    project.manager.toLowerCase().includes(query) ||
    (project.createdBy && project.createdBy.toLowerCase().includes(query)) ||
    (project.teamMember && project.teamMember.toLowerCase().includes(query))
  );
  this.currentPage = 1; // Reset to page 1 after search
}

get paginatedProjects() {
  
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.filteredProjects.slice(start, end);
}




sortDirection: 'asc' | 'desc' = 'asc';

sortByTitle() {
  this.filteredProjects.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (this.sortDirection === 'asc') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });

  // Toggle the direction
  this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
}





}
