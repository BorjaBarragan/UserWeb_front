import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
  paginator : any = {} ;

  constructor(
    private router: Router,
    private service: UserService,
    private sharingData: SharingDataService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    //Comentamos bloque, ya que no es necesario. Ahora se realiza en user.component
    // this.service.findAll().subscribe(users => this.users = users);  // Aquí recibimos todos los usuarios.
    // this.route.paramMap.subscribe(params => {
    //   const page = +(params.get('page') || '0');
    //   console.log(page)
    //   //this.service.findAllPageable(page).subscribe(pageable => this.users = pageable.content as User[]);
    // })
    this.addUser();    // Escuchar cuando se agrega un nuevo usuario.
    this.removeUser(); // Escuchar cuando se elimina un usuario.
    this.findUserById(); // Escuchar cuando se selecciona un usuario para editar.
    this.pageUsersEvent(); // Escuchar cuando se cambia de pagina
  }

  pageUsersEvent() {
    this.sharingData.pageUsersEventeEmitter.subscribe(pageable =>{ 
      this.users = pageable.users;
      this.paginator = pageable.paginator;
    });
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
        //Observable 1 - update
        this.service.update(user).subscribe(
          //next,error son callbacks (funciones de retorno) que se usan en las suscripciones a un observable en Angular.
          //next y error son atributos de un objeto, por lo tanto van ani {}
          {
            //next: cuando todo sale bien
            next: (userUpdate) => {
              //map, actualiza el array de usuarios reemplazandos el usuarios que ha sido actualizado userUpdate
              this.users = this.users.map(u => (u.id == userUpdate.id) ? { ...userUpdate } : u);
              this.router.navigate(['/users'], { 
                state: { 
                  users: this.users,
                  paginator: this.paginator } });
              Swal.fire({
                title: "Updated",
                text: "The user is updated successfully !",
                icon: "success"
              });
            },
            error: (err) => {
              //para enviar el error al user-form. creamos evento en sharing y lo emitimos desde aqui.
              if (err.status == 400) {
                this.sharingData.errorsUserFormsEventEmitter.emit(err.error);
              }
            }
          }
        )
      } else {
        this.service.create(user).subscribe(
          //Observable 2- create
          {
            next: (userNew) => {
              //aqui creamos una copia de todos los usuarios
              //añade un nuevo usuario al final de la copia
              //actualiza this.users para que sea el nuevo array con todos los usuarios y el nuevo
              this.users = [...this.users, { ...userNew }];
              this.router.navigate(['/users'], { 
                state: { 
                  users: this.users,
                  paginator: this.paginator
                 } });
              Swal.fire({
                title: "Created!",
                text: "The user is created successfully !",
                icon: "success"
              });
            },
            error: (err) => {
              console.log(err.status)
              if (err.status == 400) {
                this.sharingData.errorsUserFormsEventEmitter.emit(err.error);
              }
            }
          }
        )
      }
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
              this.router.navigate(['/users'], { 
                state: { 
                  users: this.users,
                  paginator:this.paginator
                } });
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
