import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { User_Todo } from '../models/user_todo.model';
export { User_Todo } from '../models/user_todo.model';


@Injectable()
export class User_TodoService {
    // URL zum Aufrufen des Servers
    private baseURL = 'http://' + window.location.hostname + ':8080';
    // Options in Form eines RequestOptions-Objekts
    private options: RequestOptions;

    constructor(private http: Http) {
        this.options = new RequestOptions({
            headers: new Headers({ 'Content-Type': 'application/json' }),
            withCredentials: true
        });
    }

    // Methode zum Updaten eines user_todo-Objektes, wird verwendet um Aufgabe einem anderem User zuzuweisen
    updateUserTodo(user_todo: User_Todo) {
        return this.http.put(this.baseURL + '/user_todos/update/', user_todo, this.options)
            .map((response: Response) => response.json().data)
            .catch(this.handleError);
    }

    // Methode zum Error-Handling
    private handleError(error: Response | any) {
        return Observable.throw(error.json().message)
    }
}