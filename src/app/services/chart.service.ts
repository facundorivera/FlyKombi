import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }


  GetChartPerfil(IDUsuario:number){
    return this.http.get<any>(`${environment.API_URL}api/chart/PorcPerfil`,{
      params: new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }


  GetViajesMes(IDUsuario:number){
    return this.http.get<any>(`${environment.API_URL}api/chart/ViajesMes`,{
      params:new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }

  GetSolicitudesMes(IDUsuario:number){
    return this.http.get<any>(`${environment.API_URL}api/chart/SolicitudesMes`,{
      params:new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }

  GetGraficoxMes (IDUsuario:number){
    return this.http.get<any>(`${environment.API_URL}api/chart/ViajesxMes`,{
      params: new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }

  GetGraficoxMes2 (IDUsuario:number){
    return this.http.get<any>(`${environment.API_URL}api/chart/ViajesxMes2`,{
      params: new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }


  GetChartSolicitud(IDUsuario:number){
    return this.http.get<any>(`${environment.API_URL}api/chart/ChartSolicitudes`,{
      params: new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }

  GetChartSolicitud2(IDUsuario:number){
    return this.http.get<any>(`${environment.API_URL}api/chart/ChartSolicitudes2`,{
      params: new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }

  GetSolPendientes(IDUsuario:number){

    return this.http.get<any>(`${environment.API_URL}api/chart/SolPendientes`,{
      params:new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }

  getSolPendientesEnviadas(IDUsuario:number)
  {
    return this.http.get<any>(`${environment.API_URL}api/chart/SolPendientesEnv`,{
      params: new HttpParams().set('IDUsuario',IDUsuario.toString())
    })
  }

  getCalificaciones(IDUsuario:number,Estado:string)
  {
    return this.http.get<any>(`${environment.API_URL}api/chart/CantCalificaciones`,{
      params: new HttpParams().set('IDUsuario',IDUsuario.toString())
      .set('Estado',Estado)
    })
  }


}
