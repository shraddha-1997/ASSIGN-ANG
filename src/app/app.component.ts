import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ASSIGN-ANG';

  isDarkMode: boolean = false;

  ngOnInit(): void {
    // Check if the theme is already saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode'); // Apply dark mode globally
    } else {
      this.isDarkMode = false;
      document.body.classList.remove('dark-mode'); // Default to light mode
    }
  }

  // Toggle dark mode on and off
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode'); // Add dark mode class to body
      localStorage.setItem('theme', 'dark'); // Save theme preference
    } else {
      document.body.classList.remove('dark-mode'); // Remove dark mode class from body
      localStorage.setItem('theme', 'light'); // Save theme preference
    }
  }
}