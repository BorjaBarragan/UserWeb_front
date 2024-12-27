import { createReducer, on } from "@ngrx/store";
import { User } from "../models/user";
import { addSuccess, find, findAll, findAllPageable, removeSuccess, resetUser, setErrors, setPaginator, setUserForm, updateSuccess } from "./users.actions";

const users: User[] = [];
const user: User = new User();

//REDUCER
// Hay que recordar que la aplicación tiene un estado inmutable, 
// esto implica que al cambiar algún dato lo que se hace es sustituir el estado
//  por uno nuevo que incorpora los cambios. Debido a esto, existen los Reducers,
//  que son funciones para sustituir el estado de la aplicación por uno nuevo.

export const usersReducer = createReducer(
    //estado inicial del Reducer
    {
        users,
        paginator: {},
        user,
        errors: {}
    },
    on(resetUser, (state) => ({
        users: state.users,
        paginator: state.paginator,
        user: { ...user },
        errors: {}
    })),
    on(setUserForm, (state, {user}) => ({
        users: state.users,
        paginator: state.paginator,
        user: { ...user },
        errors: state.errors
    })),
    //recordar segundo argumento entre {}
    on(findAll, (state, { users }) => ({
        users: [...users],
        paginator: state.paginator,
        user: state.user,
        errors: state.errors
    }
    )),
    on(findAllPageable, (state, { users, paginator }) => ({
        users: [...users],
        paginator: { ...paginator },
        user: state.user,
        errors: state.errors
    }
    )),
    on(find, (state, { id }) => ({
        users: state.users,
        paginator: state.paginator,
        user: state.users.find(user => user.id == id) || new User(),
        errors: state.errors
    })),
    on(setPaginator, (state, { paginator }) => ({
        users: state.users,
        paginator: { ...paginator },
        user: state.user,
        errors: state.errors
    })),
    on(addSuccess, (state, { userNew }) => ({
        users: [...state.users, { ...userNew }],
        paginator: state.paginator,
        user: state.user,
        errors: state.errors
    })),
    on(updateSuccess, (state, { userUpdated }) => ({
        users: state.users.map(u => (u.id == userUpdated.id) ? { ...userUpdated } : u),
        paginator: state.paginator,
        user: state.user,
        errors: state.errors
    })),
    on(removeSuccess, (state, { id }) => ({
        users: state.users.filter(user => user.id != id),
        paginator: state.paginator,
        user: state.user,
        errors: state.errors
    })),
    on(setErrors, (state, { errors }) => ({
        users: state.users,
        paginator: state.paginator,
        user: state.user,
        errors: { ...errors }
    })),
);