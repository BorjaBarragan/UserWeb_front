import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
})
export class UserAppComponent implements OnInit {

  // user !: User;

  constructor(
    private router: Router,
    private sharingData: SharingDataService,
    private authService: AuthService
  ) {
    // this.store.select('users').subscribe(state => {
    //   //si no clonamos user, nos dara error ya que Redux no nos deja modificar user.
    //   this.user = { ...state.user };
    // })
  }

  ngOnInit(): void {
    // this.addUser();
    // this.removeUser();
    // this.findUserById();
    // this.pageUsersEvent();
    this.handlerLogin();
  }

  handlerLogin() {
    this.sharingData.handlerLoginEventEmitter.subscribe(({ userName, password }) => {
      console.log(userName + ' ' + password);

      this.authService.loginUser({ userName, password }).subscribe({
        next: response => {
          const token = response.token;
          const payload = this.authService.getPayload(token);
          const user = { userName: payload.sub }
          const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          }
          this.authService.token = token;
          this.authService.user = login;
          this.router.navigate(['/users/page/0']);
        },
        error: error => {

          if (error.status == 401) {
            Swal.fire('Error en el Login', error.error.message, 'error');
          } else {
            throw error
          }
        }
      }
      );
    })
  }

  //MIGRADO A REDUX.

  // pageUsersEvent() {
  //   this.sharingData.pageUsersEventeEmitter.subscribe(pageable => {
  //     // this.users = pageable.users;
  //     // this.paginator = pageable.paginator;
  //     this.store.dispatch(findAll({ users: pageable.users }))
  //     this.store.dispatch(setPaginator({ paginator: pageable.paginator }));
  //   });
  // }

  // findUserById() {
  //   this.sharingData.findUserByIdEventEmitter.subscribe(id => {
  //     // Buscar el usuario con ese ID en la lista de usuarios
  //     // const user = this.users.find(user => user.id == id);
  //     this.store.dispatch(find({ id }))
  //     this.sharingData.selectUserEventEmitter.emit(this.user);
  //   });
  // }

  // addUser() {
  //   this.sharingData.newUserEventEmitter.subscribe(user => {
  //     if (user.id > 0) {
  //       //Observable 1 - update
  //       this.service.update(user).subscribe(
  //         //next,error son callbacks (funciones de retorno) que se usan en las suscripciones a un observable en Angular.
  //         //next y error son atributos de un objeto, por lo tanto van ani {}
  //         {
  //           //next: cuando todo sale bien
  //           next: (userUpdated) => {
  //             //map, actualiza el array de usuarios reemplazandos el usuarios que ha sido actualizado userUpdate
  //             // this.users = this.users.map(u => (u.id == userUpdated.id) ? { ...userUpdated } : u);
  //             this.store.dispatch(update({userUpdated}));
  //             this.router.navigate(['/users']);
  //             Swal.fire({
  //               title: "Updated",
  //               text: "The user is updated successfully !",
  //               icon: "success"
  //             });
  //           },
  //           error: (err) => {
  //             //para enviar el error al user-form. creamos evento en sharing y lo emitimos desde aqui.
  //             if (err.status == 400) {
  //               this.sharingData.errorsUserFormsEventEmitter.emit(err.error);
  //             }
  //           }
  //         }
  //       )
  //     } else {
  //       this.service.create(user).subscribe(
  //         {
  //           next: (userNew) => {

  //             this.store.dispatch(add({userNew}));
  //             this.router.navigate(['/users']);
  //             Swal.fire({
  //               title: "Created!",
  //               text: "The user is created successfully !",
  //               icon: "success"
  //             });
  //           },
  //           error: (err) => {
  //             console.log(err.status)
  //             if (err.status == 400) {
  //               this.sharingData.errorsUserFormsEventEmitter.emit(err.error);
  //             }
  //           }
  //         }
  //       )
  //     }
  //   })
  // }

  // removeUser(): void {
  //   this.sharingData.idUserEventEmitter.subscribe(id => {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!"
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.service.delete(id).subscribe(() => {
  //           this.store.dispatch(remove({ id }));
  //           // Navega a la ruta '/users/create' pero sin cambiar la URL visible en el navegador (navegación silenciosa).
  //           this.router.navigate(['/user/create'], { skipLocationChange: true }).then(() => {
  //             this.router.navigate(['/users']);
  //           });
  //         })
  //         Swal.fire({
  //           title: "Deleted!",
  //           text: "The user has been deleted.",
  //           icon: "success"
  //         });
  //       }
  //     });
  //     console.log('Usuario eliminado:', id);
  //   })
  // }
}
