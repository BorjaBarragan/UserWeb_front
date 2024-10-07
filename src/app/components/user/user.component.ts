import { Component, EventEmitter } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html',
})
export class UserComponent {

  title: string = 'Listado de usuarios'

  users: User[] = [];

  constructor(
    private sharingData: SharingDataService,
    private service: UserService,  // Inyecta el servicio UserService para obtener datos de usuarios
    private router: Router) {        // Inyecta el servicio Router para acceder a la navegación actual y su estado
    // Verifica si la navegación actual contiene algún estado (datos pasados desde otro componente)
    if (this.router.getCurrentNavigation()?.extras.state) {
      // Si existe estado en la navegación, asigna los usuarios desde ese estado a la variable `this.users`
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
    } else {
      // Si no hay estado en la navegación, llama al servicio `UserService` para obtener la lista de usuarios desde el backend
      this.service.findAll().subscribe(users => this.users = users);
      // `subscribe()` se usa para recibir los datos de manera asincrónica (una vez que llegan los datos del servidor)
      // Cuando se reciban los usuarios, se asignan a `this.users`
    }
  }

  onRemoveUser(id: number): void {
    this.sharingData.idUserEventEmitter.emit(id);
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/user/edit', user.id], { state: { user } });
  }

}
