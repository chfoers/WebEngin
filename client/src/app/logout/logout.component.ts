import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router, private userService: UserService, public snackBar: MdSnackBar) { }

  // Methode zum Ausloggen des aktuellen Users, entfernt das jwtToken aus den Cookies
  logout() {
    this.userService.logout().subscribe(
      data => { this.router.navigateByUrl(''); },
      error => {
        this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        });
      }
    );
  }
}
