import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Needed for ngIf directive
import { FormsModule } from '@angular/forms';    // Needed for ngModel
import { Router ,RouterModule } from '@angular/router';        // Needed for routing

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  loginError: boolean = false;
  errorMessage: string = '';
  

  constructor(private router: Router) {}
  login(event: Event) {
    event.preventDefault();  // Prevent form submission
  
    console.log('Login button clicked');
  
    if (this.email === '' || this.password === '') {
      this.errorMessage = 'Please fill in both fields.';
      this.loginError = true;
      return;
    }
  
    if (this.email === 'user@example.com' && this.password === 'password123') {
      const user = {
        username: "Seri Yoon",
        email: "seri.yoon@gmail.com"
      };
  
      localStorage.setItem('user', JSON.stringify(user)); // Store full user object
      this.router.navigate(['/profile']).then(success => {
        console.log("Navigation Success:", success);
      }).catch(err => {
        console.error("Navigation Error:", err);
      });
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.'; // Show error message
      this.loginError = true;
    }
  }
  
  
  
}
