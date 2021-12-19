import { Component, OnInit } from '@angular/core';
import { ChatUsuarioService } from 'src/app/services/chat-usuario.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Mensaje } from 'src/app/Entidades/mensaje';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Calificacion } from 'src/app/Entidades/calificacion';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { Email } from 'src/app/Entidades/email';
import { FirebasepushService } from 'src/app/services/firebasepush.service';
import { Integrantes } from 'src/app/Entidades/viajes';
import * as jQuery from 'jquery';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-infoviajesol',
  templateUrl: './infoviajesol.component.html',
  styleUrls: ['./infoviajesol.component.scss']
})
export class InfoviajesolComponent implements OnInit {

  DirectionsRender: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer();
  DirectionService : google.maps.DirectionsService = new google.maps.DirectionsService();
  origen = {lat:0, lng: 0};
  destino = {lat: 0, lng:0};
  paradaA= {lat:0,lng:0};
  paradaB={lat:0,lng:0};
  paradaC = {lat:0,lng:0};
  marker:google.maps.Marker;

  Parada1 = new google.maps.LatLng(0,0);
  Parada2 = new google.maps.LatLng(0,0);
  Parada3 = new google.maps.LatLng(0,0);
  Waypoints : google.maps.DirectionsWaypoint[] = [];

  /*Datos info viaje*/
  IDUserviaje:number;
  IDViaje: number;
  Destino: string;
  Origen: string;
  //Puntos intermedios
  PrParada:string=null;
  SgParada:string=null;
  TrParada:string=null;
  //Fin puntos intermedios
  FechaSolicitud:string;
  LatOrigen:number;
  LngOrigen:number;
  LatDestino:number;
  LngDestino:number;
  //Latitud, longitud puntos intermedios
  LatPrParada:number;
  LngPrParada:number;
  LatSgParada:number;
  LngSgParada:number;
  LatTrParada:number;
  LngTrParada:number;
  //Latitud, longitud puntos intermedios
  PerMascota:string;
  PerBebe:String;
  PerFumar:String;
  Nombre:string;
  Apellido:string;
  MensajeGral: String;
  FechaSalida:string;
  DuraText:string;
  DistText:string;
  CantBuena:number;
  CantMala:number;
  TokenFirebase:string;
  CantIntegrantes:string;
  EstadoViaje:string;
  EmailPostulante:string;
  /*Fin datos InfoViaje*/
  /*Datos Mensaje*/
  chat:Mensaje = new Mensaje();
  mensaje:string;
  Emisor:string;
  Receptor:string;
  Asunto:string;
  integrantes:Integrantes[];
  src:string[];
  idintegrante:number[];
  listafotos:any[];
  modal:boolean=false;

  /*Fin Datos Mensaje*/

  /*Mensaje Reseña*/
  MensajeReseniabuena:string;
  MensajeReseniamala:string;
  Reseniabuena:string="";
  Reseniamala:string="";
  MensajeReseniaGral:string='Usuario calificado';
  TipoResenia:string;
  calificacion:Calificacion = new Calificacion();
  Comentario:String;
  /*Fin mensaje Reseña*/
  CalificaExiste:number;
  //OcultaCalificacion:boolean;
  email:Email = new Email();

  constructor(private router: Router,
    private lstorage: LocalStorageService,
    private Chatservice:ChatUsuarioService,
    private uservice:UsuarioService,
    private emailservice:EmailService,
    private push:FirebasepushService) { }

  ngOnInit(): void {
    this.MensajeReseniabuena = `Nos alegra tu experiencia haya sido favorable, esperamos tengas mas viajes placenteros.
    Recuerda dar un comentario positivo al usuario, te lo agradecerá :D`;
    this.MensajeReseniamala =  `Lamentamos tu experiencia no haya sido buena, esperamos tengas mejores viajes.
    Recuerda mantener el respeto y buena expresión para puntuar al usuario`;
    this.Reseniabuena = `Reseña favorable`;
    this.Reseniamala = `Reseña desfavorable`;
    // type ArrayIntegrantes = Array<{src:string,idintegrante:number}>;
  

    //this.ValidaCalificacion();

    this.CompletarDatos();
    this.initMap()
    this.ValidaCalificacion();
  }

  initMap(): void {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: -32.410278, lng: -63.231389 },
        zoom: 13,
      }
    );
     this.DirectionsRender.setMap(map);
  }


  CompletarDatos(){

    this.IDViaje=this.lstorage.getinfoviaje('infoviaje').IDViaje;
    this.Origen = this.lstorage.getinfoviaje('infoviaje').DirOrigen;
    this.Destino = this.lstorage.getinfoviaje('infoviaje').DirDestino;
    this.EmailPostulante = this.lstorage.getinfoviaje('infoviaje').EmailPostulante;
    this.Nombre = this.lstorage.getinfoviaje('infoviaje').Nombre;
    this.Apellido = this.lstorage.getinfoviaje('infoviaje').Apellido;
    this.MensajeGral = this.lstorage.getinfoviaje('infoviaje').MensajeGral;
    this.FechaSalida = this.lstorage.getinfoviaje('infoviaje').FechaSalida;
    this.PerMascota = this.lstorage.getinfoviaje('infoviaje').PerMascota;
    this.PerBebe = this.lstorage.getinfoviaje('infoviaje').PerBebe;
    this.PerFumar = this.lstorage.getinfoviaje('infoviaje').PerFumar;
    this.DistText = this.lstorage.getinfoviaje('infoviaje').DistText;
    this.DuraText = this.lstorage.getinfoviaje('infoviaje').DuraText;
    this.CantBuena = this.lstorage.getinfoviaje('infoviaje').CantBuena;
    this.CantMala = this.lstorage.getinfoviaje('infoviaje').CantMala;
    this.IDUserviaje = Number(this.lstorage.getinfoviaje('infoviaje').IDUsuario);
    //Datos para pintar viaje en el mapa.
    this.origen.lat = Number(this.lstorage.getinfoviaje('infoviaje').LatOrigen);
    this.origen.lng = Number(this.lstorage.getinfoviaje('infoviaje').LngOrigen);
    this.destino.lat = Number(this.lstorage.getinfoviaje('infoviaje').LatDestino);
    this.destino.lng=Number(this.lstorage.getinfoviaje('infoviaje').LngDestino);

    this.TokenFirebase = this.lstorage.getinfoviaje('infoviaje').TokenFirebase;
    this.CantIntegrantes = this.lstorage.getinfoviaje('infoviaje').Integrantes;
    this.EstadoViaje = this.lstorage.getinfoviaje('infoviaje').EstadoViaje;
    this.ObtenerIntegrantes(this.IDViaje);


    //Inicio latitud, longitud parada
    //Fin latitud, longitud paradas
    console.log(this.EmailPostulante);
    this.MostrarRuta();

  }


  EnviarMensaje(){
    this.chat.Asunto =this.Asunto;
    this.chat.Mensaje = this.mensaje;
    //Usuario Emisor
    this.chat.IDEmisor=this.lstorage.get('sesion').IDUsuario;
    //Usuario Recepto (saco dato del localstorage)
    this.chat.IDReceptor = Number(this.lstorage.getinfoviaje('infoviaje').IDUsuario);

     this.Chatservice.AltaMensaje(this.chat).subscribe(
      res => {
        this.EnviarMensajePush();
      },
      error =>{
        Swal.fire({
          title:'Ups, Ocurrio un problema',
          text:'No se pudo enviar mensaje, intente mas tarde',
          timer:1500
        })
      }
     )

     
  }

  Resenias(Reseña:string){
    // console.log(Tipo);
    console.log(this.CalificaExiste);
    // this.calificacion.Comentario=Number("");
    if (this.CalificaExiste==0)
    {
      this.TipoResenia = "";
      this.TipoResenia = Reseña;
    }
    // if (this.CalificaExiste > 0)
    // {
    //   this.MensajeReseniaGral = `Usuario Calificado`;
    // }
    
  }


   AltaResenia()
   {

     if (this.TipoResenia=='Reseña favorable')
     {
       
       this.calificacion.Puntaje= 1;
     } else if (this.TipoResenia=='Reseña desfavorable')
     {
       this.calificacion.Puntaje = 2;
     }

     this.calificacion.IDCalifica = this.lstorage.get('sesion').IDUsuario;
     this.calificacion.IDCalificado = Number(this.lstorage.getinfoviaje('infoviaje').IDUsuario);
     this.calificacion.IDViaje = this.lstorage.getinfoviaje('infoviaje').IDViaje;
     this.uservice.AltaCalificacion(this.calificacion).subscribe(
       res=>{
        Swal.fire({
          title:'Muy bien!',
          text:'Puntuacion Exitosa!',
          timer:1500
        })
        this.CalificaExiste = 1;
        this.EmailCalificacion();
       },
      error =>{
        Swal.fire({
          title:'Ups, algo ocurrió',
          text:'Intenta nuevamente mas tarde',
          timer:1500
        })
       }
     )
   }

   ValidaCalificacion(){
     this.uservice.ValidaCalificacion(this.lstorage.get('sesion').IDUsuario,Number(this.lstorage.getinfoviaje('infoviaje').IDUsuario)).subscribe(
       res =>{
        this.CalificaExiste=res;
       },
       error=>{

       }
     )
   }

   ObtenerID(index:number){
     this.uservice.IDUsuario.next(index);
    //  console.log(index);
     this.router.navigateByUrl(`/perfiluser/${index}`);
     
   }


   MostrarRuta(){
    //En un futuro habria que agregar las indicaciones pero no en este caso.
    //Los puntos medios de parada son los WAYPOINTS de google maps
    // console.log(this.origen);
    this.ValidacionWaypoint();
    this.DirectionService.route({
      origin: this.origen,
      destination: this.destino,
      waypoints : this.Waypoints,
      optimizeWaypoints:true,
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

    //Paradas
    this.paradaA.lat = Number(this.lstorage.getinfoviaje('infoviaje').LatPrParada);
    this.paradaA.lng = Number(this.lstorage.getinfoviaje('infoviaje').LngPrParada);
    this.PrParada = this.lstorage.getinfoviaje('infoviaje').DirPrParada;
    console.log('datos parada',this.PrParada);
    if (this.paradaA.lat !== 0 && this.paradaA.lng !== 0){
      this.Parada1 = new google.maps.LatLng(this.paradaA);
      this.Waypoints.push({
        location: this.Parada1,
        stopover:true,
      })
      
      //Completo array con waypoint sino esta en cero
      this.paradaB.lat = Number(this.lstorage.getinfoviaje('infoviaje').LatSgParada);
      this.paradaB.lng = Number(this.lstorage.getinfoviaje('infoviaje').LngSgParada);
      this.SgParada = this.lstorage.getinfoviaje('infoviaje').DirSgParada;
        if (this.paradaB.lat !==0 && this.paradaB.lng !==0){
          this.Parada2 = new google.maps.LatLng(this.paradaB);
          this.Waypoints.push({
            location:this.Parada2,
            stopover:true,
          })
    
          //Completo array con waypoint sino esta en cero
          this.paradaC.lat = Number(this.lstorage.getinfoviaje('infoviaje').LatTrParada);
          this.paradaC.lng = Number(this.lstorage.getinfoviaje('infoviaje').LngTrParada);
          this.TrParada = this.lstorage.getinfoviaje('infoviaje').DirTrParada;
          console.log(this.TrParada);
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

      // this.email.mensaje = this.MensajeResenia;
      // this.email.subject = `El usuario ${this.lstorage.get('sesion').Nombre} te calificó, ingresá
      // a ver que tiene para decir`;
      
    }

    EnviarMensajePush(){
      //console.log(this.TokenFirebase,this.chat.Mensaje);
      this.push.MensajePrivado(this.TokenFirebase,this.lstorage.get('sesion').Nombre,this.chat.Mensaje).subscribe(
        res=>{
          console.log('Mensaje Enviado');
        },
        error=>{
          console.log('Mensaje no enviado');
        }
      )


    }

    ObtenerIntegrantes(IDViaje:number){
      this.uservice.ObtenerIntegrantes(IDViaje).subscribe(
        res=>{
          this.integrantes=res;
           this.integrantes = Object.values(this.integrantes);
           this.src = this.integrantes.filter(x=>x.Imagen).map(x=>atob(x.Imagen));
           this.idintegrante = this.integrantes.filter(x=>x.IDUsuario).map(x=>x.IDUsuario);
           console.log(this.idintegrante);
           //this.listaemails = this.integrantes.filter(x=>x.Email!==this.sesion.Email).map(x=> x.Email);
        },
        error=>{
  
        }
      )
    }

    EmailCalificacion(){
      this.email.mensaje = `El Usuario ${this.lstorage.get('sesion').Usuario} te calificó`;
      this.email.subject = 'Nueva Calificación';
      this.email.to = this.EmailPostulante;
      console.log(this.email);
      this.emailservice.EmailRegistro(this.email).subscribe(
        res=>{
            console.log('Mensaje Enviado');
        },
        error=>{

        }
      )
    }

}
