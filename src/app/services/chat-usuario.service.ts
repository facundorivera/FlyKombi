import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Mensaje } from '../Entidades/mensaje';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatUsuarioService {

  // mensaje:Mensaje = new Mensaje();

  IDChat = new BehaviorSubject(0);

  constructor(private http:HttpClient) { }



  AltaMensaje(mensaje:Mensaje)
  {
    return this.http.post<any>(`${environment.API_URL}api/Mensaje/AltaMensaje`,mensaje)
  }

  GetMensajes(IDUsuario:number): Observable<Mensaje>{

    return this.http.get<any>(`${environment.API_URL}api/Mensajes/GetAll`,{
      params: new HttpParams().set('IDUsuario',IDUsuario.toString())
    })

  }

  GetChat(IDEmisor:number,IDReceptor:number): Observable<Mensaje>  
  {
    return this.http.get<any>(`${environment.API_URL}api/Mensajes/Chat`,{
      params:new HttpParams().set('IDEmisor',IDEmisor.toString())
      .set('IDReceptor',IDReceptor.toString())
    })
  }

  //Metodo utilizado para enviar bool a base de datos para remarcar que el chat o mensaje fue lido
  LeerChat(IDEmisor:number,IDReceptor:number) :Observable<any>
  {
    return this.http.get<any>(`${environment.API_URL}api/Mensajes/Leer`,{
      params:new HttpParams().set('IDEmisor',IDEmisor.toString())
      .set('IDReceptor',IDReceptor.toString())
    })
  }


  GetListadoConversaciones(IDUsuario:number) {
    
    return this.http.get<any>(`${environment.API_URL}api/Mensajes/GetListadoConversaciones`,{
      params : new HttpParams().set('IDUsuario',IDUsuario.toString())
    })

  }



  

}
