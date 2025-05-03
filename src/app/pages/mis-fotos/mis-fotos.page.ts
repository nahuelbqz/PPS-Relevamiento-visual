import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardContent,
  IonCol,
  IonCard,
  IonRow,
  IonGrid,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FotoService } from 'src/app/services/foto.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mis-fotos',
  templateUrl: './mis-fotos.page.html',
  styleUrls: ['./mis-fotos.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCard,
    IonCol,
    IonCardContent,
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class MisFotosPage implements OnInit {
  fotoService = inject(FotoService);
  authService = inject(AuthService);

  fotos: any[] = [];

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (!user) {
      console.error('No se encontró el usuario logueado.');
      return;
    }

    const email = user.email;

    const { data, error } = await this.fotoService.getFotos();
    if (error) {
      console.error('Error al obtener las fotos:', error);
      return;
    }

    // Filtramos solo las fotos que coincidan con el email del usuario logueado
    this.fotos = (data || [])
      .filter((foto) => foto.user_email === email)
      .map((foto) => {
        let likes = foto.likes;

        // Si likes es un string, intentamos parsearlo
        if (typeof likes === 'string') {
          try {
            likes = JSON.parse(likes);
          } catch {
            likes = [];
          }
        }

        return {
          ...foto,
          likes: Array.isArray(likes) ? likes : [],
        };
      });
  }
}
