import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, AuthorisationData } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authorisationData: AuthorisationData = { email: '', password: '' }
  notification = { error: ''};

  constructor(private router: Router, private userService: UserService) {}

  login() {
    this.notification.error = ''; 
    this.userService.login(this.authorisationData).subscribe(
      data => { this.router.navigateByUrl('todo/index'); },
      error => { this.notification.error = error; }
    );
  }
}
