import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonButton,
    IonContent,
    HeaderComponent,
    RouterLink,
  ],
})
export class HomePage {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {}

  cerrarSesion() {
    if (this.authService.currentUser()) {
      console.log(this.authService.currentUser()?.username);
      this.authService.logout();

      this.router.navigateByUrl('/login');
    }
  }

}
