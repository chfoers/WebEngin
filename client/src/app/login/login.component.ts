import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, AuthorisationData } from '../shared/services/user.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Enthält die Login-Daten des Users
  authorisationData: AuthorisationData = { email: '', password: '' }

  constructor(private router: Router, private userService: UserService, public snackBar: MdSnackBar) { }

  // Methode zum Einloggen eines Users, fügt ein jwtToken bei den Cookies hinzu
  login() {
    this.userService.login(this.authorisationData).subscribe(
      data => { this.router.navigateByUrl('todo/index'); },
      error => {
        this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        });
      }
    );
  }
}
