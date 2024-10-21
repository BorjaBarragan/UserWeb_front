import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { state } from '@angular/animations';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
})
export class UserAppComponent implements OnInit {

  users: User[] = [];

  constructor(
    private router: Router,
    private service: UserService,
    private sharingData: SharingDataService
  ) {

  }

  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users = users);  // Aquí recibimos todos los usuarios.
    this.addUser();    // Escuchar cuando se agrega un nuevo usuario.
    this.removeUser(); // Escuchar cuando se elimina un usuario.
    this.findUserById(); // Escuchar cuando se selecciona un usuario para editar.
  }

  findUserById() {
    this.sharingData.findUserByIdEventEmitter.subscribe(id => {
      // Buscar el usuario con ese ID en la lista de usuarios
      const user = this.users.find(user => user.id == id);
      // Emitir el usuario encontrado para que lo reciba el formulario
      this.sharingData.selectUserEventEmitter.emit(user);
    });
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe(user => {
      if (user.id > 0) {
        this.service.update(user).subscribe(userUpdate => {
          this.users = this.users.map(u => (u.id == userUpdate.id) ? { ...userUpdate } : u);
          this.router.navigate(['/users'], { state: { users: this.users } });
        })
      } else {
        this.service.create(user).subscribe(userNew => {
          this.users = [...this.users, { ...userNew }];
          this.router.navigate(['/users'], { state: { users: this.users } });
        })
      }
      Swal.fire({
        title: "Saved",
        text: "The user is created successfully !",
        icon: "success"
      });
    })
  }

  removeUser(): void {
    this.sharingData.idUserEventEmitter.subscribe(id => {
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
          this.service.delete(id).subscribe(() => {
            this.users = this.users.filter(user => user.id != id);
            // Navega a la ruta '/users/create' pero sin cambiar la URL visible en el navegador (navegación silenciosa).
            this.router.navigate(['/user/create'], { skipLocationChange: true }).then(() => {
              this.router.navigate(['/users'], { state: { users: this.users } });
            });
          })
          Swal.fire({
            title: "Deleted!",
            text: "The user has been deleted.",
            icon: "success"
          });
        }
      });
      console.log('Usuario eliminado:', id);
    })
  }
}
