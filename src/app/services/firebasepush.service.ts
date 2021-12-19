import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { UsuarioService } from './usuario.service';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FirebasepushService {

  tokenvar:string='';
 private TokenFirebase = new Subject<string>();
 ObtenerToken = this.TokenFirebase.asObservable();
 Mensajesoli:string='';
 Mensajebackground = new BehaviorSubject(0);

  constructor(private http: HttpClient,private locals:LocalStorageService,private Uservice:UsuarioService, private afMessaging: AngularFireMessaging) { }

  SolicitarPermisos(){
    this.afMessaging.requestToken
    .subscribe(
      (token) => { console.log('Permission granted! Save to the server!', token);
      //sessionStorage.setItem('token',token);
      this.tokenvar = token;
      // this.Uservice.UpdateToken(this.locals.get('sesion').IDUsuario,token);
      if (this.tokenvar !== '')
      {
        this.Uservice.UpdateToken(this.locals.get('sesion').IDUsuario,this.tokenvar).subscribe(
          res=>{

          }
        )
      }
    },
      (error) => { console.error(error); },  
    )
    //this.Uservice.UpdateToken(this.locals.get('sesion').IDUsuario,this.tokenvar)
  }

  MensajeSolicitudPush(tokenfirebase:string,Usuario:string): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization','key=AAAA2BBSdj0:APA91bEtnIQYeucuMAMiazo6aMds7sFFtWqsxzdCjweSbvhI63TNads8-CPldo-fizSSpc_1H719ujyXolL-nw_iKifFTdyjnvPllmRnmXD3YzxUZVWnIDaTPO1JmmJkpeaE1wmSu5Jz');

    const body = {
      "notification":{
        "title":"Nueva Solicitud de viaje",
        "body": `El usuario ${Usuario} quiere viajar con vos!!!`

      },
      "to": `${tokenfirebase}` 
    }
    return this.http.post<any>('https://fcm.googleapis.com/fcm/send',body,{'headers':headers})
  }

  MensajePrivado(tokenfirebase:string,Usuario:string,Mensaje:string): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization','key=AAAA2BBSdj0:APA91bEtnIQYeucuMAMiazo6aMds7sFFtWqsxzdCjweSbvhI63TNads8-CPldo-fizSSpc_1H719ujyXolL-nw_iKifFTdyjnvPllmRnmXD3YzxUZVWnIDaTPO1JmmJkpeaE1wmSu5Jz');


    const body ={
      "notification":{
        "title":`Nuevo Mensaje de ${Usuario}`,
        "body":`${Mensaje}`
      },
      "to": `${tokenfirebase}`
    }
    return this.http.post<any>('https://fcm.googleapis.com/fcm/send',body,{'headers':headers})
    
  }

  AceptarSolicitud(tokenfirebase:string,Usuario:string,solicitud:string): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization','key=AAAA2BBSdj0:APA91bEtnIQYeucuMAMiazo6aMds7sFFtWqsxzdCjweSbvhI63TNads8-CPldo-fizSSpc_1H719ujyXolL-nw_iKifFTdyjnvPllmRnmXD3YzxUZVWnIDaTPO1JmmJkpeaE1wmSu5Jz');

    if (solicitud='Aceptada')
    {
      this.Mensajesoli = `El usuario ${Usuario} aceptó tu Solicitud`;
    }
    else{
      this.Mensajesoli = `El usuario ${Usuario} rechazó tu Solicitud`;
    }
    
    const body = {
      "notification":{
        "title":`Solicitud ${solicitud}`,
        "body":`${this.Mensajesoli}`
      },
      "to":`${tokenfirebase}`
    }

    return this.http.post<any>('https://fcm.googleapis.com/fcm/send',body,{'headers':headers})

  }

  BajaViaje(tokenfirebase:string,usuario:string):Observable<any>{

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization','key=AAAA2BBSdj0:APA91bEtnIQYeucuMAMiazo6aMds7sFFtWqsxzdCjweSbvhI63TNads8-CPldo-fizSSpc_1H719ujyXolL-nw_iKifFTdyjnvPllmRnmXD3YzxUZVWnIDaTPO1JmmJkpeaE1wmSu5Jz');

    const body = {
      "notification":{
        "title":'Baja Viaje',
        "body":`El usuario ${usuario} se bajó del viaje`
      },
      "to":`${tokenfirebase}`
    }
    return this.http.post<any>('https://fcm.googleapis.com/fcm/send',body,{'headers':headers})

  }

  private observablemensaje = new Observable (observe =>{
    this.afMessaging.onMessage(payload => {
      observe.next(payload)
    })
  })

  RecibeMensaje(){
    return this.observablemensaje;
  }

  // private Background = new Observable (observe =>{
  //   this.afMessaging.onBackgroundMessage(mensaje =>{
  //     observe.next(mensaje)
  //   })
  // })

  // LeerMensaje(){
  //   return this.Background;
  // }

  
  // private ObservableOnChat = new Observable (observe =>{
  //   this.afMessaging.onMessage(payload => {
  //     observe.next(payload)
  //   })
  // })

  // RecibeOnChat(){
  //   return this.ObservableOnChat;
  // }





  


}
