import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Todo } from '../models/todo.model';
export { Todo } from '../models/todo.model';

import { User_Todo } from '../models/user_todo.model';
export { User_Todo } from '../models/user_todo.model';


@Injectable()
export class TodoService {
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

  // Methode zum Speichern eines neuen Todos
  addTodo(todo: Todo) {
    return this.http.post(this.baseURL + '/todos/todo', todo, this.options)
      .catch(this.handleError);
  }

  // Methode zum Updaten eines Todos
  updateTodo(todoId: string, todo: Todo) {
    return this.http.put(this.baseURL + '/todos/todo/' + todoId, todo, this.options)
      .catch(this.handleError);
  }

  // Methode zum Löschen eines Todos
  removeTodo(todoId: string) {
    return this.http.delete(this.baseURL + '/todos/todo/' + todoId, this.options)
      .catch(this.handleError);
  }

  // Methode zum Laden aller Todos des aktuellen Users
  getTodos(): Observable<Todo[]> {
    return this.http.get(this.baseURL + '/todos/index/todo', this.options)
      .map((response: Response) => response.json().data)
      .catch(this.handleError);
  }

  // Methode zum Laden eines Todos anhand der todoId
  getTodo(todoId: string): Observable<Todo> {
    return this.http.get(this.baseURL + '/todos/todo/' + todoId, this.options)
      .map((response: Response) => response.json().data)
      .catch(this.handleError);
  }

  // Methode zum Error-Handling
  private handleError(error: Response | any) {
    return Observable.throw(error.json().message)
  }
}
