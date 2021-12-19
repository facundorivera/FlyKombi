import { Component, OnInit } from '@angular/core';
import { Sesion } from '../Entidades/sesion';
import { Usuario } from '../Entidades/usuario';
import { LocalStorageService } from '../services/local-storage.service';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  disablee:boolean=true;
  idUser:number;
  Usuario:Usuario= new Usuario();
  //Datos del usuarios
  Nombre:String;
  Apellido:string;
  Email:string;
  Celular:number;
  Sexo:string;
  Localidad: string;
  Edad:number;
  Direccion:string;
  Facebook:string;
  Instagram:string;
  Twitter:string;
  Pinterest:string;
  Imagen:any;

  //Fin datos de usuario

  //ID Dashboard
  ID:number;
  sesion:Sesion= new Sesion();
  LisUsers:Usuario[];

  constructor(private servicio: UsuarioService, private lstorage:LocalStorageService) { }
  url ="..";
  ngOnInit(): void {
    this.servicio.ObtenerIDObservable.subscribe(res=>{
      this.ID=res;
    })

    this.sesion= this.lstorage.get('sesion');
    

    this.servicio.getUsuario(this.sesion.IDUsuario).subscribe(
      res=>{
        this.Usuario = res;
        //console.log(this.Usuario);
        //LLeno Objeto con datos
        this.idUser=this.Usuario.IDUsuario;
        this.Nombre=this.Usuario.Nombre;
        this.Apellido=this.Usuario.Apellido;
        this.Email=this.Usuario.Email;
        this.Direccion=this.Usuario.Dirección;
        this.Localidad=this.Usuario.Localidad;
        this.Celular=this.Usuario.Celular;
        this.Sexo = this.Usuario.Sexo;
        this.Edad = this.Usuario.Edad;
        this.Facebook = this.Usuario.Facebook;
        this.Instagram = this.Usuario.Instagram;
        this.Twitter = this.Usuario.Twitter;
        this.Pinterest = this.Usuario.Pinterest;
        this.url = atob(this.Usuario.Imagen);
        this.Imagen = this.Usuario.Imagen;
  
      }
    )

    
  }

  

  Modificar(){
    this.disablee=false;
  }


  Actualizar(){
    this.servicio.UpdateUsuario(this.FillObjUser()).subscribe(
      res=>{

        Swal.fire({
          text:'Usuario Actualizado',
          timer:2000
        })
        this.disablee = true;
        
      },
      error=>{
       Swal.fire({
         title:'Ups, Ocurrió un problema',
         text:'Intente nuevamente mas tarde',
         timer:2000
       })
      }
    )
  }

  FillObjUser(): Usuario{
    this.Usuario.Nombre=this.Nombre.toString();
    this.Usuario.Apellido=this.Apellido.toString();
    this.Usuario.Email=this.Email;
    this.Usuario.Edad=this.Edad;
    this.Usuario.Localidad=this.Localidad;
    this.Usuario.Dirección=this.Direccion;
    this.Usuario.Sexo=this.Sexo;
    this.Usuario.Celular=this.Celular;
    this.Usuario.Instagram = this.Instagram;
    this.Usuario.Facebook=this.Facebook;
    this.Usuario.Pinterest=this.Pinterest;
    this.Usuario.Twitter=this.Twitter;
    
    this.Usuario.Imagen = this.Imagen;
    //console.log(this.Usuario.Imagen);

    return this.Usuario
    
  }

  
  

  SubirFoto(e){
    // console.log('subir',e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload=(event:any)=>{
      this.url = event.target.result;
      this.Imagen = btoa(this.url);
      console.log(this.url);
    }
    
  }


}
