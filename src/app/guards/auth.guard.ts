import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//Este código define un guard de Angular (específicamente un CanActivateFn) que se utiliza para proteger 
//rutas y asegurarse de que el usuario esté autenticado y tenga permisos para acceder a determinadas rutas.

//En este código se debe a que Angular 15 introdujo un nuevo enfoque para inyectar dependencias en funciones
// como los guards utilizando el inject() en lugar de la inyección de dependencias a través del constructor
export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  if (service.authenticated()) {
    if (isTokenExpired()) {
      service.logout();
      router.navigate(['/login']);
      return false;
    }
    if (!service.isAdmin()) {
      router.navigate(['/forbidden'])
      return false;
    }
    return true;
  }
  router.navigate(['/login']);
  return false;
};
//uando llamas a isTokenExpired(), esta es una función separada que necesita acceder
// nuevamente a las mismas dependencias (en este caso, el AuthService).
const isTokenExpired = () => {
  const service = inject(AuthService);
  const token = service.token;
  const payload = service.getPayload(token);
  //exp, indica cuando el token deja de ser valido.
  const exp = payload.exp;
  const now = new Date().getTime() / 1000;
  return (now > exp) ? true : false;
}
