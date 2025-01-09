import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { login, loginError, loginSuccess } from "./auth.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import Swal from "sweetalert2";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthEffects {

    login$:any;
    loginSuccess$:any;
    loginError$:any;

    constructor(
        private actions$: Actions,
        private service: AuthService,
        private router: Router
    ) {

  

    this.login$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        exhaustMap(action => this.service.loginUser({ userName: action.userName, password: action.password })
            .pipe(
                map(response => {
                    const token = response.token;
                    const payload = this.service.getPayload(token);

                    const loginData = {
                        user: { userName: payload.sub },
                        isAuth: true,
                        isAdmin: payload.isAdmin
                    };

                    this.service.token = token;
                    this.service.user = loginData
                    return loginSuccess({ login: loginData });
                }),
                catchError((error) => of(loginError({ error: error.error.message })))
            ))
    ));

    this.loginSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
            this.router.navigate(['/users']);
        })
    ), { dispatch: false })

    this.loginError$ = createEffect(() => this.actions$.pipe(
        ofType(loginError),
        tap((action) => {
            Swal.fire('Error en el Login', action.error, 'error');
        })
    ), { dispatch: false })


    }
}