import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Email, EmailIntegrantes } from '../Entidades/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }


  EmailRegistro(email:Email): Observable<any>{
    // const body = {to:email.to,
    //   subject:email.subject,
    // mensaje:email.mensaje};

    // return this.http.post<any>(`http://localhost:55214/api/Email/EnvioCorreo`,email)
    return this.http.post<any>(`${environment.API_URL}api/Email/EnvioCorreo`,email)

  }


  EmailCancelacion(email:EmailIntegrantes): Observable<any>{
  //   const body = {to:email.to,
  //   subject: email.subject,
  // mensaje: email.mensaje}

  // return this.http.post<any>(`http://localhost:3000/sendemail`,body)
  return this.http.post<any>(`${environment.API_URL}api/Email/EnvioCorreoI`,email)
  }


  EmailEdicion (email:EmailIntegrantes): Observable<any>{
    // const body = {
    //   to:email.to,
    //   subject: email.subject,
    //   mensaje: email.mensaje
    // }

    // return this.http.post<any>(`http://localhost:3000/sendemail`,body)
    return this.http.post<any>(`${environment.API_URL}api/Email/EnvioCorreoI`,email);
  }



}
