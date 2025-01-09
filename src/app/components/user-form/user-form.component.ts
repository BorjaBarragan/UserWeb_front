import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { add, find, resetUser, update } from '../../store/users/users.actions';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
})

export class UserFormComponent implements OnInit {

  user: User;
  //objeto que contiene cada atributo con el mensaje error
  errors: any = {};

  constructor(
    private store: Store<{ users: any }>,
    private route: ActivatedRoute,) {
    //hacemos que el formulario empiece siempre vacio.
    this.user = new User();

    this.store.select('users').subscribe(state => {
      this.errors = state.errors;
      this.user = { ...state.user }
    })
  }

  ngOnInit(): void {
    this.store.dispatch(resetUser());
    //paraMap, de ActivateRoute, nos permite acceder a l url. con param.get, adquirimos la id en este caso
    this.route.paramMap.subscribe(params => {
      const id: number = + (params.get('id') || '0');  // El '+' convierte el id a número
      // Si el 'id' es mayor a 0, significa que probablemente estamos editando un usuario existente.
      if (id > 0) {
        this.store.dispatch(find({ id }))
      }
    });
  }

  onSubmit(userForm: NgForm): void {
    //ya no hacemos el  reseteo del form aqui
    // this.store.dispatch(setUserForm({ user: this.user }));
    if (this.user.id > 0) {
      this.store.dispatch(update({ userUpdated: this.user }));
    } else {
      this.store.dispatch(add({ userNew: this.user }));
    }
  }

  onClear(userForm: NgForm) {
    this.store.dispatch(resetUser());
    userForm.reset();
    userForm.resetForm();
  }

}
