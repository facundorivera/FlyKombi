import { Component, OnInit, ɵflushModuleScopingQueueAsMuchAsPossible } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensaje } from 'src/app/Entidades/mensaje';
import { ChatUsuarioService } from 'src/app/services/chat-usuario.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FirebasepushService } from 'src/app/services/firebasepush.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-conversaciones',
  templateUrl: './conversaciones.component.html',
  styleUrls: ['./conversaciones.component.scss']
})
export class ConversacionesComponent implements OnInit {

    chat:Mensaje[];
    IDUsuario:number;
    newMensaje:Mensaje = new Mensaje();
    IDReceptor:number;
    urlEmisor="..";
    urlReceptor="..";
    tokenfirebase:string;
    imagenusuario:string;
    imagenusuariob:string;

  constructor(private push:FirebasepushService,  private _route:ActivatedRoute,private ruta:Router,private chats:ChatUsuarioService,
    private lstorage:LocalStorageService, private uservice:UsuarioService) { }

  ngOnInit(): void {
       //Metodo para buscar chat de usuarios
       this.IDUsuario = this.lstorage.get('sesion').IDUsuario;
      this.getMensajes();

      this.uservice.LeerMensaje.subscribe(
        res=>{
          this.getMensajes();
        }
      )
    
  }

  EnviarMensaje(){
    this.newMensaje.IDEmisor = this.IDUsuario;
    this.newMensaje.IDReceptor = this.IDReceptor;
    console.log(this.chat);
    this.tokenfirebase = this.chat.filter(x=>x.TokenEmisor).find(x=>x.IDEmisor!==this.IDUsuario).TokenEmisor;

    this.chats.AltaMensaje(this.newMensaje).subscribe(
      res=>{
        console.log(res);
        this.EnviarMensajePush(this.tokenfirebase,this.lstorage.get('sesion').Nombre,this.newMensaje.Mensaje);
        this.uservice.LeerMensaje.next(this.newMensaje.IDReceptor);
        this.newMensaje.Mensaje = '';
        this.getMensajes();
        
        
      },
      error=>{

      }
    )

    
  }

  LeerMensaje(IDEmisor:number,IDReceptor:number){
     this.chats.LeerChat(IDEmisor,IDReceptor).subscribe(
       res=>{
        //llamo nuevamente el metodo para referescar los mensajes no leidos.
       },
       error=>{
           console.log('Mensaje no leido');
       }
     )

   }

  // GetImagesEmisor(index:number):any{

  //   console.log(atob(this.chat[index].ImagenEmisor));
  //   return this.urlEmisor=atob(this.chat[index].ImagenEmisor);
   
  // }

  // getImagesReceptor(index:number):any{
  //   return this.urlReceptor = atob(this.chat[index].ImagenReceptor);
  // }

  getMensajes(){
    this.chats.IDChat.subscribe(
      res=>{
        // this.chats.GetMensajes()
        this.IDReceptor = res;
          this.chats.GetChat(res,this.IDUsuario).subscribe(
            res2=>{
              this.chat = Object.values(res2);
              // this.LeerMensaje(res,this.IDUsuario);
              this.imagenusuario = atob(this.chat.find(x=>x.IDEmisor==this.IDUsuario).ImagenEmisor);
              this.imagenusuariob =atob(this.chat.find(x=>x.IDReceptor!==this.IDUsuario).ImagenReceptor);
              // this.tokenfirebase = this.chat.filter(x=>x.IDEmisor)
              
            }
          )})
  }


  EnviarMensajePush(TokenFirebase:string,Usuario:string,Mensaje:string){
    this.push.MensajePrivado(TokenFirebase,Usuario,Mensaje).subscribe(
      res=>{
        console.log('mensaje enviado correctamente');
        // console.log(TokenFirebase,Usuario,Mensaje)
      },
      error=>{
        console.log('problema al enviar mensaje');
      }
    )
  }

  // Leerchat(){
    

  // }

}
