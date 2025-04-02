import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../modals/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly storage = localStorage;
  private user!: User | null

  constructor(private router: Router) {
    const token = this.storage.getItem('token') 
    if (!this.user && token) {
      this.setUserDetails(jwtDecode(token) as User);
    }
  }

  addToken(token: string) {
    this.storage.setItem('token', token);
    this.setUserDetails(jwtDecode(token) as User);
    this.router.navigate(['/'])
  }
  
  logout() {
    this.storage.removeItem('token');
    this.router.navigate(['/login'])
  }

  private setUserDetails(userDetail: User | null) {
    this.user = userDetail;
  }

  public getUserDetails () {
   return this.user;
  }

}
