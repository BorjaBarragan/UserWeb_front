import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
//Se encarga de hacer peticiones al backend
export class UserService {

  private url: string = 'http://localhost:8080/api/users';  // URL base del backend

  constructor(private http: HttpClient) { }  // Inyecta el servicio HttpClient para hacer peticiones HTTP

  // Método para obtener todos los usuarios (GET /api/users)
  findAll(): Observable<User[]> {
    // Hace una petición HTTP GET a la URL del backend y devuelve un Observable de tipo User[]
    return this.http.get<User[]>(this.url);
  }
  //EJEMPLO TEMPLATE LITERALS
  //  const name = 'Juan';
  // const age = 25;

  //Forma normal
  // const message = 'Hola, mi nombre es ' + name + ' y tengo ' + age + ' años.';

  //Forma template literals
  // const message = `Hola, mi nombre es ${name} y tengo ${age} años.`;

  // El resultado de ambos ejemplos es: "Hola, mi nombre es Juan y tengo 25 años."

  findAllPageable(page: number): Observable<any> {
    //usamos template literals ` `
    return this.http.get<any>(`${this.url}/page/${page}`);
  }

  // Método para obtener un usuario por ID (GET /api/users/{id})
  findById(id: number): Observable<User> {
    // Hace una petición HTTP GET a la URL del backend con el ID del usuario y devuelve un Observable de tipo User
    return this.http.get<User>(`${this.url}/${id}`);
  }

  // Método para crear un nuevo usuario (POST /api/users)
  create(user: User): Observable<User> {
    // Hace una petición HTTP POST al backend con los datos del nuevo usuario y devuelve el usuario creado
    return this.http.post<User>(this.url, user);
  }

  // Método para actualizar un usuario existente (PUT /api/users/{id})
  update(user: User): Observable<User> {
    // Hace una petición HTTP PUT al backend con los nuevos datos del usuario y devuelve el usuario actualizado
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${this.url}/${id}`)
  }
}
