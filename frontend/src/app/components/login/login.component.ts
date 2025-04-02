import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest, LoginResponse } from '../../modals/dtos';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../utility/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login', // Selector for the login component
  imports: [RouterModule, ReactiveFormsModule, NgIf], // Modules imported for use in the component
  templateUrl: './login.component.html', // Path to the HTML template
  styleUrl: './login.component.css', // Path to the CSS file
})
export class LoginComponent {
  form!: FormGroup; // Form group for managing the login form
  loading: boolean = false; // Flag to indicate loading state

  constructor(private apiService: ApiService, private fb: FormBuilder, private userService: UserService) {
    this.initForm(); // Initialize the form on component creation
  }

  // Method to initialize the login form with validation
  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required], // Username field with required validation
      password: ['', Validators.required], // Password field with required validation
    });
  }

  // Method to handle form submission
  onSubmit() {
    if (this.form.valid) { // Check if the form is valid
      const formData = this.form.value as LoginRequest; // Cast form value to LoginRequest type
      this.loading = true; // Set loading to true while processing the request
      this.apiService.login(formData).subscribe({
        next: (response: LoginResponse) => {
          if (response.token) { // Check if the response contains a token
            this.userService.addToken(response.token); // Store the token in the user service for future use
          } else {
            // Throw an error if the token is not generated
            throw new HttpErrorResponse({ error: { error: "Token not generated" } });
          }
          this.loading = false; // Reset loading state
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false; // Reset loading state on error
          // Show an error alert using SweetAlert2
          Swal.fire({
            title: 'Error!',
            text: error?.error?.error || "Unable to login", // Display error message
            icon: 'error', // Error icon
          });
        }
      });
    }
  }
}
