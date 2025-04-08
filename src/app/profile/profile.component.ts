import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
 encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
  user = {
    username: 'Seri Yoon',
    email: 'seri.yoon@gmail.com',
    profilePicture: '/public/profile1.jpg'
  };

  constructor(private router: Router) {}

  createproject(){
  this.router.navigate(['/create']).then(success => {
    console.log("Navigation Success:", success);
  }).catch(err => {
    console.error("Navigation Error:", err);
  });
  }
 

  logout() {
    localStorage.removeItem('user'); // Clear stored user data
    this.router.navigate(['/login']); // Redirect to login page
  }
  ngOnInit() {
    console.log("ngOnInit running");
  
    const storedUser = localStorage.getItem('user');
    console.log("Stored User:", storedUser);
  
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        console.log("Parsed User:", this.user);
      } catch (error) {
        console.error("JSON Parse Error:", error);
        localStorage.removeItem('user'); // Remove corrupted data
        this.router.navigate(['/login']); // Redirect to login
      }
    } else {
      this.router.navigate(['/login']); // Redirect if no user data
    }
  }
  
}
