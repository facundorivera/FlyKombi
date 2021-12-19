import { DatePipe,formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Email,EmailIntegrantes } from 'src/app/Entidades/email';
import { Mensaje } from 'src/app/Entidades/mensaje';
import { Sesion } from 'src/app/Entidades/sesion';
import { Integrantes, ListaViaje, Viajes } from 'src/app/Entidades/viajes';
import { ChatUsuarioService } from 'src/app/services/chat-usuario.service';
import { EmailService } from 'src/app/services/email.service';
import { FirebasepushService } from 'src/app/services/firebasepush.service';
import { LeafletService } from 'src/app/services/leaflet.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss'],
  providers:[DatePipe]
})

export class ViajesComponent implements OnInit {

  prparada: google.maps.places.Autocomplete;
  sgparada: google.maps.places.Autocomplete;
  trparada: google.maps.places.Autocomplete;
  paradaA= {lat:0,lng:0};
  paradaB={lat:0,lng:0};
  paradaC = {lat:0,lng:0};
  map:google.maps.Map;
  marker: google.maps.Marker;
  drestantesviaje:number;
  restantes:string[];
  fechasalida:string[];
  //Variable de Modificacion
   intMod:number=0;
   Indice:number;
  //Variables para completar formulario viaje
    DirOrigen:string;
    DirDestino:string;
    DirPrParada:string;
    DirSgParada:string;
    DirTrParada:string;
    //Puntos Intermedios
    LatPrParada:string='';
    LngPrParada:string='';
    LatSgParada:string;
    LngSgParada:string;
    LatTrParada:string;
    LngTrParada:string;
    //Fin Puntos Intermedios
    Estado:string;
    UsRol: string;
    FechaSalida:string;
    IDViaje:number;
    DuraValor:number;
    DuraText:string;
    DistValor:number;
    DistText:string;
    HoraSalida:string;

    Updateviaje:Viajes = new Viajes();
  //Modificar Formualario Viajes
   modForm:boolean=true;
   //Sesion Entidad
   sesion:Sesion= new Sesion();
   listado:any;
   viaje:ListaViaje[];
  //Mostrar header navVar
  showhead:boolean=false;
  closeModal:string;
  FechaHoy:string;
  FechaHoyControl:string;

  IDInput:number;
  Filtro:string='';
  //Integrantes del viaje
  listaintegrantes:any;
  listaemails:any;
  integrantes:Integrantes[];
  date:any;
  src:string[];
  idintegrante:number[];
  tokenfirebase:string[];
  TokenIntegrante:string;
  NombreIntegrante:string;
  Email:Email = new Email();
  mensaje: Mensaje = new Mensaje();
  emailcancelacion:string[];
  EIntegrantes:EmailIntegrantes = new EmailIntegrantes();
  ngOnInit(): void {
  
    
    this.sesion=this.locals.get('sesion');
    //Mostrar Viajes cuando se abre la pestaña
    this.userservice.ObtenerViajeUsuario(this.sesion.IDUsuario,this.Filtro).subscribe(
      res=>{
        this.listado=res;
        //Tansformo en vector Lviajes, devuelto por API Rest
        this.viaje=Object.values(this.listado);
        this.fechasalida = this.viaje.filter(x=>x.FechaSalida).map(x=>x.FechaSalida);
        
      },
      error=>{
      }
    );
 

  }
  constructor( private email:EmailService, 
    private datePipe:DatePipe,
    private Places:LeafletService, 
    private rutas:Router, 
    private locals:LocalStorageService,
    private userservice:UsuarioService,
    private chat:ChatUsuarioService,
    private push:FirebasepushService){
    rutas.events.forEach((event) =>{
      if (event instanceof NavigationStart){
        if (event['url']=='dashperfil/misviajes'){
          this.showhead=false;
        } else{
          this.showhead=true;
        }
      }
    });

    const fechahoy = Date.now();
    const Fechaformato = this.datePipe.transform(fechahoy,'yyyy/MM/dd');
    const FechaControl = this.datePipe.transform(fechahoy,'yyyy-MM-dd')
    this.FechaHoyControl = FechaControl;
    this.FechaHoy = Fechaformato;
    // console.log(this.FechaHoy);
    
  }


  Modificar(){
    this.intMod++;
  }

  Confirmar(index:number){
    this.modForm=true;
    if (this.intMod =1){

      // console.log(this.FechaSalida);
      // console.log(this.datePipe.transform(this.viaje[index].FechaSalida,'yyyy-MM-dd'));
      // console.log(this.HoraSalida)
      // console.log(this.viaje[index].HoraSalida)

      if (this.FechaSalida != this.datePipe.transform(this.viaje[index].FechaSalida,'yyyy-MM-dd'))
      {
        this.ObtenerIntegrantes(this.viaje[index].IDViaje,'No','Si')
        console.log('Email de edicion de viaje enviado!');
      }


      this.Updateviaje.IDViaje=this.IDViaje;
      this.Updateviaje.FechaSalida = this.FechaSalida;
      this.Updateviaje.HoraSalida = this.HoraSalida;

       this.userservice.UpdateViaje(this.Updateviaje).subscribe(
         res=>{
          //Llamo metodo nuevamente para actualizar datos en front.
           this.ObtenerViaje();
         },
        error=>{

         }
       );
      this.FechaSalida=null;
      this.IDViaje=null;
      
    }

  }

  Datoviaje(index:number){
    this.IDInput = index;
    //Guardo datos actuales del viaje para pisarlos por los mismos en caso de que no actualice por uno nuevo
    this.Updateviaje.LatPrParada = this.viaje[index].LatPrParada;
    this.Updateviaje.LngPrParada = this.viaje[index].LngPrParada;
    this.Updateviaje.DirPrParada = this.viaje[index].DirPrParada;


    this.Updateviaje.LatSgParada = this.viaje[index].LatSgParada;
    this.Updateviaje.LngSgParada = this.viaje[index].LngSgParada;
    this.Updateviaje.DirSgParada = this.viaje[index].DirSgParada;

    this.Updateviaje.LatTrParada = this.viaje[index].LatTrParada;
    this.Updateviaje.LngTrParada = this.viaje[index].LngTrParada;
    this.Updateviaje.DirTrParada = this.viaje[index].DirTrParada;
    this.IDViaje = this.viaje[index].IDViaje;
    this.Updateviaje.FechaSalida = this.viaje[index].FechaSalida;
    this.Updateviaje.HoraSalida = this.viaje[index].HoraSalida;
    //console.log('Dias restantes',this.DiasRestantes(this.Updateviaje.FechaSalida,this.FechaHoy));
    //Obtengo fecha y hora
    this.FechaSalida = this.viaje[index].FechaSalida;
    this.HoraSalida = this.viaje[index].HoraSalida;
    this.DirPrParada = this.viaje[index].DirPrParada;
    this.DirSgParada = this.viaje[index].DirSgParada;
    this.DirTrParada = this.viaje[index].DirTrParada;
  
    document.getElementById('Parada'+this.IDInput).removeAttribute('disabled');
    document.getElementById('Parada2'+this.IDInput).removeAttribute('disabled');
    document.getElementById('Parada3'+this.IDInput).removeAttribute('disabled');
    document.getElementById('btn'+this.IDInput).style.display="none";
    document.getElementById('btn2'+this.IDInput).style.visibility="visible";
    document.getElementById('fechaviaje'+this.IDInput).removeAttribute('disabled');
    document.getElementById('horasalida'+this.IDInput).removeAttribute('disabled');

    
    // document.getElementById('BorrarParada'+this.IDInput).removeAttribute('hidden');
    // document.getElementById('BorrarParada2'+this.IDInput).removeAttribute('hidden');
    // document.getElementById('BorrarParada3'+this.IDInput).removeAttribute('hidden');
  


     this.intMod++;

    this.prparada = new google.maps.places.Autocomplete(document.getElementById('Parada'+index) as HTMLInputElement);
    this.sgparada = new google.maps.places.Autocomplete(document.getElementById('Parada2'+index) as HTMLInputElement);
    this.trparada = new google.maps.places.Autocomplete(document.getElementById('Parada3'+index) as HTMLInputElement);

    this.PlaceChangedPr(index);
    this.PlaceChangedSg(index);
    this.PlaceChangedTr(index);
    
  }


  ObtenerViaje(){
    this.userservice.ObtenerViajeUsuario(this.sesion.IDUsuario,this.Filtro).subscribe(
      res=>{
        this.listado=res;
        //Limpio array antes de recibir datos nuevos
         this.viaje=[];
        this.viaje=Object.values(this.listado);
      },
      error=>{
        //console.log(error);
      }
    );  
  }


  ObtenerIntegrantes(IDViaje:number,cancelacion:string,edicion:string){
    this.userservice.ObtenerIntegrantes(IDViaje).subscribe(
      res=>{
        this.listaintegrantes=res;
         this.integrantes = Object.values(this.listaintegrantes);
        //  console.log(this.integrantes)
         //Imagenes integrantes
         //this.src = this.integrantes.filter(x=>x.Imagen).map(x=>atob(x.Imagen));
         this.src = this.integrantes.filter(x=>x.IDUsuario!=this.sesion.IDUsuario).map(x=>atob(x.Imagen))
         //IdIntegrante
         //Todos los id de integrantes diferentes al usuario que creo el viaje.(logueado)
         this.idintegrante = this.integrantes.filter(x=>x.IDUsuario).map(x=>x.IDUsuario);
         //EmailIntegrantes
         this.listaemails = this.integrantes.filter(x=>x.Email!==this.sesion.Email).map(x=> x.Email);
         this.emailcancelacion = this.listaemails;

         //Si se obtiene integrantes para cancelar se envian los correos
         if (cancelacion == 'Si')
         {

          this.EIntegrantes.to = this.listaemails;
          this.EIntegrantes.mensaje = 'Uno de los viajes solicitados, fue cancelado :C';
          this.EIntegrantes.subject = 'Viaje Cancelado';

          this.email.EmailCancelacion(this.EIntegrantes).subscribe(
            res=>{
              // console.log('Listado cancelados',this.listaemails);
            },
            error=>{

            }
          )
         }

         if (edicion == 'Si')
         {
           this.EIntegrantes.to = this.listaemails;
           this.EIntegrantes.mensaje = `El usuario ${this.sesion.Usuario} realizo modificaciones en el viaje que deberias ver`;
           this.EIntegrantes.subject = 'Modifación de Viaje';

           this.email.EmailEdicion(this.EIntegrantes).subscribe(
             res=>{

             },
             error=>{

             }
           )

         }
        //  console.log('ListadoCancelados',this.emailcancelacion);
         //TokenFirebase Integrantes
         this.tokenfirebase = this.integrantes.filter(x=>x.TokenFirebase).map(x=>x.TokenFirebase);
      },
      error=>{

      }
    )
  }

  BajaViaje(index:number)
  {

    Swal.fire({
      title:'Esta por Cancelar el Viaje',
      text:'¿Estas seguro?',
      showDenyButton:true,
      showConfirmButton:true,
      denyButtonText:'No',
      confirmButtonText:'Si'
    }).then((result)=>{

      if (result.isConfirmed){

        this.userservice.BajaViaje(this.viaje[index].IDViaje).subscribe(
          res=>{
            Swal.fire({
              text:'Viaje cancelado',
              timer:1000
            })
            this.ObtenerIntegrantes(this.viaje[index].IDViaje,'Si','No')
          },
          error=>{
            Swal.fire({
              title:'Ups, Ocurrio un problema',
              text:'Porfavor intente nuevamente mas tarde',
              timer:1500
            })
          }
        )
      }
    })
  }
      



  BanderaTrue(){
    this.modForm = true;
  }


  //Captar el cambio de lugar cuando actualiza el viaje
  PlaceChangedPr(index:number){

    this.prparada.addListener('place_changed',()=>{
      const primer = this.prparada.getPlace();
      this.Updateviaje.LatPrParada = primer.geometry.location.lat().toString();
      this.Updateviaje.LngPrParada = primer.geometry.location.lng().toString();
      this.Updateviaje.DirPrParada = primer.formatted_address;
      this.DirPrParada = this.Updateviaje.DirPrParada;
      console.log(this.Updateviaje.LatPrParada,this.Updateviaje.LngPrParada);
    })
  }
  PlaceChangedSg(index:number){

    this.sgparada.addListener('place_changed',()=>{
      const segunda = this.sgparada.getPlace();
      this.Updateviaje.LatSgParada = segunda.geometry.location.lat().toString();
      this.Updateviaje.LngSgParada = segunda.geometry.location.lng().toString();
      this.Updateviaje.DirSgParada = segunda.formatted_address;
      this.DirSgParada = this.Updateviaje.DirSgParada;
    })
  }
  PlaceChangedTr(index:number){

    this.trparada.addListener('place_changed',()=>{
      const tercera = this.trparada.getPlace();
      this.Updateviaje.LatTrParada = tercera.geometry.location.lat().toString();
      this.Updateviaje.LngTrParada = tercera.geometry.location.lng().toString();
      this.Updateviaje.DirTrParada = tercera.formatted_address;
      this.DirTrParada = this.Updateviaje.DirTrParada;
    })
  }


  filtro(e:any)
  {
    this.Filtro=e.target.value;
    this.ObtenerViaje();
  }

  ObtenerFecha(e:any){
    this.FechaSalida = e.target.value;
  }
  
  ObtenerHora(e:any){
    this.HoraSalida = e.target.value;
  }



      QuitarParada(index:number,parada:string){

        // console.log('boton apretado');
        if (parada=='A'){

          this.Updateviaje.DirPrParada = null;
          this.Updateviaje.LatPrParada = null;
          this.Updateviaje.LngPrParada = null;
          (document.getElementById('Parada'+index) as HTMLInputElement).value=null
        }

        if (parada=='B')
        {
          this.Updateviaje.DirSgParada = null;
          this.Updateviaje.LatSgParada = null;
          this.Updateviaje.LngSgParada = null;
          (document.getElementById('Parada2'+index) as HTMLInputElement).value=null
        }

        if (parada=='C')
        {

          this.Updateviaje.DirTrParada = null;
          this.Updateviaje.LatTrParada = null;
          this.Updateviaje.LngTrParada = null;
          (document.getElementById('Parada3'+index) as HTMLInputElement).value=null
        }


      }

      ChatIntegrante(index:number){
        this.mensaje.IDReceptor = this.integrantes[index].IDUsuario;
        this.TokenIntegrante = this.integrantes[index].TokenFirebase;
        this.NombreIntegrante = this.sesion.Nombre;
        
      }


      EnviarMensaje(){
        this.mensaje.IDEmisor = this.sesion.IDUsuario;
        this.chat.AltaMensaje(this.mensaje).subscribe(
          res=>{
            this.EnviarMensajePush(this.TokenIntegrante,this.NombreIntegrante,this.mensaje.Mensaje);
              Swal.fire({
                text:'Mensaje Enviado',
                timer:1500
              })
              
              // console.log(this.TokenIntegrante,this.NombreIntegrante,this.mensaje.Mensaje)
          },
          error=>{
              Swal.fire({
                text:'Error al enviar mensaje, intente mas tarde',
                timer:1500
              })
          }
        )
      }


      EnviarMensajePush(TokenFirebase:string,Usuario:string,Mensaje:string){

        this.push.MensajePrivado(TokenFirebase,Usuario,Mensaje).subscribe(
          res=>{

          },
          error=>{

          }
        )}


      DiasRestantes(FechaSalida:string,fechahoy:string):number
      {

        var fecha1 = moment(fechahoy);
        var fecha2 = moment(FechaSalida);
        this.drestantesviaje = fecha2.diff(fecha1,'days');

        return this.drestantesviaje;

      }


      CerrarViajeUsuario(IDViaje:number)
      {

        Swal.fire({
          title:'Carpoolear',
          text:'El viaje pasara a estar Carpooleado, ¿Continuar?',
          showCancelButton:true,
          showConfirmButton:true,
          confirmButtonText:'Si',
          cancelButtonText:'No'
        }).then((result)=>{

          if (result.isConfirmed)
          {
            this.userservice.CerrarViajeUsuario(IDViaje).subscribe(
              res=>{
                Swal.fire({
                  title:'Carpooleado',
                  text:'Esperamos tengas mas viajes :D',
                  timer:1500,
                })
                
                this.ObtenerViaje();
              },
              error=>{
                Swal.fire({
                  title:'Ups,algo ocurrió',
                  text:'Hubo un problema, intente nuevamente mas tarde',
                  timer:1500
                })
              }
            )
          }
        })

      }




      // EnviarEmailEdicion(){

      //   this.Email.mensaje = `El Usuario ${this.sesion.Usuario} realizó modificaciones que deberias ver!`;
      //   this.Email.subject = `Modificación del viaje`;
      //   // this.Email.to = this.

      // }


  
}