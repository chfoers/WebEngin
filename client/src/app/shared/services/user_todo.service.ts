import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';
import { TodoService, Todo } from './todo.service';
import { ContactService, User } from './contact.service';
import { UserService } from './user.service';
import { MdSnackBar } from '@angular/material';

import { User_Todo } from '../models/user_todo.model';
export { User_Todo } from '../models/user_todo.model';


@Injectable()
export class User_TodoService implements OnInit {
    // URL zum Aufrufen des Servers
    private baseURL = 'http://' + window.location.hostname + ':8080';
    // Options in Form eines RequestOptions-Objekts
    private options: RequestOptions;
    private socket: Subject<any>;
    me: User;

    constructor(private http: Http, websocketService: WebsocketService,
        public todoService: TodoService, public contactService: ContactService,
        public userService: UserService, public snackBar: MdSnackBar) {
        this.options = new RequestOptions({
            headers: new Headers({ 'Content-Type': 'application/json' }),
            withCredentials: true
        });
        this.socket = websocketService.createWebsocket();
    }

    ngOnInit() {
        this.loadMe();
    }

    // Methode gibt das aktuelle jwtClaimSet des Users zurück
    loadMe() {
        this.userService.getMe().subscribe(
            data => { this.me = data; },
            error => {
                this.snackBar.open(error, 'Schließen', {
                    duration: 5000,
                });
            }
        );
    }

    // Methode zum Updaten eines user_todo-Objektes, wird verwendet um Aufgabe einem anderem User zuzuweisen
    updateUserTodo(user_todo: User_Todo) {
        const answer = this.http.put(this.baseURL + '/user_todos/update/', user_todo, this.options)
            .map((response: Response) => response.json().data)
            .catch(this.handleError);


        // Laden des Usernamens und des Kontaktes
        this.userService.getMe().subscribe(
            data => {
                this.me = data;

                const contact = this.contactService.getContact(user_todo.userId).map(response => response[0]);
                const todoTitle = this.todoService.getTodo(user_todo.todoId).map(response => response);
                const contactUserId = this.contactService.getContact(user_todo.userId).map(response => response[0].userId);

                // Senden der auszugebenen Nachricht an den Websocket
                Observable.forkJoin([contact, todoTitle, contactUserId]).subscribe(results => {
                    let senden = 'Du hast ';
                    let empfangen = 'Du hast ';

                    if (results[1] !== undefined) {
                        senden = senden + '\'' + results[1].title + '\'';
                        empfangen = empfangen + '\'' + results[1].title + '\'';
                    } else {
                        senden = senden + ' ein Todo';
                        empfangen = empfangen + ' ein Todo';
                    }

                    if (results[0] !== undefined) {
                        senden = senden + ' an ' + results[0].name + ' versendet.';
                        empfangen = empfangen + ' von ' + this.me.name + ' empfangen.';
                    } else {
                        senden = senden + ' versendet.';
                        empfangen = empfangen + ' empfangen.';
                    }

                    this.socket.next(results[2] + empfangen);

                    this.snackBar.open(senden, 'Schließen', {
                        duration: 10000,
                    });
                },
                    error => {
                        this.snackBar.open(error, 'Schließen', {
                            duration: 5000,
                        });
                    }
                );
            });


        return answer;

    }

    // Methode zum Error-Handling
    private handleError(error: Response | any) {
        return Observable.throw(error.json().message);
    }
}
