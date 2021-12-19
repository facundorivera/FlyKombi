import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {SolInfo,SolicitudViaje} from '../../Entidades/Solicitud';
import { Sesion } from 'src/app/Entidades/sesion';
import {LocalStorageService} from '../../services/local-storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { Email } from 'src/app/Entidades/email';
import { FirebasepushService } from 'src/app/services/firebasepush.service';

@Component({
  selector: 'app-solictudes',
  templateUrl: './solictudes.component.html',
  styleUrls: ['./solictudes.component.scss']
})
export class SolictudesComponent implements OnInit {

  //Modificar Formualario Viajes
  modForm:boolean=true;
  solicitud:SolInfo = new SolInfo();
  sesion:Sesion = new Sesion();
  IDUsuario:number;

  altaSol:SolicitudViaje = new SolicitudViaje();
  //Index para rechazar o aceptar
  i:number;
  //Inicio Datos Solicitudes
  NombreSol:string;
  ApellidoSol:string;
  EstadoSol:string;
  IDViaje: number;
  FechaSol: string;
  IDSolicitud:number;
  TipoUsuarioSolicitante:string;
  //Fin Datos Solicitud

  //Class Binding Botones
  Hide:string;
  //Class Binding botones modal
  Hidebtn:String;
  hideSolicitud:string='d-none'

  listadoSol : SolInfo[];
  listado:any;
 
  valorfiltro:number;
  email:Email = new Email();
  tokenfirebase:string;
  estadosoli:string;
  constructor(private push:FirebasepushService ,private router:Router, private usuarioservice:UsuarioService, private localSesion: LocalStorageService,
    private emailservice:EmailService ) { }

  ngOnInit(): void {
    this.Hide="d-none";
     this.sesion = this.localSesion.get('sesion');
     this.ObtenerSolicitudes(this.sesion.IDUsuario,0,0);
  }


  MostrarDatos(index:number)
  {
    this.i=index;
     //Oculto botones de ventana modal
     if (this.listadoSol[index].EstadoSol!="Pendiente")
     {
        this.Hidebtn="d-none";
     }
        this.IDSolicitud=this.listadoSol[index].IDSolicitud;
        this.NombreSol = this.listadoSol[index].NombreSol;
        this.ApellidoSol = this.listadoSol[index].ApellidoSol;
        this.FechaSol = this.listadoSol[index].FechaSolicitud;
        this.EstadoSol = this.listadoSol[index].EstadoSol;
    
  }

  filtro(valor:any){
    //Envio cero para ver soliciutdes recibidas
    this.valorfiltro = Number(valor.target.value);
    this.ObtenerSolicitudes(this.localSesion.get('sesion').IDUsuario,this.valorfiltro,0)

  }


  // Inicio Aceptar y Rechazar Solicitudes
  RechazarSol(index:number)
  {
    this.RechazarSolicitudes(index);
    this.ObtenerSolicitudes(this.sesion.IDUsuario,0,0)
  }

  AceptarSol(index:number){
    this.AceptarSolicitudes(index);  
    // this.ObtenerSolicitudes(this.sesion.IDUsuario,0,0);
  }
  //Fin Aceptar y Rechazar Solicitudes

  ObtenerSolicitudes(IDUsuario: number,Filtro:number,TipoSolicitud:number)
  {
    //Se envia valor cero porque son solicutdes pendientes
    this.valorfiltro = Filtro;
    this.usuarioservice.ObtSolicitud(IDUsuario,Filtro,TipoSolicitud).subscribe(
      res=>{
        this.listado = res;
        // console.log(this.listado);
        //Transformo en array lo que me devuelve la API.
        this.listadoSol = Object.values(this.listado);

        // console.log('Solicitudes',this.listadoSol);
      },
      error=>{
        console.log(error);
      });
  }


  RechazarSolicitudes(index:number)
  {
    this.EnvioServicio(index)
  }

  AceptarSolicitudes(index:number){

      //Envio tipo de Usuario y de acuerdo a eso el endopoint utiliza un sp u otro.
      this.usuarioservice.AceptarSol(this.listadoSol[index].IDSolicitud,this.listado[index].TipoUsuarioSolicitante).subscribe(
        res=>{
          this.email.to=this.listadoSol.find(x=> x.IDSolicitud==this.listadoSol[index].IDSolicitud).EmailSol;
          this.tokenfirebase = this.listadoSol.find(x=>x.IDSolicitud==this.listadoSol[index].IDSolicitud).TokenFirebase;
          this.EnvioEmailceptada();
          this.EnvioPushAceptado('Aceptada');
         
            Swal.fire({
            icon: 'success',
            title: 'Genial!',
             text:'Aceptaste la Solicitud',
             showConfirmButton: false,
             timer: 1500
           })
           this.ObtenerSolicitudes(this.sesion.IDUsuario,this.valorfiltro,0)
          
          
        },
        error=>{
          alert('Problema al enviar')
        }
      )
    // }
  }

  //Metodo para enviar respuesta de solicitudes 
  EnvioServicio(index:number)
  {
    this.TipoUsuarioSolicitante = this.listadoSol[index].TipoUsuarioSolicitante;
    this.IDSolicitud=this.listadoSol[index].IDSolicitud;
    this.usuarioservice.RechazarSol(this.IDSolicitud,this.TipoUsuarioSolicitante).subscribe(
      res=>{
        this.email.to=this.listadoSol.find(x=> x.IDSolicitud==this.listadoSol[index].IDSolicitud).EmailSol;
        this.tokenfirebase=this.listadoSol.find(x=> x.IDSolicitud==this.listadoSol[index].IDSolicitud).TokenFirebase;
        this.EnvioEmailRechazada();
        this.EnvioPushAceptado('Rechazada');
        Swal.fire({
          title:'Ups!',
          text:'Rechazaste la Solicitud',
          timer:2000
        })
        this.ObtenerSolicitudes(this.sesion.IDUsuario,this.valorfiltro,0)
        
      },
      error=>{
        Swal.fire({
          title:'Ocurrio un problema',
          text:'Porfavor intenta nuevamente mas tarde',
          timer:2000
        })
      }
    )
  }


  EnvioEmailceptada(){

    this.email.mensaje = `El usuario ${this.localSesion.get('sesion').Nombre} aceptó tu solicitud!`;
    this.email.subject = `Tu solicitud fue aceptada, Felicidades!!!`;

    this.emailservice.EmailRegistro(this.email).subscribe(
      res=>{
      
      },
      res=>{

      })
    }

    EnvioEmailRechazada(){

      this.email.mensaje = `El usuario ${this.localSesion.get('sesion').Nombre} aceptó tu solicitud!`;
      this.email.subject = `Tu solicitud fue rechazada :C, Sigue buscando!!!`;
  
      this.emailservice.EmailRegistro(this.email).subscribe(
        res=>{
        
        },
        res=>{
  
        }
      )}

    EnvioPushAceptado(solicitud:string){
      
      this.push.AceptarSolicitud(this.tokenfirebase,this.sesion.Nombre,solicitud).subscribe(
        res=>{
          // console.log('notificacion aceptada enviada')
           console.log(this.tokenfirebase,this.sesion.Nombre,solicitud)
        },  
        error=>{
            console.log('notificacion aceptada no enviada')
        }
      )
    }


    //Metodo para redireccionar al perfil del usuario cuando se hace click en su nombre en la solicitud.
    RedireccionarPerfil(index:number){
      // console.log(index);
      this.usuarioservice.IDUsuario.next(index);
      this.router.navigateByUrl(`/perfiluser/${index}`)

    }


}
