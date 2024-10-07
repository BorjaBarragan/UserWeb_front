import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';


@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
})

export class UserFormComponent {

  @Input() user: User;
  //Definimos el @Output para emitir el objeto user
  @Output() newUserEventEmitter: EventEmitter<User> = new EventEmitter;

  @Output() openEventEmitter = new EventEmitter;

  constructor() {
    this.user = new User();
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      // Emitimos el objeto usuario
      this.newUserEventEmitter.emit(this.user);
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

  onOpenClose() {
    this.openEventEmitter.emit();
  }
}
