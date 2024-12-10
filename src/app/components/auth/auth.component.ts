import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {

  user: User;
  passwordType: string = 'password';

  constructor(private sharingData: SharingDataService) {
    this.user = new User();
  }

  passwordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (!this.user.userName || !this.user.password) {
      Swal.fire('Error de validación', 'Username y password requerido', 'error');
    } else {
      Swal.fire('Usuario conectado! ', '', 'success');
      this.sharingData.handlerLoginEventEmitter.emit({
        userName: this.user.userName,
        password: this.user.password,
      });
    }
  }
}
