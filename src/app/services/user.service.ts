import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [{

    id: 1,
    name: 'Borja',
    lastName: 'Barragan Sastre',
    email: 'borjabronx@yahoo.es',
    userName: 'borjabronx',
    password: '123456'
  },
  {
    id: 2,
    name: 'Marcos',
    lastName: 'Barragan Sastre',
    email: 'marcopolo@yahoo.es',
    userName: 'mondrak',
    password: '123456'
  },
  {
    id: 3,
    name: 'Jose',
    lastName: 'Barragan',
    email: 'joselito@yahoo.es',
    userName: 'joseat',
    password: '123456'
  },
  {
    id: 4,
    name: 'Maria A.',
    lastName: 'Sastre',
    email: 'marianariam@yahoo.es',
    userName: 'nairam11',
    password: '123456'
  }];

  constructor() { }

  findAll(): Observable<User[]>{
    return of(this.users);
  }

}
