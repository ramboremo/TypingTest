import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// --- IMPORTANT FOR STANDALONE COMPONENTS ---
// We import the modules our component's template uses directly here.
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  // This 'imports' array makes FormsModule and RouterLink available
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  // We use an object to hold all the form data
  formData = {
    email: '',
    password: '',
    confirmPassword: '',
    birthday: ''
  };

  // Angular injects the HttpClient and Router for us to use
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * This function is called when the form is submitted
   */
  onSignup() {
    // Basic validation to check if passwords match
    if (this.formData.password !== this.formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // We send the form data to our backend API
    this.http.post<any>('/api/auth/signup', this.formData).subscribe({
      next: (response) => {
        // This runs on a successful signup
        console.log('Signup successful:', response);
        alert(response.msg); // Show success message
        // Navigate the user to the login page after successful signup
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // This runs if the backend returns an error
        console.error('Signup error:', err);
        // Show the specific error message from the backend (e.g., "User exists")
        alert(err.error.msg || 'An unknown error occurred.');
      }
    });
  }
}
