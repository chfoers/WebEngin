import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from './shared/services/user.service';
import { MdSnackBar } from '@angular/material';
import { WebsocketService } from './shared/services/websocket.service';
import { Subject, Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  private socket: Subject<any>;
  private message: string;
  private uuid: string;
  private messageToServer: string;
  me: User;

  constructor(private router: Router, private userService: UserService,
    public snackBar: MdSnackBar, websocketService: WebsocketService) {
    this.socket = websocketService.createWebsocket();
  }

  ngOnInit() {
    this.socket.subscribe(
      message => {
        this.message = message.data;
        this.message = this.message.substring(1);
        this.message = this.message.substring(0, this.message.length - 1);
        this.uuid = this.message.substring(0, 36);
        this.message = this.message.substring(36, this.message.length);
        this.userService.getMe().subscribe(
          data => {
          this.me = data;
            if (this.me.userId === this.uuid) {
              this.snackBar.open(this.message, 'Schließen', {
                duration: 10000,
              });
            }
          },
          error => {
            this.snackBar.open(error, 'Schließen', {
              duration: 5000,
            });
          }
        );
      }
    );
  }


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
