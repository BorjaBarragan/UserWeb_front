import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../services/user.service";
import { add, addSuccess, findAll, findAllPageable, load, remove, removeSuccess, setErrors, setPaginator, update, updateSuccess } from "./users.actions";
import { catchError, EMPTY, exhaustMap, map, of, tap } from "rxjs";
import { User } from "../models/user";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

//https://rootstack.com/es/blog/redux-angular

//EFFECTS
//Cuando hablamos del Effect nos referimos a una función asociada a una Action 
//que nos ayudará a realizar las tareas auxiliares que necesitemos.
//Este es un elemento que le brinda al desarrollador flexibilidad cuando debe gestionar el flujo de datos

@Injectable()
export class UsersEffects {
    loadUsers$: any;
    addUser$: any;
    addSuccessUser$: any;
    updateUser$: any
    updateSuccessUser$: any;
    removeUser$: any;
    removeSuccessUser$: any


    // Esto funciona porque Angular no requiere que los efectos sean propiedades
    // explícitas en la clase. Solo necesita que el createEffect sea invocado.
    constructor(
        private actions$: Actions,
        private service: UserService,
        private router: Router
    ) {
        this.loadUsers$ = createEffect(
            // Es una función de RxJS que permite encadenar operadores para transformar, 
            // filtrar o gestionar datos emitidos por un observable.
            () => this.actions$.pipe(
                //Filtra las acciones que fluyen por actions$ y selecciona solo las del tipo load.
                ofType(load),
                //Es un operador de RxJS que ejecuta una tarea asincrónica (como una llamada HTTP).
                exhaustMap(action => this.service.findAllPageable(action.page)
                    .pipe(
                        map(pageable => {
                            const users = pageable.content as User[];
                            const paginator = pageable;
                            console.log('Usuarios cargados:', users);
                            console.log('Paginador:', paginator);

                            return findAllPageable({ users, paginator });
                        }),
                        catchError(() => EMPTY)
                    )
                )
            )
        );

        this.addUser$ = createEffect(
            () => this.actions$.pipe(
                ofType(add),
                exhaustMap(action => this.service.create(action.userNew)
                    .pipe(
                        map(userNew => addSuccess({ userNew })),
                        catchError(error => (error.status == 400) ? of(setErrors({ errors: error.error })) : EMPTY
                        )
                    )
                )
            )
        )

        this.updateUser$ = createEffect(
            () => this.actions$.pipe(
                ofType(update),
                exhaustMap(action => this.service.update(action.userUpdated)
                    .pipe(
                        map(userUpdated => updateSuccess({ userUpdated })),
                        catchError(error => (error.status == 400) ? of(setErrors({ errors: error.error })) : EMPTY
                        )
                    )
                )
            )
        )

        this.removeUser$ = createEffect(
            () => this.actions$.pipe(
                ofType(remove),
                exhaustMap(action => this.service.delete(action.id)
                    .pipe(
                        map(id => removeSuccess({ id })),
                        catchError(error => (error.status == 400) ? of(setErrors({ errors: error.error })) : EMPTY
                        )
                    )
                )
            )
        )

        this.addSuccessUser$ = createEffect(() => this.actions$.pipe(
            ofType(addSuccess),
            tap(() => {
                this.router.navigate(['/users']);
                Swal.fire({
                    title: "Created!",
                    text: "The user is created successfully !",
                    icon: "success"
                });
            })
        ), { dispatch: false })

        this.updateSuccessUser$ = createEffect(() => this.actions$.pipe(
            ofType(updateSuccess),
            tap(() => {
                this.router.navigate(['/users']);
                Swal.fire({
                    title: "Updated",
                    text: "The user is updated successfully !",
                    icon: "success"
                });
            })
        ), { dispatch: false })

        this.removeSuccessUser$ = createEffect(() => this.actions$.pipe(
            ofType(removeSuccess),
            tap(() => {
                this.router.navigate(['/users']);
                Swal.fire({
                    title: "Deleted!",
                    text: "The user has been deleted.",
                    icon: "success"
                });
            })
        ), { dispatch: false })

    }
}