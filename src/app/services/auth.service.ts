import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, logout } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = 'http://localhost:8080/login';

  private _user: any;

  constructor(
    // auth: Es la parte del estado global que te interesa. Aquí defines su tipo.
    private store: Store<{ auth: any }>,
    private http: HttpClient) {
    this.store.select('auth').subscribe(state => {
      this._user = state;
    })
  }

  //Envía las credenciales como un objeto { userName, password } en el cuerpo de la solicitud.
  loginUser({ userName, password }: any): Observable<any> {
    return this.http.post<any>(this.url, { userName, password });
  }

  set user(user: any) {
    sessionStorage.setItem('login', JSON.stringify(user));
    // Ejemplo de lo que se guarda en sessionStorage: '{"isAuth":true,"isAdmin":false,"user":"John"}'
  }

  get user() {
    return this._user;
  }


  set token(token: string) {
    sessionStorage.setItem('token', token);
  }

  get token() {
    return sessionStorage.getItem('token')!;
  }

  getPayload(token: string) {
    if (token != null) {
      return JSON.parse(atob(token.split(".")[1]));
    }
    return null;
  }

  //this.user -> Invoca el getter que garantiza que la información del usuario esté actualizada.
  //this._user -> Accede directamente a la propiedad privada sin pasar por la lógica adicional.

  isAdmin() {
    return this.user.isAdmin;
  }

  authenticated() {
    return this.user.isAuth;
  }

  logout() {
    this.store.dispatch(logout());
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('token');
  }

}
