import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    private service: UserService,  //servicio UserService para obtener datos de usuarios
    private router: Router,
    private route: ActivatedRoute
  ) {      //servicio Router para acceder a la navegación actual y su estado
    //
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
    }
  }
  ngOnInit(): void {
    //Creamos este if para que solo vaya a buscar los users solo una vez.
    if (this.users == undefined || this.users == null || this.users.length == 0) {
      console.log('Consulta findAll()')
      // this.service.findAll().subscribe(users => this.users = users);
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || '0');
        console.log(page)
        this.service.findAllPageable(page).subscribe(pageable =>{ 
          this.users = pageable.content as User[]
          this.sharingData.pageUsersEventeEmitter.emit(this.users);
        });
      })
    }
  }

  onRemoveUser(id: number): void {
    this.sharingData.idUserEventEmitter.emit(id);
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

}
