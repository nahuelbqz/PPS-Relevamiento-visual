import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  uploadImage(fileName: string, blob: Blob) {
    return this.supabase.storage.from('imagenes').upload(fileName, blob, {
      contentType: 'image/jpeg',
    });
  }

  getPublicUrl(fileName: string) {
    return this.supabase.storage.from('imagenes').getPublicUrl(fileName);
  }

  async insertFotoEnDB(url: string, userEmail: string, tipo: string) {
    const { data, error } = await this.supabase.from('fotos').insert([
      {
        url: url,
        user_email: userEmail,
        fecha_hora: new Date().toISOString(),
        likes: [],
        tipo: tipo,
      },
    ]);

    return { data, error };
  }

  getFotos() {
    return this.supabase
      .from('fotos')
      .select('*')
      .order('fecha_hora', { ascending: false });
  }

  //like
  async actualizarLikes(fotoId: number, likes: string[]) {
    return await this.supabase.from('fotos').update({ likes }).eq('id', fotoId);
  }

  async getFotosPorTipo(tipo: string) {
    const { data, error } = await this.supabase
      .from('fotos')
      .select('*')
      .eq('tipo', tipo);
    return { data, error };
  }
}
