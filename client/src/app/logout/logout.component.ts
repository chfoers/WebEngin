import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent{
  notification = { error: ''};
  constructor(private router: Router, private userService: UserService) {}

  logout() {
    this.notification.error = ''; 
    this.userService.logout().subscribe(
      data => { this.router.navigateByUrl(''); },
      error => { this.notification.error = error; }
    );
  }
}
