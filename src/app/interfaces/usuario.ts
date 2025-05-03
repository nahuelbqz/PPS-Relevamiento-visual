export interface UsuarioInterfaceId extends UsuarioInterface {
  id: string;
}
export interface UsuarioInterface {
  usuario: string;
  correo: string;
  perfil: string;
  sexo: string;
  listaImagenes: string[];
}

//model viejo
// export interface UsuarioInterface {
//     uid: string;
//     email: string;
//   }
