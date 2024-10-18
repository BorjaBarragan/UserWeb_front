import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute} from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
})

export class UserFormComponent implements OnInit {

  user: User;

  constructor(
    private sharingData: SharingDataService,
    private route: ActivatedRoute,
    private service: UserService) 
    {
    //hacemos que el formulario empiece siempre vacio.
    this.user = new User();
  }
  
  ngOnInit(): void {
    this.sharingData.selectUserEventEmitter.subscribe(user => this.user = user);
    //Nos suscribimos a los cambios en los parámetros de la URL usando 'paramMap'.
    //Queremos extraer el parámetro 'id' de la URL, que puede ser algo como '/users/5'.
    this.route.paramMap.subscribe(params => {
      // Obtenemos el valor del parámetro 'id' de la URL. 
      // Si no existe, le asignamos el valor '0' por defecto.
      const id: number = + (params.get('id') || '0');  // El '+' convierte el id a número
      // Si el 'id' es mayor a 0, significa que probablemente estamos editando un usuario existente.
      if (id > 0) {
         this.sharingData.findUserByIdEventEmitter.emit(id);
        //this.service.findById(id).subscribe(user => this.user = user);
      }
    });
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

  onClear(userForm: NgForm) {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }

}
