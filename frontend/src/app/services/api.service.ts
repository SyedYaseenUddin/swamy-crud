import { Injectable } from '@angular/core';
import { HttpService } from '../utility/http.service';
import { Observable } from 'rxjs';
import { FundTransferRequest, HistoryResponse, LoginRequest, LoginResponse, Lov, RegisterRequest, RegisterResponse, WalletResponse } from '../modals/dtos';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpService) {}

  public login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.authPost('login', loginRequest);
  }

  public register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.authPost('register', registerRequest);
  }

  public userDashboard():Observable<WalletResponse> {
    return this.http.get('user/dashboard');
  }
  public userBeneficiries():Observable<Lov[]> {
    return this.http.get('user/beneficiries');
  }
  public fundTransfer(fundTransferRequest: FundTransferRequest): Observable<any> {
    return this.http.post('transaction/fund-transfer',fundTransferRequest);
  }
  public transHistory(): Observable<HistoryResponse> {
    return this.http.get('user/history');
  }
}
