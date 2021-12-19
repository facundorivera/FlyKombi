import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EmailService } from 'src/app/services/email.service';
import {ModViaje, ViajesSol} from '../../Entidades/viajes';
import {Email} from '../../Entidades/email';
import { NavigationStart, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FirebasepushService } from 'src/app/services/firebasepush.service';


@Component({
  selector: 'app-viajessol',
  templateUrl: './viajessol.component.html',
  styleUrls: ['./viajessol.component.scss']
})
export class ViajessolComponent implements OnInit {7

  viajes:ViajesSol = new ViajesSol();
  listadoviajes:ViajesSol[];
  listado:any;
  showhead:boolean=false;


  //mostrar datos viaje en ventana modal
    DirOrigen:string;
    DirDestino:string;
    Estado:string;
    UsRol: string;
    GastoTotal:number;
    FechaSalida:string;
    IDViaje:number;
    Indice:number;
    CantBuena:number;
    CantMala:number;
    tokenfirebase:string;
    EmailPublicante:string;
    Email:Email = new Email();
  //Modificar Formualario Viajes
  //Clase para bajarse del viaje
    bviaje:ModViaje = new ModViaje();
    valorfiltro:string="";

  constructor(private emailservice:EmailService, private push:FirebasepushService ,private service:UsuarioService, private lstorage:LocalStorageService, private rutas: Router) {
    rutas.events.forEach((event) =>{
      if (event instanceof NavigationStart){
        if (event['url']=='dashperfil/viajessol'){
          this.showhead=false;
        } else{
          this.showhead=true;
        }
      }
    });
   }

  ngOnInit(): void {
    

    this.ViajesSolicitados();
  }

  ViajesSolicitados(){
    this.service.ObtenerViajesSol(this.lstorage.get('sesion').IDUsuario,this.valorfiltro).subscribe(
      res=>{
        this.listado=res;
        this.listadoviajes=Object.values(this.listado);
        //console.log(this.listadoviajes);
      },
      error=>{

      }
    )}


    Datoviaje(index:number){
      //Indice para usar en la cancelacion como parametro
      this.Indice=index;
      //Completo variables para el formulario del viaje
      this.DirOrigen=this.listadoviajes[index].DirOrigen;
      this.DirDestino= this.listadoviajes[index].DirDestino;
      this.Estado= this.listadoviajes[index].EstadoViaje;
      this.UsRol = this.listadoviajes[index].TipoUsuario;
      this.IDViaje = this.listadoviajes[index].IDViaje;
      this.FechaSalida = this.listadoviajes[index].FechaSalida;
      this.GastoTotal = this.listadoviajes[index].GastoTotal;
      this.CantBuena = this.listadoviajes[index].CantBuena;
      this.CantMala = this.listadoviajes[index].CantMala;
      this.tokenfirebase = this.listadoviajes[index].TokenFirebase;
      this.EmailPublicante = this.listadoviajes[index].EmailPostulante;
      
      //Se guarda objeto en localstorage para leer en otra pestaña
      this.lstorage.set('infoviaje',this.listadoviajes[index])
    }

    BajarseViaje(index:number){
      this.bviaje.IDViaje=this.listadoviajes[index].IDViaje;
      this.tokenfirebase = this.listadoviajes[index].TokenFirebase;
       this.bviaje.IDusuario = this.lstorage.get('sesion').IDUsuario;
       this.EmailPublicante = this.listadoviajes[index].EmailPostulante;

       Swal.fire({
         title:'¿Estas seguro?',
         text:'Esta por bajarse del viaje',
         showDenyButton:true,
         showConfirmButton:true,
         confirmButtonText:'Si',
         denyButtonText:'No'
       }).then((result) => {


        if (result.isConfirmed){
          this.service.BajarseViaje(this.bviaje).subscribe(
            res=>{
              
              this.PushBajaViaje(this.tokenfirebase,this.lstorage.get('sesion').Nombre);
              this.BajaViajeEmail(index);
              this.ViajesSolicitados();       
              Swal.fire({
                text:'Se bajó del viaje',
                timer:2000
              })
              var value =(document.getElementById(`Estadoviaje${index}`) as HTMLInputElement).value ='Baja';
                          
           },
            error=>{
              Swal.fire
              ({
                title:'Ups,Ocurrió un problema',
                text:'Porfavor intente nuevamente mas tarde',
                timer:2000
              })
            }
          )}
       })}

    filtro(event:any){
    
      this.valorfiltro = event.target.value;
      this.ViajesSolicitados();

    }

    PushBajaViaje(tokenfirebase:string,usuario:string){

      this.push.BajaViaje(tokenfirebase,usuario).subscribe(
        res=>{
          // console.log('Mensaje enviado')
          // console.log(tokenfirebase,usuario)
        },
        error=>{
          // console.log('Mensaje no enviado')
        }
      )

    }



     BajaViajeEmail(index:number){

        this.Email.mensaje = `El Usuario ${this.lstorage.sesion.Nombre} se bajó del viaje ${this.bviaje.IDViaje}, que tenia como 
        origen ${this.listadoviajes[index].DirOrigen} y destino ${this.listadoviajes[index].DirDestino}`;
        this.Email.to = this.EmailPublicante;
        this.Email.subject = `Ups, un usuario decidió bajarse de tu viaje`;
        console.log(this.Email);
        this.emailservice.EmailRegistro(this.Email).subscribe(
          res=>{
            console.log('Mensaje enviado correctamente');
          },
          error=>{
            console.log('Mensaje no enviado por algun error');
          }
        )
    
      
     }



}
