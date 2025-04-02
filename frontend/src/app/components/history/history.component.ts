import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HistoryResponse, TransactionResponse } from '../../modals/dtos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {

  historyDetails!: HistoryResponse;
  transactions: TransactionResponse[] = [];

  constructor(private apiService: ApiService) {}


  ngOnInit(): void {
    this.getUserHistory();
  }

  getUserHistory() {
    this.apiService.transHistory().subscribe({
      next: (data: HistoryResponse) => {
        this.historyDetails = data;
        if (this.historyDetails.transaction) {
          this.transactions = this.historyDetails.transaction;
          debugger
        }
      },
      error: (err) => {
      console.error('Error fetching transaction history:', err);
      },
      complete: () => {
      }
    });
  }

}
