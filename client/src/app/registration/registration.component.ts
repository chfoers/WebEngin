import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { UserService, User } from '../shared/services/user.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  user: User = { userId: '', name: '', email: '', password: '', password2: '' };

  constructor(private router: Router, private userService: UserService, public snackBar: MdSnackBar) { }

  registration() {
    this.userService.registration(this.user).subscribe(
      data => { this.router.navigateByUrl(''); },
      error => { this.snackBar.open(error, 'Schließen', {
        duration: 5000,
      }); }
    );
  }
}
