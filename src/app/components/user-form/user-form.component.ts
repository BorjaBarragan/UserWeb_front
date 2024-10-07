import { Component} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
})

export class UserFormComponent {

  user: User;

  constructor(
    private sharingData : SharingDataService,
    private router: Router){
     // Verifica si la navegación actual contiene algún estado (datos pasados desde otro componente)
     if (this.router.getCurrentNavigation()?.extras.state) {
      // Si existe estado en la navegación, asigna los usuarios desde ese estado a la variable `this.users`
      this.user = this.router.getCurrentNavigation()?.extras.state!['user'];
    } else {
      this.user = new User();     
    }
  }
  
  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      // Emitimos el objeto usuario
      this.sharingData.newUserEventEmitter.emit(this.user);
      console.log(this.user);
      // Si es creación, reinicia el formulario
      }
      userForm.reset();
      userForm.resetForm();
    }

  onClear(userForm:NgForm){
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }

}
