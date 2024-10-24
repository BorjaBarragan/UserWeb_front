import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter;

  private _idUserEventEmitter = new EventEmitter();

  private _selectUserEventEmitter = new EventEmitter();

  private _findUserByIdEventEmitter = new EventEmitter();

  private _errorsUserFormsEventEmitter = new EventEmitter();

  private _pageUsersEventeEmitter = new EventEmitter();

  constructor() { }

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }
  get idUserEventEmitter(): EventEmitter<number> {
    return this._idUserEventEmitter;
  }
  get selectUserEventEmitter(): EventEmitter<User> {
    return this._selectUserEventEmitter;
  }
  get findUserByIdEventEmitter(): EventEmitter<number> {
    return this._findUserByIdEventEmitter;
  }
  get errorsUserFormsEventEmitter(): EventEmitter<number> {
    return this._errorsUserFormsEventEmitter;
  }
  get pageUsersEventeEmitter() {
    return this._pageUsersEventeEmitter
      ;
  }
}


