import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { User_Todo } from '../models/user_todo.model';
export { User_Todo } from '../models/user_todo.model';


@Injectable()
export class User_TodoService {
    private baseURL = 'http://' + window.location.hostname + ':8080';
    private options: RequestOptions;

    constructor(private http: Http) {
        this.options = new RequestOptions({
            headers: new Headers({ 'Content-Type': 'application/json' }),
            withCredentials: true
        });
    } 

    updateUserTodo(user_todo: User_Todo) {
        return this.http.put(this.baseURL + '/user_todos/update/', user_todo, this.options)
        .map((response: Response) => response.json().data )
        .catch(this.handleError);
    }

    private handleError(error: Response | any) {
         return Observable.throw(error.json().message)
    }
}