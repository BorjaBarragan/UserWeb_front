import { Component, EventEmitter, OnInit } from '@angular/core';
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
export class UserComponent implements OnInit {

  title: string = 'Listado de usuarios'

  users: User[] = [];

  constructor(
    private sharingData: SharingDataService,
    private service: UserService,  // Inyecta el servicio UserService para obtener datos de usuarios
    private router: Router) {        // Inyecta el servicio Router para acceder a la navegación actual y su estado
  }
  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users = users);
  }

  onRemoveUser(id: number): void {
    this.sharingData.idUserEventEmitter.emit(id);
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

}
