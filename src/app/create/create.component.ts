import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  @Output()projectSaved = new EventEmitter<void>();


  constructor(private router: Router) {}
toProjectsList(event: Event) {
  event.preventDefault(); // Prevent default anchor behavior
  this.router.navigate(['/project']); // Redirect to the Projects page
}

  


  project = {
    title: '',
    description: '',
    createdBy: '',
    manager: '',
    startDate: '',
    endDate: '',
    teamMembers: '',
    dueDate: ''
  };


  saveProject(event: Event) {
    event.preventDefault();  // prevents the form submission warning
    
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    if (!Array.isArray(projects)) {
      projects = [];  
    }
  
    projects.push({ ...this.project });  // Save a copy, not a reference
    localStorage.setItem('projects', JSON.stringify(projects));
  
    console.log("Project saved successfully!", projects);
  
    this.resetForm(); // Clears form after saving
  
    this.projectSaved.emit(); //Notify parent component

      this.onlist();
  }
  
  


  resetForm() {
    this.project = {
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


  onlist(){
    this.router.navigate(['/project']);
  }

  toTasks(event: Event) {
    event.preventDefault();
    this.router.navigate(['/tasks']);
  }
  

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
  

}
 