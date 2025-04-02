import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { WalletResponse } from '../../modals/dtos';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  dashboardData!: WalletResponse;
  positiveTransactions: number[] = [1,3,4,7]
  negativeTransactions: number[] = [2,5,6]
  

  constructor(private apiService: ApiService) {
    
  }
  
  
  ngOnInit(): void {
    this.getUserDashboard();
  }

  getUserDashboard() {
    this.apiService.userDashboard().subscribe({
      next: (data: WalletResponse) => {
        this.dashboardData = data;
      },
      error: () => {}
    })
  }

}
