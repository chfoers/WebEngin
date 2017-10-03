import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './shared/services/user.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private router: Router, private userService: UserService, public snackBar: MdSnackBar) { }

  // Methode die Anhand des jwtTokens prüft, ob ein User eingeloggt ist
  authenticated() {
    return this.userService.isAuthenthicated();
  }

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