import { Component, OnInit } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserService } from '../../utility/user.service';
import { User } from '../../modals/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [BsDropdownModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {

  profileText: string = 'U';
  userDetails: User | null;

  constructor(private userService: UserService) {
    this.userDetails = this.userService.getUserDetails();

  }


  ngOnInit(): void {
    this.setProfileText();
  }

  setProfileText() {
    if (this.userDetails?.username) {
      this.profileText = this.userDetails?.username.charAt(0).toUpperCase()
    }
  }


  onLogout() {
    this.userService.logout();
  }

}
