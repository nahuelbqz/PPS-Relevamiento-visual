import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FotoService } from 'src/app/services/foto.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-grafico-barra',
  templateUrl: './grafico-barra.page.html',
  styleUrls: ['./grafico-barra.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    NgxChartsModule,
  ],
})
export class GraficoBarraPage implements OnInit {
  fotoService = inject(FotoService);
  dataGrafico: any[] = [];
  selectedFoto: { url: string; likes: string[] } | null = null;

  async ngOnInit() {
    const { data, error } = await this.fotoService.getFotosPorTipo('fea');

    if (data) {
      this.dataGrafico = data
        .filter((foto) => foto.likes && foto.likes.length > 0)
        .map((foto, i) => {
          let likes = foto.likes;

          if (typeof likes === 'string') {
            try {
              likes = JSON.parse(likes);
            } catch (e) {
              likes = [];
            }
          }

          return {
            name: `Foto ${i + 1}`,
            value: likes.length,
            extra: {
              url: foto.url,
              likes,
            },
          };
        });
    }

    if (error) {
      console.error('Error al obtener fotos feas:', error);
    }
  }

  onSelect(data: any) {
    this.selectedFoto = data?.extra;
  }
}
