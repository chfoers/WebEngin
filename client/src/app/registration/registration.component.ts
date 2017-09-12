import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { UserService, User } from '../shared/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  user: User = { name: '', email: '', password: '', password2: '' };
  notification = { error: '' };

  constructor(private router: Router, private userService: UserService) { }

  registration() {
    this.notification.error = ''; 
    this.userService.registration(this.user).subscribe(
      data => { this.router.navigateByUrl(''); },
      error => { this.notification.error = error; }
    );
  }
}
