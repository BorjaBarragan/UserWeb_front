import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { load } from '../../store/users.actions';

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
    private store: Store<{users:any}>,
    private sharingData: SharingDataService,
    private service: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService : AuthService,
  ) {

    //COMENTAMOS PORQUE DA FALLO.
    // this.store.select('users').subscribe(state => {
    //   this.users = state.users;
    //   this.paginator = state.paginator;
    // })

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
      this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
    }
  }

  ngOnInit(): void {
    if (this.users == undefined || this.users == null || this.users.length == 0) {
      
      this.route.paramMap.subscribe(params => {       
        const page = +(params.get('page') || '0');
        console.log(page)
        //COMENTAMOS PORQUE DA FALLO.
        this.store.dispatch(load({page}));

        //NO COMENTAMOS PORQUE NO DA FALLO.
        this.service.findAllPageable(page).subscribe(pageable => {   
          this.users = pageable.content as User[];          
          this.paginator = pageable;
          this.sharingData.pageUsersEventeEmitter.emit({users: this.users,paginator: this.paginator});
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
