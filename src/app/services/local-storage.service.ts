import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Sesion} from '../Entidades/sesion'
import { ListaViaje, ViajesSol } from '../Entidades/viajes';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
sesion:Sesion= new Sesion();
ListadoCache:ListaViaje = new ListaViaje();
Usuario = new BehaviorSubject('');

  constructor() { }

  set(sesion: string,data:any){
    try{
      localStorage.setItem(sesion,JSON.stringify(data));

    }catch (e){
      console.log(e);
    }
  }

  get(sesion: string): Sesion{
    try{
      return this.sesion= JSON.parse(localStorage.getItem(sesion));
    }catch(e){
      console.log(e);
    }
  }


  getinfoviaje(sesion: string): ViajesSol{
    try{
      return this.sesion= JSON.parse(localStorage.getItem(sesion));
    }catch(e){
      console.log(e);
    }
  }

  

  remove(key: string){
    try{
      return JSON.parse(localStorage.getItem(key));
    }catch(e){
      console.log(e);
    }
  }

  clear():void{
    localStorage.clear();
  }

  Almacenar(IDUsuario:number):number{

    return IDUsuario;

  }

  CacheViaje(Listado:ListaViaje){

    this.ListadoCache = Listado;
  }

  GetCacheViaje():ListaViaje{
    return this.ListadoCache;
  }
}
