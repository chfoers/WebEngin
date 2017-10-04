import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';
import { TodoService, Todo } from './todo.service';
import { ContactService, User } from './contact.service';

import { User_Todo } from '../models/user_todo.model';
export { User_Todo } from '../models/user_todo.model';


@Injectable()
export class User_TodoService {
    // URL zum Aufrufen des Servers
    private baseURL = 'http://' + window.location.hostname + ':8080';
    // Options in Form eines RequestOptions-Objekts
    private options: RequestOptions;
    private socket: Subject<any>;

    constructor(private http: Http, websocketService: WebsocketService,
        public todoService: TodoService, public contactService: ContactService) {
        this.options = new RequestOptions({
            headers: new Headers({ 'Content-Type': 'application/json' }),
            withCredentials: true
        });
        this.socket = websocketService.createWebsocket();
    }

    // Methode zum Updaten eines user_todo-Objektes, wird verwendet um Aufgabe einem anderem User zuzuweisen
    updateUserTodo(user_todo: User_Todo) {
        const answer = this.http.put(this.baseURL + '/user_todos/update/', user_todo, this.options)
            .map((response: Response) => response.json().data)
            .catch(this.handleError);

        // Laden des Usernamens und des Kontaktes
        const contactName = this.contactService.getContact(user_todo.userId).map(response => response[0].name);
        const todoTitle = this.todoService.getTodo(user_todo.todoId).map(response => response.title);

        // Senden der auszugebenen Nachricht an den Websocket
        Observable.forkJoin([contactName, todoTitle]).subscribe(results => {
            this.socket.next('Der User ' + results[0] + ' hat das Todo ' + results[1] + ' erhalten');
        });
        return answer;
    }

    // Methode zum Error-Handling
    private handleError(error: Response | any) {
        return Observable.throw(error.json().message);
    }
}
