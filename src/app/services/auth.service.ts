import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = 'http://localhost:8080/login';

  private _token: string | undefined;

  private _user: any = {
    isAuth: false,
    isAdmin: false,
    user: undefined
  }

  constructor(private http: HttpClient) { }

  //Envía las credenciales como un objeto { userName, password } en el cuerpo de la solicitud.
  loginUser({ userName, password }: any): Observable<any> {
    return this.http.post<any>(this.url, { userName, password });
  }

  set user(user: any) {
    // 1. Asignamos el objeto recibido al atributo privado `_user`. Esto guarda el usuario en memoria para uso inmediato en la aplicación.
    this._user = user;
    // 2. Convertimos el objeto `user` a una cadena JSON usando JSON.stringify, porque `sessionStorage` solo permite guardar cadenas de texto.
    sessionStorage.setItem('login', JSON.stringify(user));
    // Ejemplo de lo que se guarda en sessionStorage: '{"isAuth":true,"isAdmin":false,"user":"John"}'
  }

  get user() {
    // 1. Si ya tenemos un usuario autenticado en memoria (`this._user`), simplemente lo devolvemos.
    if (this._user.isAuth) {
      return this._user;
    }
    // 2. Si no hay un usuario en memoria, pero encontramos datos en `sessionStorage`, recuperamos esos datos.
    else if (sessionStorage.getItem('login') != null) {
      // a) Obtenemos el dato almacenado en `sessionStorage` (una cadena JSON).
      // b) Convertimos esa cadena JSON en un objeto JavaScript con `JSON.parse y lo guardamos nuevamente en `this._user`.
      this._user = JSON.parse(sessionStorage.getItem('login') || '{}');
      // c) Devolvemos el objeto que ahora está en memoria.
      return this._user;
    }
    // 3. Si no hay datos ni en memoria ni en `sessionStorage`, simplemente devolvemos el estado inicial de `_user`.
    return this._user;
  }


  set token(token: string) {
    this._token = token;
    sessionStorage.setItem('token', token);
  }

  get token() {
    if (this._token != undefined) {
      return this._token;
    } else if (sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token') || '';
      return this._token;
    }
    return this._token!;
  }


getPayload(token: string) {
    // Verifica si el token no es nulo
    if (token != null) {
        // Divide el token en sus partes (header, payload, signature)
        //posicion 1 porque el payload es el segundo siempre de los 3 posibles
        const payload = token.split(".")[1];
        // Decodifica el payload de Base64 a texto normal con atob
        const decodedPayload = atob(payload);
        // Convierte el texto JSON a un objeto de JavaScript
        return JSON.parse(decodedPayload);
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
    this._token = undefined;
    this._user = {
      isAuth: false,
      isAdmin: false,
      user: undefined
    };
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('token');
  }

}
