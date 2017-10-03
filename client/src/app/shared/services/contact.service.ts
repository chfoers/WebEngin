import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Contact } from '../models/contact.model';
export { Contact } from '../models/contact.model';
import { User } from '../models/user.model';
export { User } from '../models/user.model';

@Injectable()
export class ContactService {
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

  // Methode zum Laden aller Kontakte des aktuellen Users
  getContacts(): Observable<User[]> {
    return this.http.get(this.baseURL + '/contacts/contact', this.options)
      .map((response: Response) => response.json().data)
      .catch(this.handleError);
  }

  // Methode zum Laden eines Kontakts anhand der contactId
  getContact(contactId: string): Observable<Contact> {
    return this.http.get(this.baseURL + '/contacts/contact/' + contactId, this.options)
      .map((response: Response) => response.json().data)
      .catch(this.handleError);
  }

  // Methode zum Speichern eines neuen Kontakts
  addContact(email: string) {
    return this.http.post(this.baseURL + '/contacts/contact', { email }, this.options)
      .catch(this.handleError);
  }

  // Methode zum Löschen eines Kontakts
  removeContact(contactId: string) {
    return this.http.delete(this.baseURL + '/contacts/contact/' + contactId, this.options)
      .catch(this.handleError);
  }

  // Methode zum Error-Handling
  private handleError(error: Response | any) {
    return Observable.throw(error.json().message)
  }
}
