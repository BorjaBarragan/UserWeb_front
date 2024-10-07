import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserAppComponent } from "./components/user-app.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserAppComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Aplicacion Usuarios';
}
