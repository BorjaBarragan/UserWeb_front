import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { login } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {

  user: User;
  passwordType: string = 'password';

  constructor(
    private store: Store<{ auth: any }>
  ) {
    this.user = new User();
  }

  passwordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (!this.user.userName || !this.user.password) {
      Swal.fire('Error de validación', 'Username y password requerido', 'error');
    } else {
      this.store.dispatch(login({ userName: this.user.userName, password: this.user.password }))
    }
  }
}
