import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule, PaginatorComponent],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {

  title: string = 'Listado de usuarios';

  users: User[] = [];

  paginator: any = {};

  constructor(
    private sharingData: SharingDataService,
    private service: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService : AuthService,
  ) {
    //this.router.getCurrentNavigation()
    //se añade en el constructor ya que state solo está disponible durante la navegación
    // activa (es decir, mientras se está construyendo el nuevo componente).
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
      this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
    }
  }

  ngOnInit(): void {
    // Solo buscamos los usuarios en el servidor si no hay datos de usuarios ya cargados
    if (this.users == undefined || this.users == null || this.users.length == 0) {
      
      // Suscripción a los parámetros de la URL usando `paramMap`, que es un Observable
      // de Angular nos permite obtener parametros de la URL.
      this.route.paramMap.subscribe(params => {       
        // Obtenemos el número de página de los parámetros de la URL (o usamos 0 como valor por defecto)
        const page = +(params.get('page') || '0');
        console.log(page); 
        // Llamada al servicio `UserService` para obtener usuarios paginados
        this.service.findAllPageable(page).subscribe(pageable => {   
          // Asignamos la lista de usuarios al componente
          this.users = pageable.content as User[];          
          // Asignamos el objeto de paginación al componente
          this.paginator = pageable;
          // Emitimos un evento con los nuevos datos para que otros componentes puedan actualizarse
          this.sharingData.pageUsersEventeEmitter.emit({
            users: this.users,
            paginator: this.paginator
          });
        });
      });
    }
  }

  onRemoveUser(id: number): void {
    this.sharingData.idUserEventEmitter.emit(id);
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  get admin(){
    return this.authService.isAdmin();
  }
}
