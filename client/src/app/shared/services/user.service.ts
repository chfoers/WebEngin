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
    private baseURL = 'http://' + window.location.hostname + ':8080';
    private options: RequestOptions;
  
  constructor(private http: Http) {
    this.options = new RequestOptions({
      headers: new Headers({ 'Content-Type': 'application/json' }),
      withCredentials: true
    });
  }

  isAuthenthicated() {
    if (Cookie.get('jwtToken') == ''){
      return false;
    } else {
      return true;
    }
  }

  login(authorisationData: AuthorisationData) {
    return this.http.post(this.baseURL + '/users/login', authorisationData, this.options)
      .catch(this.handleError);
  }

  logout() {
    return this.http.delete(this.baseURL + '/users/logout', this.options)
      .catch(this.handleError);
  }

  registration(user: User) {
    return this.http.post(this.baseURL + '/users/registration', user, this.options)
    .catch(this.handleError);
  }

  getMe(){
    return this.http.get(this.baseURL + '/users/getMe/', this.options)
      .map((response: Response) => response.json().data )
    .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.json().message)
  }
}
