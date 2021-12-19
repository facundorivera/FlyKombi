import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Viajes } from 'src/app/Entidades/viajes';
import { ListaViaje } from './../../Entidades/viajes';
import { Sesion } from 'src/app/Entidades/sesion';
import { LeafletService } from '../../services/leaflet.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import Swal from 'sweetalert2';
import { SolicitudViaje } from 'src/app/Entidades/Solicitud';
import { Email } from 'src/app/Entidades/email';
import { EmailService } from 'src/app/services/email.service';
import { FirebasepushService } from 'src/app/services/firebasepush.service';


declare var google;
// let map: google.maps.Map;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  //Datos Origen
  Dirorigen:String;
  Latorigen:string;
  Lngorigen: string;
  //Datos Destino
  DirDestino: string;
  Latdestino: string;
  Lngdesitno: string;
  //Mapa y marcado
  FechaSalida:string;
  google:any;
  map:google.maps.Map;
  marker: google.maps.Marker;
  sesion: Sesion = new Sesion();
  listaviaje: ListaViaje = new ListaViaje();
  ListadoViaje:ListaViaje[];
  leaflet: LeafletService = new LeafletService();
  viaje: Viajes = new Viajes();
  IDUsuario: number;
  IDViaje: number;
  mensajeviaje: string;
  //Bandera
  bandera: boolean;
  listado: any;
  usuario: any;
  maxespacios:number;
  //Solicitud
  solicitud:SolicitudViaje = new SolicitudViaje();
  estadosoli:string='Solicitar';
  //ID para dashboard
  ID:number;
  //Valor para modal solicitud
  EspaciosDispo:number=0;
  TipoUserModal:string;
  IDViajeModal:number;
  AsientosNecesModal:number;
  //Variable para busqueda de viajes, mostrar todos o solo los que busca el usuario
  all:string;
  //Width boton viaje
  widhtbtn:string;
  indexViaje:number;
  email:Email = new Email();
  token:string;
  //Color icono
  color:string;


  constructor(private Push: FirebasepushService, private Places: LeafletService,private lstorage: LocalStorageService, private servicio: UsuarioService,
    private emailservice:EmailService) {
    this.servicio.Usuario.subscribe((Usuario: string)=> {
      if(Usuario==null){
        this.lstorage.clear();
        this.lstorage.remove('sesion');
      }
      else
      {
        this.sesion = this.lstorage.get('sesion');
        // console.log('Objeto sesion',this.sesion)
         
      }
    });
  }


  ngOnInit() {
   this.Prueba();
   console.log('viaje en cache',this.lstorage.GetCacheViaje());
   if (this.lstorage.GetCacheViaje()!==null)
   {
      this.listaviaje = this.lstorage.GetCacheViaje();
      this.ListadoViaje = Object.values(this.listaviaje);
      //Se completa el objeto sesion nuevamente.
      this.sesion = this.lstorage.get('sesion');
      // console.log('Listadoviaje',this.listaviaje);
   }
  }

  GetAllViajes()
  {//Seteo si para traer todos los viajes apenas carga el sitio
    this.all='Si';
    this.servicio.ObtenerViaje(this.viaje,this.sesion.IDUsuario,this.all).subscribe(
      res =>{
        this.listado=res;
        this.listaviaje=this.listado;
        
        
        //console.log(this.listaviaje);
      },
      error=>{
        alert('hubo un problema con la busqueda')
      }
    )
  }


  BuscarViaje() {
    this.sesion = this.lstorage.get('sesion');
    if (this.sesion=== null) {
      
      Swal.fire('Deberias estar logueado para buscar :D')
    }
    else {
      //Metodo para obtener direccion desde el servicio--ORIGEN
      this.viaje.DirOrigen=this.Places.DireOrigen();
      this.viaje.LatOrigen=this.Places.LatOrigen();
      this.viaje.LngOrigen= this.Places.LngOrigen();
      //Metodo para obtener direccion destino desde el servicio--DESTINO
      this.viaje.DirDestino=this.Places.DireDestino();
      this.viaje.LatDestino=this.Places.LatDestino();
      this.viaje.LngDestino=this.Places.LngDestino();

     
      this.viaje.IDUsuario = this.sesion.IDUsuario;
      //Seteo variable para traer solo viajes que el usuario busca
      this.all='No';
      this.servicio.ObtenerViaje(this.viaje,this.sesion.IDUsuario,this.all).subscribe(
        res => {
          this.listado = res;
          this.listaviaje = this.listado;
          this.ListadoViaje = Object.values(this.listaviaje);
          this.lstorage.CacheViaje(this.listaviaje);
          
        },
        error => {
        },
        () => this.Validacion()
      );
    }
  }

  Validacion() {
    if (Object.entries(this.listaviaje).length === 0) {
      this.mensajeviaje = "Ups... no se encontraron resultados";
    }
    else {
      this.mensajeviaje = "Encontramos estos viajes para vos :D"
    }
  }

  
  BuscarViajeUsuario() {
    this.servicio.AltaViaje(this.viaje).subscribe(
      res => {
      },
      error => {
      }
    );
  }

  Solicitar(idViaje: number) {
    this.solicitud.IDUsuario=this.sesion.IDUsuario;
    this.solicitud.IDViaje=idViaje;
    this.maxespacios = this.ListadoViaje.find(x=>x.IDViaje==idViaje).EspaciosLibresPasaj;
    var tipoUsuario = this.ListadoViaje.find(x=>x.IDViaje==idViaje).TipoUsuario;
    
    if (tipoUsuario == 'Conductor' && this.maxespacios < this.solicitud.AsientosNeces)
    {
      Swal.fire({
        title:'Ups,algo anda mal!',
        text:'Los espacios solicitados son mayor a lo disponible',
        timer:2500
      })
    } else{
    //Completo datos de email
    this.email.to = this.ListadoViaje.find(x=>x.IDViaje==idViaje).Email;
    //Obtengo el toke de firebase del usuario propietario del viaje
    this.token = this.ListadoViaje.find(x=>x.IDViaje==idViaje).TokenFirebase;
    
    this.servicio.SolicitarViaje(this.solicitud).subscribe(
      res => {
        if (res === -1) {
          Swal.fire({
            title:'Solicitud Enviada',
            timer:2000,
            icon:'success'
          })
          // console.log(`EstadoSoli${idViaje}`);
          
          this.EnviarEmail();
          this.EnviarMensajePush(this.token,this.sesion.Nombre);
          var value =(document.getElementById(`EstadoSoli${idViaje}`) as HTMLInputElement).value ='Pendiente';
        }
        else {

          if (res==100)
          {
            Swal.fire({
              title:'Solicitud Pendiente',
              text:'Ya enviaste una solicitud para este viaje',
              timer:1500
            })

          }else{
            Swal.fire({
              title:'Problema al Enviar',
              text:'Intente nuevamente mas tarde',
              timer:2000
            })

          }         
        }
        //Alta Solicitud
      },
      error => {
        Swal.fire({
          title:'Ups, ocurrió un problema',
          text:'Intente nuevamente mas tarde',
          timer:2000
        })
      }
    )
    }
  }

   Prueba(){
     //obtengo el valor del input 
     const autocompleteOri = new google.maps.places.Autocomplete(document.getElementById('autocompletardesde'));
     const autocompleteDes = new google.maps.places.Autocomplete(document.getElementById('autocompletarhasta'));
     //inicio Paradas
    //  const autocompletePr = new google.maps.places.Autocomplete(document.getElementById('autocompletarpr'));
    //  const autocompleteSg = new google.maps.places.Autocomplete(document.getElementById('autocompletarsg'));
    //  const autocompleteTr = new google.maps.places.Autocomplete(document.getElementById('autocompletartr'));
     //Fin paradas
     //Metodos del servicio para obtener datos de origen y destino
     this.Places.LatLngDestino(autocompleteDes,this.map,this.marker);
      this.Places.LatLngOrigen(autocompleteOri,this.map, this.marker);
     //Inicio paradas autocompletar
    //  this.Places.LatLngPrparada(autocompletePr,this.map,this.marker);
    //  this.Places.LatLngSgparada(autocompleteSg,this.map,this.marker);
    //  this.Places.LatLngTrparada(autocompleteTr,this.map,this.marker);
     //Fin inicio paradas autocompletar

    
   }


  /*Metodo para psar id de viaje a la pagina datoviaje*/
  GuardarID(index:number){
    this.EspaciosDispo = this.listaviaje[index].EspaciosLibresPasaj;
    this.TipoUserModal= this.listaviaje[index].TipoUsuario;
    this.IDViajeModal = this.listaviaje[index].IDViaje;
    //Guardo para abrir en la info de viaje en otra pestaña
    this.lstorage.set('IDViajeInfo',this.listaviaje[index].IDViaje);
    
  }


  EnviarEmail(){

  this.email.mensaje = `El usuario ${this.lstorage.get('sesion').Nombre} ah solicitado tu viaje`;
  this.email.subject = 'Nueva Solicitud para tu viaje';

  this.emailservice.EmailRegistro(this.email).subscribe(
    res=>{

    },
    error=>{

    }
  )
  
  }

  EnviarMensajePush(tokenfirebase:string,Usuario:string){
     this.Push.MensajeSolicitudPush(tokenfirebase,Usuario).subscribe(
       res=>{
        console.log('Mensaje enviado con exito')
       },
       error=>{
        console.log('Error en la notificacion push')
       }
     )
  }

  TipoUsuario(TipoUsuario:string){

    this.viaje.TipoUsuario = TipoUsuario;
  }


}