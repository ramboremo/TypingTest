import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// --- IMPORTANT FOR STANDALONE COMPONENTS ---
// We must import the modules our component's template uses directly here.
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  // This 'imports' array makes FormsModule (for ngModel) and RouterLink available
  imports: [FormsModule, CommonModule, RouterLink], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // These variables are linked to the input fields by [(ngModel)]
  email = '';
  password = '';

  // This is dependency injection. Angular provides us with an HttpClient and Router.
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * This function is called when the form is submitted, thanks to (ngSubmit)="onLogin()"
   */
  onLogin() {
    // A simple check to make sure fields are not empty before sending.
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    const credentials = { email: this.email, password: this.password };
    
    // We use the HttpClient to send a POST request to our backend API.
    this.http.post<any>('/api/auth/login', credentials).subscribe({
      next: (response) => {
        // This code runs if the login is successful (status 200)
        console.log('Login successful:', response);
        localStorage.setItem('userEmail', response.email); // Save user email
        // We use the Angular Router to navigate to the next page.
        this.router.navigate(['/test']); 
      },
      error: (err) => {
        // This code runs if the backend returns an error (like 400 for invalid credentials)
        console.error('Login error:', err);
        // We show the error message from the backend.
        alert(err.error.msg || 'An unknown error occurred. Please try again.');
      }
    });
  }
}

