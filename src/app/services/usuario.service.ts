//---Importaciones---//
import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Usuario} from '../Entidades/usuario';
import { Viajes, ListaViaje, ViajesSol, ModViaje } from '../Entidades/viajes';
import { Sesion } from '../Entidades/sesion';
//Libreria para metodo de comunicacion entre Login y Header
import { LoginEntity } from '../Entidades/login';
import{SolicitudViaje} from '../Entidades/Solicitud';
import { Calificacion } from '../Entidades/calificacion';

import {Vehiculo} from '../Entidades/vehiculo'; 

//--Importaciones--//
@Injectable({
  providedIn: 'root'
})
//---Definicion de la clase---//
export class UsuarioService {

  Usuario = new EventEmitter<string>();
  IDUser:number;
  private ObtenerID= new Subject<number>();
  ObtenerIDObservable= this.ObtenerID.asObservable();
  IDUsuario = new BehaviorSubject(0);
  LeerMensaje = new BehaviorSubject(0);
  //NombreUsuario = new BehaviorSubject('');

  //private NombreUsuario = new BehaviorSubject<string>('Esperando Cambio');
  //public customMessage = this.NombreUsuario.asObservable();

  constructor(private http: HttpClient) {

    
   }
  //Obtiene un listado de todos los usuarios.
  // ObtenerUsuario(): Observable<any> {
  //   return this.http.get<any>(`${environment.API_URL}api/Usuario/ObtenerUsuario`);
  // }
  //Obtener un usuario en particular.
  getUsuario(IDUsuario: number) {
    return this.http.get<any>(`${environment.API_URL}api/Usuario/getUsuario`, {
      params: new HttpParams().set('IDUsuario', IDUsuario.toString())
    });
  }
 //Registro de un nuevo usuario.
  altaUsuario(usuario: Usuario): Observable<Sesion> {
    return this.http.post<any>(`${environment.API_URL}api/Usuario/altaUsuario`, usuario);
  }

  UpdateUsuario(usuario:Usuario): Observable<any>{
    return this.http.put<any>(`${environment.API_URL}api/Usuario/Update`,usuario)
  }

  //PARA REVISION
  //Identificacion de usuario en el sistema.
//  LoginUsuario(login: LoginEntity) : Observable<Sesion> {
//    return this.http.get<any>(`${environment.API_URL}api/Usuario/Login`,{
//      params: new HttpParams().set('login', JSON.stringify(login))
//    });
//  }

 LoginUsuario(login: LoginEntity) : Observable<Sesion>{
 return this.http.post<any>(`${environment.API_URL}api/Usuario/Login`,login);
 }

 //Crea un viaje nuevo.
  AltaViaje(viaje:Viajes): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}api/Viaje/AltaViaje`,viaje)
  }

 //Devuelve listado de viajes que busca un usuario.
  ObtenerViaje(viaje:Viajes,IDUsuarioLog:number, all:string): Observable<ListaViaje> {
    // return this.http.post<any>(`${environment.API_URL}api/Viaje/ObtenerViajes`,viaje)
    return this.http.get<any>(`${environment.API_URL}api/Viaje/ObtenerViajes`,{
      params:new HttpParams().set('viaje',JSON.stringify(viaje))
      .set('IDUsuarioLog',IDUsuarioLog.toString())
      .set('all',all)
    })

  }

  ObtenerViajesSol(IDUsuario:number,filtro:string): Observable<ViajesSol>{
    return this.http.get<any>(`${environment.API_URL}api/Usuarios/ViajesSolicitados`,{
      params:new HttpParams().set('IDUsuario',IDUsuario.toString())
      .set('filtro',filtro)
    })
  }

  //Obtener solicitud de viaje
  ObtSolicitud(IDUsuario:number,Filtro:number,TipoSolicitud:number){

     return this.http.get<any>(`${environment.API_URL}api/Solicitud/GetSolicitud`,{
      params:new HttpParams().set('IDUsuario',IDUsuario.toString())
      .set('Filtro',Filtro.toString())
      .set('TipoSolicitud',TipoSolicitud.toString())
     });
  }


  ObtenerViajeUsuario(idUsuario: number,Estado:string){
    return this.http.get<any>(`${environment.API_URL}api/Usuario/ViajesUser`,{
      params:new HttpParams().set('IDusuario',idUsuario.toString())
      .set('Estado',Estado)
    })
  }

  ObtenerDatoViaje(IDViaje:number): Observable<ListaViaje>{
    return this.http.get<any>(`${environment.API_URL}api/Viajes/DatoViaje`,{
      params:new HttpParams().set('IDViaje',IDViaje.toString())
    })
  }

  SolicitarViaje(solicitud:SolicitudViaje): Observable<any> {
      return this.http.post<any>(`${environment.API_URL}api/Solicitud/AltaSolicitud`,solicitud);
  }

  UpdateViaje(viaje:Viajes)
  {
    return this.http.put<any>(`${environment.API_URL}api/Viaje/UpdateViaje`,viaje);
  }

    ObtenerId(id:number){
      this.IDUser=id;
      this.ObtenerID.next(this.IDUser);
    }


    RechazarSol(IDSolicitud:number,TipoUsuarioSolicitante:string){
      return this.http.get<any>(`${environment.API_URL}api/Solicitud/Rechazar`,{
        params:new HttpParams().set('IDSolicitud',IDSolicitud.toString())
        .set('TipoUsuarioSolicitante',TipoUsuarioSolicitante)
      });
    }

    //Ver como ahcer PUT
    AceptarSol(IDSolicitud: number,TipoUsuarioSolicitante: string)
    {//DEBERIA SER PUT
      return this.http.get<any>(`${environment.API_URL}api/Solicitud/Aceptar`,{
        params:new HttpParams().set('IDSolicitud',IDSolicitud.toString())
        .set('TipoUsuarioSolicitante',TipoUsuarioSolicitante)
      });
    }

    GetNotificaciones (IDUsuario:number)
    {
      return this.http.get<any>(`${environment.API_URL}api/Solicitud/Notificaciones`,
      {params:new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
    }

    ObtenerIntegrantes(IDViaje:number)
    {
      return this.http.get<any>(`${environment.API_URL}api/Viaje/Integrantes`,{
        params:new HttpParams().set('IDViaje',IDViaje.toString())
      })
    }

    BajarseViaje(modViaje:ModViaje)
    {
      //Deberia hacerse con metodo delete
      return this.http.post<any>(`${environment.API_URL}api/Viajes/Bajarse`,modViaje)
    }

    BajaViaje(IDViaje:number)
    {
      return this.http.post<any>(`${environment.API_URL}api/Viajes/DarBaja`,IDViaje);
    }

    Calificacion(IDUsuario:number): Observable<Calificacion>
    {
      return this.http.get<any>(`${environment.API_URL}api/Usuario/Calificacion`,{
        params:new HttpParams().set('IDUsuario',IDUsuario.toString())
      })
    }


    LeerNotificacion(IDMensaje:number)
    {
      //Deberia ser PUT
      return this.http.get<any>(`${environment.API_URL}api/Solicitud/LeerNotificacion`,{
        params:new HttpParams().set('IDMensaje',IDMensaje.toString())
      })
    }


    AltaCalificacion(calificacion:Calificacion)
    {
      return this.http.post<any>(`${environment.API_URL}api/Usuario/AltaCalificacion`,calificacion)
    }


    ValidaCalificacion(IDCalifica:number,IDCalificado:number)
    {
      return this.http.get<any>(`${environment.API_URL}api/Usuario/ValidaCalificacion`, {
        params:new HttpParams().set('IDCalifica',IDCalifica.toString())
        .set('IDCalificado',IDCalificado.toString())
      })
    }


    AltaVehiculo(vehiculo:Vehiculo)
    {
      return this.http.post<any>(`${environment.API_URL}api/Usuario/AltaVehiculo`,vehiculo)
    }

    UpdateToken(IDUsuario:number,Token:string)
    {
      return this.http.get<any>(`${environment.API_URL}api/Usuario/UpdateToken`,{
        params:new HttpParams().set('IDUsuario',IDUsuario.toString())
        .set('Token',Token)
      })
    }


    CerrarViajes(){

      return this.http.put<any>(`${environment.API_URL}api/Viaje/CerrarViaje`,null);

    }

    CerrarViajeUsuario(IDViaje:number){
      return this.http.get<any>(`${environment.API_URL}api/Viaje/CerrarViajeUsuario`,{
        params: new HttpParams().set('IDViaje',IDViaje.toString())
      })
    }


    EmailIntegrantes(IDViaje:number,IDUsuario:number)
    {
      return this.http.get<any>(`${environment.API_URL}api/Viaje/EmailsIntegrantes`,{
        params: new HttpParams().set('IDViaje',IDViaje.toString())
        .set('IDUsuario',IDUsuario.toString())
      })
    }



}
