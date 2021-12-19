import { Component, OnInit } from '@angular/core';
import { Email } from 'src/app/Entidades/email';
import { Mensaje } from 'src/app/Entidades/mensaje';
import { ListaViaje, Viajes } from 'src/app/Entidades/viajes';
import { ChatUsuarioService } from 'src/app/services/chat-usuario.service';
import { EmailService } from 'src/app/services/email.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { FirebasepushService } from 'src/app/services/firebasepush.service';

@Component({
  selector: 'app-infoviaje',
  templateUrl: './infoviaje.component.html',
  styleUrls: ['./infoviaje.component.scss']
})
export class InfoviajeComponent implements OnInit {
   DirectionsRender: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer();
   DirectionService : google.maps.DirectionsService = new google.maps.DirectionsService();
   paradaA= {lat:0,lng:0};
   paradaB={lat:0,lng:0};
   paradaC = {lat:0,lng:0};
   origen = {lat:0, lng: 0};
   destino = {lat: 0, lng:0};
   Parada1 = new google.maps.LatLng(0,0);
   Parada2 = new google.maps.LatLng(0,0);
   Parada3 = new google.maps.LatLng(0,0);
   Waypoints : google.maps.DirectionsWaypoint[] = [];
   marker:google.maps.Marker;
   email:Email = new Email();
  IDViaje:number;
  Viaje:ListaViaje= new ListaViaje();

  //Mensaje para usuario
  mensaje:Mensaje= new Mensaje();
  Asunto:string;
  Mensaje:string;
  dismissmodal:string;
  TokenFirebase:string;

  DirPrParada:string;
  DirSgParada:string;
  DirTrParada:string;

   //@Output() closeModal = new EventEmitter<boolean>();

  constructor(private push: FirebasepushService, private Rutas: Router, private lstorage:LocalStorageService, private chat: ChatUsuarioService ,private servicio:UsuarioService,
    private emailservice:EmailService) { }

  ngOnInit(): void {
     this.initMap();  
     this.ObtenerDatoViaje();
  }

  initMap(): void {
    const map = new google.maps.Map(
      document.getElementById("mapa") as HTMLElement,
      {
        center: { lat: -32.410278, lng: -63.231389 },
        zoom: 13,
      }
    );
     this.DirectionsRender.setMap(map);
  }


  ObtenerDatoViaje(){
    this.IDViaje =+this.lstorage.get('IDViajeInfo');
    this.servicio.ObtenerDatoViaje(this.IDViaje).subscribe(
      res=>{
        this.Viaje=res;
        console.log('Viaje',res);
        this.origen.lat = Number(this.Viaje.LatOrigen);
        this.origen.lng = Number(this.Viaje.LngOrigen);
        this.destino.lat = Number(this.Viaje.LatDestino);
        this.destino.lng = Number(this.Viaje.LngDestino);
        //Waypoint
        this.paradaA.lat = Number(this.Viaje.LatPrParada);
        this.paradaA.lng = Number(this.Viaje.LngPrParada);
        this.paradaB.lat = Number(this.Viaje.LatSgParada);
        this.paradaB.lng = Number(this.Viaje.LngSgParada);
        this.paradaC.lat = Number(this.Viaje.LatTrParada);
        this.paradaC.lng = Number(this.Viaje.LngTrParada);
        this.TokenFirebase = this.Viaje.TokenFirebase;

        // console.log(this.Viaje.LatPrParada,this.Viaje.LngPrParada);
        
        this.MostrarRuta();
      },
      error=>{

      }
    )
  }

  Probando(){
    this.MostrarRuta();
  }

  EnviarMensaje(event:any){
    this.mensaje.IDViaje=this.IDViaje;
    this.mensaje.IDEmisor=this.lstorage.get('sesion').IDUsuario;
    this.mensaje.IDReceptor=Number(this.Viaje.IDUsuario);
    this.mensaje.Asunto=this.Asunto;
    this.mensaje.Mensaje=this.Mensaje;
    //Asunto y Mensaje completo a traves del input con ngModel

    this.chat.AltaMensaje(this.mensaje).subscribe(
      res=>{   
          this.EnviarCorreo();
          this.EnviarMensajePush();
          alert('Mensaje Enviado Correctamente');
          this.dismissmodal="modal";
      },
      error=>{

      }
    )
  
  }

  MostrarRuta(){
    //En un futuro habria que agregar las indicaciones pero no en este caso.
    //Los puntos medios de parada son los WAYPOINTS de google maps
    this.ValidacionWaypoint();
    console.log(this.origen);
    this.DirectionService.route({
      origin: this.origen,
      destination: this.destino,
      waypoints:this.Waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response,status) =>{
      //console.log(status,response)
      if (status=== google.maps.DirectionsStatus.OK){
        this.DirectionsRender.setDirections(response);
      }else{
        alert('No se encontro una ruta correcta');
      }
    })
    // this.DistanciaDuracion();
  }

  ValidacionWaypoint(){

    
    this.DirPrParada = this.Viaje.DirPrParada;
    if (this.paradaA.lat !== 0 && this.paradaA.lng !== 0){
      this.Parada1 = new google.maps.LatLng(this.paradaA);
      this.Waypoints.push({
        location: this.Parada1,
        stopover:true,
      })

    
      
      //Completo array con waypoint sino esta en cero
      this.DirSgParada = this.Viaje.DirSgParada;
        if (this.paradaB.lat !==0 && this.paradaB.lng !==0){
          this.Parada2 = new google.maps.LatLng(this.paradaB);
          this.Waypoints.push({
            location:this.Parada2,
            stopover:true,
          })
    
          //Completo array con waypoint sino esta en cero
         this.DirTrParada = this.Viaje.DirTrParada;
            if (this.paradaC.lat !==0 && this.paradaC.lng !==0){
              this.Parada3 = new google.maps.LatLng(this.paradaC);
              this.Waypoints.push({
              location: this.Parada3,
              stopover:true,
            })
          }
      }
    
    }
    
    }


  EnviarCorreo(){
    
    this.email.to = this.Viaje.Email;
    this.email.mensaje = this.mensaje.Mensaje;
    this.email.subject = `Nuevo mensaje de ${this.lstorage.get('sesion').Nombre}`;

    this.emailservice.EmailRegistro (this.email).subscribe(
      res=>{

      },
      error=>{

      }
    )
  }

  DatosUser(){

    this.Rutas.navigateByUrl(`/perfiluser/${this.Viaje.IDUsuario}`)

  }


  EnviarMensajePush(){
    console.log(this.TokenFirebase,this.mensaje.Mensaje);
    this.push.MensajePrivado(this.TokenFirebase,this.lstorage.get('sesion').Nombre,this.mensaje.Mensaje).subscribe(
      res=>{
        console.log('Mensaje Enviado');
      },
      error=>{
        console.log('Mensaje no enviado');
      }
    )
  }




}
