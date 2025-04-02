import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest, RegisterResponse } from '../../modals/dtos';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.intiForm();
  }

  intiForm() {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'), // Only text, no numbers
          Validators.maxLength(30), // Less than 30 characters
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'), // Only text, no numbers
          Validators.maxLength(30), // Less than 30 characters
        ],
      ],
      username: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email, // Validate email format
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // At least 8 characters
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[#@$*\\-]).+$'), // At least 1 uppercase, 1 lowercase, and 1 special character
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registerUser = this.registerForm.value as RegisterRequest;
      if (registerUser.password != registerUser.confirmPassword) {
        Swal.fire({
          title: 'Error!',
          text: 'passowrd and confirm password must be same',
          icon: 'error',
        });
        return;
      }
      this.loading = true;
      this.apiService.register(registerUser).subscribe({
        next: (res: RegisterResponse) => {
          if (res?.status === 1) {
            this.router.navigate(['/login']);
          } else {
            throw new HttpErrorResponse({ error: { error: "User not registered" } });
          }
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          Swal.fire({
            title: 'Error!',
            text: error?.error?.error || 'Unable to register',
            icon: 'error',
          });
        },
      });
    }
  }
}
