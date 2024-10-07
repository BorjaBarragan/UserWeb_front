import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { UserComponent } from "./user/user.component";
import { UserFormComponent } from "./user-form/user-form.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [UserComponent, UserFormComponent],
  templateUrl: './user-app.component.html',
})
export class UserAppComponent implements OnInit {

  title: string = 'Listado de usuarios'

  users: User[] = [];

  //Usuario unico, ya que no es un array
  userSelected: User;

  open: boolean = false;

  constructor(private service: UserService) {
    this.userSelected = new User();
  }
  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users = users);
  }

  addUser(user: User) {
    if (user.id > 0) {
      this.users = this.users.map(u => (u.id == user.id) ? { ...user } : u);
    } else {
      this.users = [...this.users, { ...user, id: new Date().getTime() }];
    }
    Swal.fire({
      title: "Saved",
      text: "The user is created successfully !",
      icon: "success"
    });
    this.userSelected = new User();
    this.setOpen();
    console.log('Usuario agregado:', user);
  }

  removeUser(id: number): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.users = this.users.filter(user => user.id !== id);
        Swal.fire({
          title: "Deleted!",
          text: "The user has been deleted.",
          icon: "success"
        });
      }
    });
    console.log('Usuario eliminado:', id);
  }

  setSelectedUser(userRow: User): void {
    this.userSelected = { ...userRow };
    this.open=true;
    console.log('Usuario modificado:', this.userSelected);
  }

  setOpen(){
    this.open = ! this.open;
  }
}
