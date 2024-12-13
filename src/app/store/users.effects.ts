import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../services/user.service";
import { catchError, EMPTY, exhaustMap, map } from "rxjs";
import { findAll, load, setPaginator } from "./users.actions";
import { User } from "../models/user";

@Injectable()
export class UsersEffects {

    //COMENTAMOS PORQUE DA FALLO.
    // loadUsers$ = createEffect(
    //     () => this.actions$.pipe(
    //         ofType(load),
    //         exhaustMap(action => this.service.findAllPageable(action.page)
    //             .pipe(
    //                 map(pageable => {
    //                     const users = pageable.content as User[];
    //                     const paginator = pageable;
    //                     setPaginator({ paginator });
    //                     return findAll({ users });
    //                 }),
    //                 catchError(() => EMPTY)
    //             )
    //         )
    //     )
    // );
    
    constructor(
        private actions$: Actions,
        private service: UserService
    ) {

    }

}