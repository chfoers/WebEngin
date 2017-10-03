import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './shared/services/user.service';
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
  private messageToServer: string;
  //webSocket = new WebSocket('ws://localhost:8081');

  constructor(private router: Router, private userService: UserService,
    public snackBar: MdSnackBar, websocketService: WebsocketService) {
    this.socket = websocketService.createWebsocket();
  }

  ngOnInit() {
    this.socket.subscribe(
      message => {
        this.message = message.data
        this.snackBar.open(this.message, 'Schließen',  {
          duration: 2000,
        });
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

  sendMessage() {
    this.socket.next(this.messageToServer);
  }
  
/*
  socket.onmessage = function(event) {
    this.snackBar.open(event.data, {
          duration: 2000,
    });
  };

*/

}
