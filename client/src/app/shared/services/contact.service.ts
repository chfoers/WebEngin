import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Contact } from '../models/contact.model';
export { Contact } from '../models/contact.model';
import { User } from '../models/user.model';
export { User } from '../models/user.model';

@Injectable()
export class ContactService {
  private baseURL = 'http://' + window.location.hostname + ':8080';
  private options: RequestOptions;

  constructor(private http: Http) { 
    this.options = new RequestOptions({
       headers: new Headers({ 'Content-Type': 'application/json' }),
       withCredentials: true
    });
  }

  getContacts() : Observable<User[]>{
    return this.http.get(this.baseURL + '/contacts/contact', this.options)
    .map((response: Response) => response.json().data )
    .catch(this.handleError);
  }

  addContact(email: string) {
    return this.http.post(this.baseURL + '/contacts/contact', { email }, this.options)
      .map((r: Response) => { })
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.json().message)
  }
}
