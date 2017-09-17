import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Todo } from '../models/todo.model';

export { Todo } from '../models/todo.model';

@Injectable()
export class TodoService {
  private baseURL = 'http://' + window.location.hostname + ':8080';
  authenticated = false; 
  private options: RequestOptions;

constructor(private http: Http) {
  this.options = new RequestOptions({
    headers: new Headers({ 'Content-Type': 'application/json' }),
    withCredentials: true
  });
}

addTodo(todo: Todo) {
  return this.http.post(this.baseURL + '/todos/todo', todo, this.options)
  .map((response: Response) => { this.authenticated = false; })
  .catch(this.handleError);
}

getTodos(): Observable<Todo[]> {
  return this.http.get(this.baseURL + '/todos/index/todo', this.options)
    .map((response: Response) => response.json().data )
  .catch(this.handleError);
}

private handleError(error: Response | any) {
  return Observable.throw(error.json().message)
}

}
