import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FundTransferRequest, Lov } from '../../modals/dtos';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transfer-amount',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transfer-amount.component.html',
  styleUrl: './transfer-amount.component.css'
})
export class TransferAmountComponent implements OnInit {

  beneficiaryList: Lov[] = [];
  loading: boolean = true;

  form!: FormGroup;
  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getBeneficiries();
  }



    initForm() {
      this.form = this.fb.group({
        beneficiary: ['', Validators.required],
        amount: [
          '',
          [
        Validators.required,
        Validators.pattern('^[0-9]+(\\.[0-9]+)?$'),
        Validators.min(0.01)
          ]
        ]
      });
    }

  getBeneficiries() {
    this.apiService.userBeneficiries().subscribe({
      next: (res: Lov[]) => {
        this.beneficiaryList = res;
      },
      error: (error) => {}
    })
  }

  onSubmit() {
    if (this.form.valid) {
        const transferData = this.form.value as FundTransferRequest;
        this.loading = true;
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to proceed with the transfer?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, transfer it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.apiService.fundTransfer(transferData).subscribe({
              next: (response) => {
                if (response?.status === 1) {
                  Swal.fire('Success', 'The transfer was successful!', 'success');
                }
                this.loading = false
                this.form.reset();
                this.form.markAsUntouched();
                this.form.markAsPristine();
                this.initForm();
              },
              error: (error) => {
                Swal.fire('Error', error?.error?.error || 'Unable to transfer fund', 'error');
                this.loading = false;
              }
            });
          }
        });
    }
  }

}
