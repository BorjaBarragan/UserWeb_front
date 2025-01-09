import { createReducer, on } from "@ngrx/store"
import { loginSuccess, logout } from "./auth.actions"

export const initialLogin = {
    isAuth: false,
    isAdmin: false,
    user: undefined
}
// initialState: Representa el estado inicial del reducer, que es la base sobre la que se aplicarán las transformaciones.
const initialState = JSON.parse(sessionStorage.getItem('login') || JSON.stringify(initialLogin));

// createReducer es una función de la librería @ngrx/store 
// que permite crear reducers de manera más legible y concisa. 
// Define cómo debe cambiar el estado en respuesta a ciertas acciones (on)
export const authReducer = createReducer(
    initialState,
    // on(...): Define qué pasa con el estado cuando ocurre una acción específica (como login).
    on(loginSuccess, (state, { login }) => (
        {
            isAuth: true,
            isAdmin: login.isAdmin,
            user: login.user
        }
    )),
    //RESETEAMOS LOS DATOS POR DEFECTO
    on(logout, (state) => ({ ...initialLogin }))

    //Seria lo mismo hacer lo siguiente: 

    // on(logout, (state) => (
    //     {
    //         isAuth:false,
    //         isAdmin:false,
    //         user:undefined
    //     }
    // ))
)

//UNA VEZ CREAMOS LAS ACTIONS, HAY QUE CONFIGURARLO -> app.config.ts