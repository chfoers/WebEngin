import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Cookie } from 'ng2-cookies';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { AuthorisationData } from '../models/authorisationData.model';
import { User } from '../models/user.model';

export { AuthorisationData } from '../models/authorisationData.model';
export { User } from '../models/user.model';

@Injectable()
export class UserService {
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

  // Prüft, ob ein User angemeldet ist, verwendet dafür das jwtToken
  isAuthenthicated() {
    if (Cookie.get('jwtToken') === '') {
      return false;
    } else {
      return true;
    }
  }

  // Methode zum Einloggen eines Users, fügt ein jwtToken bei den Cookies hinzu
  login(authorisationData: AuthorisationData) {
    return this.http.post(this.baseURL + '/users/login', authorisationData, this.options)
      .catch(this.handleError);
  }

  // Methode zum Ausloggen des aktuellen Users, entfernt das jwtToken aus den Cookies
  logout() {
    return this.http.delete(this.baseURL + '/users/logout', this.options)
      .catch(this.handleError);
  }

  // Methode zum registrieren eines Users
  registration(user: User) {
    return this.http.post(this.baseURL + '/users/registration', user, this.options)
      .catch(this.handleError);
  }

  // Methode gibt das aktuelle jwtClaimSet des Users zurück
  getMe() {
    return this.http.get(this.baseURL + '/users/getMe/', this.options)
      .map((response: Response) => response.json().data)
      .catch(this.handleError);
  }

  // Methode zum Error-Handling
  private handleError(error: Response | any) {
    return Observable.throw(error.json().message);
  }
}
