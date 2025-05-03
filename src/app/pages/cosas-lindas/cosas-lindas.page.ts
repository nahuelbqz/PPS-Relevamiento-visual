import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonImg,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { FotoService } from 'src/app/services/foto.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cosas-lindas',
  templateUrl: './cosas-lindas.page.html',
  styleUrls: ['./cosas-lindas.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonIcon,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    NgIf,
    NgFor,
    RouterLink,
  ],
})
export class CosasLindasPage implements OnInit {
  fotos: any[] = [];
  mostrarFotos: boolean = false;

  authService = inject(AuthService);
  fotoService = inject(FotoService);
  usuarioActual: any = null;

  constructor() {}

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    this.usuarioActual = user?.email ?? null;
  }
  async tomarFoto() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        await Camera.requestPermissions();
      }

      const image = await Camera.getPhoto({
        quality: 50,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!image.dataUrl) {
        throw new Error('No se pudo obtener la imagen.');
      }

      // SUBIR IMAGEN
      const blob = this.dataURLtoBlob(image.dataUrl);
      const fileName = `cosas-lindas/${Date.now()}.jpeg`;

      const { error: uploadError } = await this.fotoService.uploadImage(
        fileName,
        blob
      );

      if (uploadError) {
        console.error('Error subiendo imagen:', uploadError);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo subir la imagen. Intenta nuevamente.',
          heightAuto: false,
        });
        return;
      }

      // GUARDAR EN DB
      const { data: publicUrlData } = this.fotoService.getPublicUrl(fileName);
      const publicUrl = publicUrlData.publicUrl;

      const { error: insertError } = await this.fotoService.insertFotoEnDB(
        publicUrl,
        this.usuarioActual,
        'linda'
      );

      if (insertError) {
        console.error('Error guardando en DB:', insertError);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'La imagen se subió, pero hubo un error al guardarla en la base de datos.',
          heightAuto: false,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Foto guardada!',
          text: 'La imagen se subió y guardó correctamente.',
          heightAuto: false,
        });
        console.log('Imagen subida y guardada correctamente!');
      }
    } catch (error) {
      console.error('Error al tomar o guardar foto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error al tomar o guardar la foto.',
        heightAuto: false,
      });
    }
  }

  async cargarListadoFotos() {
    try {
      const { data, error } = await this.fotoService.getFotosPorTipo('linda');

      if (error) {
        console.error('Error al obtener las fotos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al cargar las fotos.',
          heightAuto: false,
        });
        return;
      }

      if (!data || data.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin fotos',
          text: 'Todavía no hay fotos subidas.',
          heightAuto: false,
        });
        this.fotos = [];
        this.mostrarFotos = false;
        return;
      }

      // Ordenar por fecha descendente si tu backend no lo hace
      this.fotos = data.sort(
        (a, b) =>
          new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()
      );

      // Sanear los likes por cada foto
      this.fotos = this.fotos.map((foto) => {
        try {
          if (typeof foto.likes === 'string') {
            foto.likes = JSON.parse(foto.likes);
          } else if (!Array.isArray(foto.likes)) {
            foto.likes = [];
          }
        } catch (e) {
          foto.likes = [];
        }
        return foto;
      });

      this.mostrarFotos = true;

      Swal.fire({
        icon: 'success',
        title: '¡Fotos cargadas!',
        text: `Se cargaron ${this.fotos.length} foto(s) correctamente.`,
        heightAuto: false,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error('Error inesperado al cargar fotos:', e);
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'No se pudieron cargar las fotos.',
        heightAuto: false,
      });
    }
  }

  dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async toggleLike(foto: any) {
    const user = this.usuarioActual;
    if (!user) return;

    // 💡 Asegurar que foto.likes es un array real
    let likes: string[];

    try {
      if (typeof foto.likes === 'string') {
        likes = JSON.parse(foto.likes); // si viene como string, lo parseamos
      } else if (Array.isArray(foto.likes)) {
        likes = [...foto.likes]; // si ya es array, lo clonamos
      } else {
        likes = []; // si es null o cualquier otra cosa, lo inicializamos
      }
    } catch (e) {
      console.warn('Error parseando likes:', e);
      likes = [];
    }

    const yaLeDioLike = likes.includes(user);

    if (yaLeDioLike) {
      likes = likes.filter((u) => u !== user);
    } else {
      likes.push(user);
    }

    const { error } = await this.fotoService.actualizarLikes(foto.id, likes);

    if (!error) {
      foto.likes = likes; // actualiza en la vista
    } else {
      console.error('Error actualizando likes:', error);
    }
  }
}
