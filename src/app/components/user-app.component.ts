import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';

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
  ) { }
  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users = users);
    this.addUser();
    this.removeUser();
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe(user => {
      if (user.id > 0) {
        this.users = this.users.map(u => (u.id == user.id) ? { ...user } : u);
      } else {
        this.users = [...this.users, { ...user, id: new Date().getTime() }];
      }
      this.router.navigate(['/users'], { state: { users: this.users } })
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
          this.users = this.users.filter(user => user.id !== id);
          // Navega a la ruta '/users/create' pero sin cambiar la URL visible en el navegador (navegación silenciosa).
          this.router.navigate(['/user/create'], { skipLocationChange: true }).then(() => {
            // Una vez que la navegación anterior ha sido completada, navega a la ruta '/users'.
            // Pasa la lista de usuarios actualizada a través del estado para que la nueva vista los reciba.
            this.router.navigate(['/users'], { state: { users: this.users } });
          });
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
