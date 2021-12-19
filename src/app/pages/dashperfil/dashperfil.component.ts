import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Email } from 'src/app/Entidades/email';
import { ListaChat, Mensaje } from 'src/app/Entidades/mensaje';
import { Sesion } from 'src/app/Entidades/sesion';
import { listNotif, SolInfo } from 'src/app/Entidades/Solicitud';
import { ChatUsuarioService } from 'src/app/services/chat-usuario.service';
import { EmailService } from 'src/app/services/email.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';
import { FirebasepushService } from 'src/app/services/firebasepush.service';


@Component({
  selector: 'app-dashperfil',
  templateUrl: './dashperfil.component.html',
  styleUrls: ['./dashperfil.component.scss']
})
export class DashperfilComponent implements OnInit {

  //Definicion clases
  sesion:Sesion= new Sesion();
  Solicitud:SolInfo[];
  chat:Mensaje = new Mensaje();

  cantNotif:number=0;
  cantResp:number=0;
  cantTotal: number=0;
  cantMensajes:number=0;
    
  // Usuario:Usuario = new Usuario();
  // LisUsers:Usuario[];

  listNotif:listNotif[];
  /*Mensajes*/
  listMensajes:Mensaje[];
  listnoleidos:Mensaje[];
  chatusuario:Mensaje[];
  IDEmisor:number;
  IDReceptor:number;
  NombreEmisor:string;
  EmailEmisor:string;
  EmailReceptor:string;
  /*Mensajes*/
  mensajes:any;

  FechaSolicitud:string;
  MensajeSolicitud:string;

  //Ocultar numero de notificaciones si es cero
  Hide:string='';
  prueba:String='';
  //Listado conversaciones a mostrar cuando selecciona los chat
  listConversaciones:ListaChat[];
  email:Email = new Email();
  indexviaje:number;

  constructor(private locals:LocalStorageService, 
    private userservice:UsuarioService, 
    private chatService:ChatUsuarioService,
    private Rutas: Router,
    private emailservice:EmailService,
    private push:FirebasepushService,
    private rutas:Router) { }
    url ="..";
    urlEmisor = "..";
    UrlchatEmisor ="..";
    UrlChatReceptor ="..";

  ngOnInit(): void {
    this.sesion=this.locals.get('sesion');
    this.url = atob(this.sesion.Imagen);
    // console.log(this.sesion.Imagen);
    this.GetNotificaciones();
    this.GetMensajes();

       //Recibe notificaciones en primero plano
       this.push.RecibeMensaje().subscribe(payload=>{
        console.log(payload);
        this.GetMensajes();
        this.GetNotificaciones();
        this.userservice.LeerMensaje.next(1);
      })

    this.CerrarViajes();
}



  GetNotificaciones(){
    this.userservice.GetNotificaciones(this.sesion.IDUsuario).subscribe(
      res=>{
        this.listNotif=Object.values(res);
        // console.log(this.listNotif.length);
        this.cantNotif=this.listNotif.length;
        if (this.cantNotif <=0){
          this.Hide='d-none'
        } else
        {
          this.Hide ='';
        }
       })}

  LeerNotificacion(index:number){
   this.userservice.LeerNotificacion(
     this.listNotif[index].IDMensaje,
   ).subscribe(
     res=>{
       this.GetNotificaciones();
     },
     error=>{
       alert('Hubo un problema crack')
     })}

  GetMensajes(){


    this.chatService.GetMensajes(this.sesion.IDUsuario).subscribe(
      res => {
        this.listMensajes=Object.values(res);
        
        //Filtro por toos los chat no leidos que y que sean para el usuario actual
        this.listnoleidos = this.listMensajes.filter(x=> x.Leido=='No').filter(x=>x.IDReceptor==this.sesion.IDUsuario);
        // console.log(this.listnoleidos);
        
      
        this.cantMensajes = this.listnoleidos.length;
      },
      error =>{
        alert("Hubo un problema perri")
      })}


  ChatUsuario(IDEmisor:number,IDReceptor:number){
  // this.LeerMensaje(this.IDEmisor,this.IDReceptor);
  this.LeerMensaje(IDEmisor,IDReceptor)
  this.MostrarChat(IDEmisor);

  // this.GetMensajes();

  }

  // EnviarMensaje(){
  //   this.chat.IDEmisor =this.locals.get('sesion').IDUsuario;
  //   //IDEmisor obtenido en el metodo de arriba cuando abre el chat. (Ahora seria receptor)
  //   this.chat.IDReceptor = this.IDEmisor;
  //   this.chatService.AltaMensaje(this.chat).subscribe(
  //     res=>{
  //       this.EnviarCorreo();
  //       this.ChatUsuario(this.indexviaje);
  //       console.log(this.indexviaje)
  //       //Limpio mensaje cuando lo envia
  //       var value =(document.getElementById('boxmensaje') as HTMLInputElement).value='';
  //     },
  //     error=>{
  //       Swal.fire({
  //         title:'Ups, algo ocurrio',
  //         text:'Error al enviar',
  //       })
  //     }
  //   )
  // }

  LeerMensaje(IDEmisor:number,IDReceptor:number){
  this.chatService.LeerChat(IDEmisor,IDReceptor).subscribe(
    res=>{
      //llamo nuevamente el metodo para referescar los mensajes no leidos.
        this.GetMensajes();
    },
    error=>{
        console.log('Mensaje no leido');
    }
  )

  }

  GetConversaciones()
  {
    this.chatService.GetListadoConversaciones(this.sesion.IDUsuario).subscribe(
      res => {
        this.listConversaciones = Object.values(res);
        // console.log(this.listConversaciones);
      },
      error =>{
      }
    )
  }


  MostrarChat(IDUsuario:number){
    // this.GetMensajes();
    this.chatService.IDChat.next(IDUsuario);
    this.Rutas.navigateByUrl(`/dashperfil/conversacion/${IDUsuario}`)

  }

  EnviarCorreo(){

    this.email.mensaje = this.chat.Mensaje;
    this.email.subject = `Nuevo Mensaje de ${this.locals.get('sesion').Nombre}`

    this.emailservice.EmailRegistro(this.email).subscribe(
      res=>{

      },
      error=>{

      })}

  Probandojs(){

    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      (<any>$('.sidebar .collapse')).collapse('hide');
    };

  }

  Convertimg(index:number):any{
  return this.urlEmisor = atob(this.listnoleidos[index].ImagenEmisor)
  
  }

  SalirDashboard(){

    Swal.fire({
      title:'¿Todo Listo para el viaje?',
      showConfirmButton:true,
      showCancelButton:true,
      confirmButtonText:'Si!',
      cancelButtonText:'No'
    }).then((result)=>{
      if (result.isConfirmed)
      {
        this.rutas.navigateByUrl('/home');
      }
    })

  }

  CerrarViajes(){
    this.userservice.CerrarViajes().subscribe(
      res=>{
        console.log('Se cerraron')
      },
      error=>{
        console.log('No se cerraron')
      }
    )
  }

}
