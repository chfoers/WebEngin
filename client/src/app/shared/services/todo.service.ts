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
  private baseURL = 'http://' + window.location.hostname + ':8080';
  private options: RequestOptions;

constructor(private http: Http) {
  this.options = new RequestOptions({
    headers: new Headers({ 'Content-Type': 'application/json' }),
    withCredentials: true
  });
}

addTodo(todo: Todo) {
  return this.http.post(this.baseURL + '/todos/todo', todo, this.options)
  .map((response: Response) => { })
  .catch(this.handleError);
}

updateTodo(todoId: string, todo: Todo) {
  return this.http.put(this.baseURL + '/todos/todo/' + todoId, todo, this.options)
  .map((response: Response) => { })
  .catch(this.handleError);
}

removeTodo(todoId: string) {
  return this.http.delete(this.baseURL + '/todos/todo/' + todoId, this.options)
  .map((response: Response) => { })
  .catch(this.handleError);
}

getTodos(): Observable<Todo[]> {
  return this.http.get(this.baseURL + '/todos/index/todo', this.options)
    .map((response: Response) => response.json().data )
  .catch(this.handleError);
}

getTodo(todoId: string): Observable<Todo> {
  return this.http.get(this.baseURL + '/todos/todo/' + todoId, this.options)
    .map((response: Response) => response.json().data )
  .catch(this.handleError);
}

private handleError(error: Response | any) {
  return Observable.throw(error.json().message)
}

}
