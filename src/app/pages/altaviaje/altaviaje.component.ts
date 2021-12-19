import { DatePipe} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Viajes } from 'src/app/Entidades/viajes';
import { ListaViaje } from './../../Entidades/viajes';
import { Sesion } from 'src/app/Entidades/sesion';
import { LeafletService } from '../../services/leaflet.service';
import Swal from 'sweetalert2';
import {SolicitudViaje} from '../../Entidades/Solicitud';
import { EmailService } from 'src/app/services/email.service';
import { Email } from 'src/app/Entidades/email';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-altaviaje',
  templateUrl: './altaviaje.component.html',
  styleUrls: ['./altaviaje.component.scss'],
  providers : [DatePipe]
})
export class AltaviajeComponent implements OnInit {

  sesion: Sesion = new Sesion();
  listaviaje: ListaViaje = new ListaViaje();
  // leaflet: LeafletService = new LeafletService();
  viaje: Viajes = new Viajes();
  IDUsuario: number;
  IDViaje: number;
  mensajeviaje: string;
  // distanciatotal:number=0;
  // distanciaparadas:string;
  //Servicio que retorna la ruta optima
  //Variables Viaje Origen
  DirecOrigen:string;
  LatOrigen: number;
  LngOrigen: number;
  //Variables para ruta en el mapa
  //Ruta Optima
  DirectionServices : google.maps.DirectionsService = new google.maps.DirectionsService();
  //Dibuja Ruta Optima
  DirectionsRenders: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer();
  //Variables Viaje Destino
  DirecDestino: string;
  LatDestino: number;
  LngDestino: number;
  //autocomplete
  autocompleteOri: google.maps.places.Autocomplete
  autocompleteDes: google.maps.places.Autocomplete
  destino2 : google.maps.places.Autocomplete;
  primerparada: google.maps.places.Autocomplete;
  segundaparada: google.maps.places.Autocomplete;
  tercerparada: google.maps.places.Autocomplete;
  //Bandera
  listado: any;
  origen = {lat:0, lng: 0};
  destino = {lat: 0, lng:0};
  paradaA= {lat:0,lng:0};
  paradaB={lat:0,lng:0};
  paradaC = {lat:0,lng:0};
  todolisto:boolean=false;

  Waypoints : google.maps.DirectionsWaypoint[] = [];
  email:Email = new Email();
  usuario: any;
  //Alta Soliciutud
  altaSol:SolicitudViaje= new SolicitudViaje();
  marker:google.maps.Marker;
  //Datos mutantes interfaz
  tipoUsuario:string;
  LitrosNafta:number;
  PrecioLitro:number;
  TotalEstimado:number;
  //Preferencias
  Mascota:string;
  Bebe:string;
  Fuma:string;
  //Bandera para checkbox
  PerMascota:boolean;
  PerFumar:boolean;
  PerBebe:boolean;

  Parada1 = new google.maps.LatLng(0,0);
  Parada2 = new google.maps.LatLng(0,0);
  Parada3 = new google.maps.LatLng(0,0);
  //Validaciones para puntos intermedios
  destinoviaje:String;
  primerparadatxt:string;
  muestraparada:boolean;
  muestrasegunda:boolean;
  muestratercera:boolean;

  // waypointspr:string[];

  FechaHoy:string;
  CantUsuarios:string;


  constructor(private datePipe:DatePipe,private Mapa: LeafletService, private servicio: UsuarioService,
    private emailservice:EmailService, private lstorage:LocalStorageService) {
    this.viaje.PerFumar='Si';
    this.viaje.PerMascota='Si';
    this.viaje.PerBebe = 'Si';

    const fechahoy = Date.now();
    const Fechaformato = this.datePipe.transform(fechahoy,'yyyy-MM-dd');
    this.FechaHoy = Fechaformato;

  }

  ngOnInit(): void {

     this.initMap();
     this.CalculoEstimado();
     //Muestra las paradas cuando se llena una.
     this.Mapa.Muestrapunto.subscribe(
       res=>{
         this.muestraparada=res;
       }
     )

     this.Mapa.MuestraPuntoB.subscribe(
       res=>{
         this.muestrasegunda=res;
       }
     )

     this.Mapa.MuestraPuntoC.subscribe(
       res=>{
         this.muestratercera=res;
       }
     )
  }

  TipoUsuario(e:any){
    this.tipoUsuario= e.target.value;
    this.viaje.TipoUsuario=this.tipoUsuario;
  }

  CantidadPersonas(e:any){
    (this.viaje.TipoUsuario=='Conductor') ? this.viaje.EspaciosDispo=e.target.value : 
    this.viaje.EspaciosNeces=e.target.value

    this.CantUsuarios = e.target.value;
    //console.log(this.viaje.TipoUsuario,this.viaje.EspaciosNeces,this.viaje.EspaciosDispo)
  }

  //Valor Preferencia
   PreMascota(e:any){
    (this.PerMascota) ? this.viaje.PerMascota='No' : this.viaje.PerMascota='Si' 
   }

   PreBebe(e:any){
    (this.PerBebe) ? this.viaje.PerBebe ='No' : this.viaje.PerBebe = 'Si'
   }

  PreFuma(e:any){
    (this.PerFumar) ? this.viaje.PerFumar ='No' : this.viaje.PerFumar = 'Si'
   }

  Validacion() {
    (Object.entries(this.listaviaje).length===0) ? this.mensajeviaje="No hay viajes por el momento" :
    this.mensajeviaje="Encontramos estos viajes para vos :D"
  }

  PublicarViaje() {

    var prparada = (document.getElementById('PrimerParada') as HTMLInputElement).value;
    var sgparada = (document.getElementById('SegundaParada') as HTMLInputElement).value;
    var trparada = (document.getElementById('TercerParada') as HTMLInputElement).value;

    if (prparada == '' || prparada == null)
    {
      this.viaje.DirPrParada = null;
      this.viaje.LatPrParada = null;
      this.viaje.LngPrParada = null;
    }

    if (sgparada == '' || sgparada == null)
    {
      this.viaje.DirSgParada = null;
      this.viaje.LatSgParada = null;
      this.viaje.LngSgParada= null;
    }

    if (trparada == '' ||  trparada==null)
    {
      this.viaje.DirTrParada = null;
      this.viaje.LatTrParada = null;
      this.viaje.LngTrParada = null;
    }

    this.sesion= JSON.parse(localStorage.getItem('sesion'));
    this.viaje.IDUsuario = this.sesion.IDUsuario;
    //Datos Origen
    this.viaje.LatOrigen = this.Mapa.LatOrigen();
    this.viaje.LngOrigen = this.Mapa.LngOrigen();
    this.viaje.DirOrigen= this.Mapa.DireOrigen();
    //Datos Destino
    this.viaje.LatDestino=this.Mapa.LatDestino();
    this.viaje.LngDestino = this.Mapa.LngDestino();
    this.viaje.DirDestino= this.Mapa.DireDestino();

    console.log(this.viaje.LatDestino,this.viaje.LngDestino,this.CantUsuarios,this.viaje.TipoUsuario,this.viaje.FechaSalida,this.todolisto)

    if (!this.viaje.LatDestino || 
      !this.viaje.LatOrigen || 
      this.CantUsuarios== null ||
      this.viaje.TipoUsuario == null ||
      this.viaje.FechaSalida == null ||
      this.todolisto==false)
    {
      Swal.fire({
        text:'Ups,pareciera aun no esta todo'
      })
     
    } else{

    //Obtengo el ID De la Sesion
    //If usuario del locastorage esta vacio es porque no esta logueado por ende no puede publicar
    this.servicio.AltaViaje(this.viaje).subscribe(
      res => {

        if (res===3)
        {
          Swal.fire({
            icon:'question',
            title:'Viaje Existente',
            text:'detectamos que tienes un viaje con las mismas caracterticas',
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonText:'Si,publicar'
          }).then((result)=>{
            if (result.isConfirmed){
              this.viaje.Existe=true;
              this.servicio.AltaViaje(this.viaje).subscribe()
              Swal.fire({
                title: 'Muy Bien.',
                text:'Esperamos encuentres tu compañero de viaje',
                timer:2000,
                width: 400,
                padding: '3em',
                //background: '#fff url(/images/trees.png)',
                backdrop: `
                  rgba(0,0,123,0.4)
                  url('../../../assets/img/FlyKombigif.gif')
                  left top
                  no-repeat
                `
              })
              this.viaje.Existe=false;
            }
          })
        }else{
          Swal.fire({
            text:'viaje generado!',
            timer:2000,
            width: 400,
            padding: '3em',
            //background: '#fff url(/images/trees.png)',
            backdrop: `
              rgba(0,0,123,0.4)
              url('../../../assets/img/FlyKombigif.gif')
              left top
              no-repeat
            `
          })
        this.EnviarEmail();   
      }
      },
      error => {
        //console.log(error);
        Swal.fire('Oops...Intente nuevamente.')
      });
    }
  }


  BuscarViajeUsuario() {
    this.servicio.AltaViaje(this.viaje).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    );
  }


//Es necesario instanciar el mapa y el autocompletado en un mismo metodo para que funcione
initMap(): void {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: -32.410278, lng: -63.231389 },
        zoom: 13,
      }
    );
   this.marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });
    this.DirectionsRenders.setMap(map);
     this.autocompleteOri = new google.maps.places.Autocomplete(document.getElementById('PlacesOrigen') as HTMLInputElement);
     this.autocompleteDes = new google.maps.places.Autocomplete(document.getElementById('PlacesDestino') as HTMLInputElement);
     //waypoints
     this.primerparada = new google.maps.places.Autocomplete(document.getElementById('PrimerParada') as HTMLInputElement);
     this.segundaparada = new google.maps.places.Autocomplete(document.getElementById('SegundaParada') as HTMLInputElement);
     this.tercerparada = new google.maps.places.Autocomplete(document.getElementById('TercerParada') as HTMLInputElement);
    //Redireccionamiento y pintado del marcador.
     this.Mapa.LatLngOrigen(this.autocompleteOri,map,this.marker);
     this.Mapa.LatLngDestino(this.autocompleteDes,map,this.marker);
     //Paradas [Waypoints]
     this.Mapa.LatLngPrparada(this.primerparada,map,this.marker);
     this.Mapa.LatLngSgparada(this.segundaparada,map,this.marker);
     this.Mapa.LatLngTrparada(this.tercerparada,map,this.marker);

  }



  MostrarRuta(e:any){

    if (e=='A')
    {
    
    this.todolisto =true;
    // console.log('bandera',this.todolisto);
    this.marker.setMap(null);
    this.origen.lng= Number(this.Mapa.LngOrigen());
    this.origen.lat= Number(this.Mapa.LatOrigen());
    //Datos de destino
    this.destino.lat= Number(this.Mapa.LatDestino());
    this.destino.lng= Number(this.Mapa.LngDestino());

    this.ValidacionWaypoint();
    //En un futuro habria que agregar las indicaciones pero no en este caso.
    //Los puntos medios de parada son los WAYPOINTS de google maps
    this.DirectionServices.route({
      origin: this.origen,
      destination: this.destino,
      waypoints : this.Waypoints,
      optimizeWaypoints:true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response,status) =>{
      if (status=== google.maps.DirectionsStatus.OK){
        this.DirectionsRenders.setDirections(response);
      }else{
        Swal.fire({
          text:'Imposible encontrar una ruta',
          timer:2000
        })
      }
    })
    this.DistanciaDuracion();

  } else{
    this.todolisto=false;
  }

  
  }



DistanciaDuracion(){
  var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins : [this.origen],
      destinations: [this.destino],
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response,status)=>{
      var origin = response.originAddresses;
      var destinaton = response.destinationAddresses;

      // for (let i=0; i< parametro.legs.lenght; i++)
      // this.viaje.DistText = parametro.legs[i].distance!.text;
      // console.log(this.viaje.DistText);
      var distance = response.rows[0].elements[0].distance;
      var duration = response.rows[0].elements[0].duration;
      // console.log(response.rows[0].elements[0].duration)
      // console.log(response.rows[0].elements[0].distance)
      this.viaje.DuraText=duration.text;
      this.viaje.DuraValor=duration.value;
      this.viaje.DistValor=distance.value;
      this.viaje.DistText=distance.text;
    })
}

CalculoEstimado(){
  this.LitrosNafta = this.viaje.CantNafta;
  this.PrecioLitro = this.viaje.ValorNafta;
  this.TotalEstimado= this.LitrosNafta * this.PrecioLitro;
 
  (this.LitrosNafta!==0 && this.PrecioLitro!==0) ? this.TotalEstimado = this.LitrosNafta * this.PrecioLitro : this.TotalEstimado=0 
}


ValidacionWaypoint(){


this.paradaA.lat = Number(this.Mapa.LatPrimer());
this.paradaA.lng = Number(this.Mapa.LngPrimer());
console.log('paradaA',this.paradaA)
if (this.paradaA.lat !== 0 && this.paradaA.lng !== 0){
  this.Parada1 = new google.maps.LatLng(this.paradaA);
  this.Waypoints.push({
    location: this.Parada1,
    stopover:true,
  })

  //Lleno los datos para cargar el viaje
  this.viaje.DirPrParada = this.Mapa.DirePrimer();
  this.viaje.LatPrParada = this.Mapa.LatPrimer();
  this.viaje.LngPrParada = this.Mapa.LngPrimer();
}

  //Completo array con waypoint sino esta en cero
  this.paradaB.lat = Number(this.Mapa.LatSegunda());
  this.paradaB.lng = Number(this.Mapa.LngSegunda());
  console.log('ParadaB',this.paradaB)
    if (this.paradaB.lat !==0 && this.paradaB.lng !==0){
      this.Parada2 = new google.maps.LatLng(this.paradaB);
      this.Waypoints.push({
        location:this.Parada2,
        stopover:true,
      })

      this.viaje.DirSgParada = this.Mapa.DireSegunda();
      this.viaje.LatSgParada = this.Mapa.LatSegunda();
      this.viaje.LngSgParada = this.Mapa.LngSegunda();
    }

      //Completo array con waypoint sino esta en cero
    // console.log('Latitud', Number(this.Mapa.LatTercera()))
     
      this.paradaC.lat = Number(this.Mapa.LatTercera());
      this.paradaC.lng = Number(this.Mapa.LngTercera());
      console.log('ParadaC',this.paradaC)
        if (this.paradaC.lat !==0 && this.paradaC.lng !==0){
          this.Parada3 = new google.maps.LatLng(this.paradaC);
          this.Waypoints.push({
          location: this.Parada3,
          stopover:true,
        })

        this.viaje.DirTrParada = this.Mapa.DireTercera();
        this.viaje.LatTrParada = this.Mapa.LatTercera();
        this.viaje.LngTrParada = this.Mapa.LngTercera();
      }
  
// console.log('Paradaa',this.paradaA,'Paradab',this.paradaB,'Paradac',this.paradaC);

}

EnviarEmail(){

this.email.mensaje = `Registraste un nuevo viaje como 
${this.viaje.TipoUsuario} desde ${this.viaje.DirOrigen} hasta ${this.viaje.DirDestino} con fecha de salida ${this.viaje.FechaSalida}`;
this.email.subject = "Nuevo viaje";
this.email.to = this.lstorage.get('sesion').Usuario;

this.emailservice.EmailRegistro(this.email).subscribe(
  res=>{

  },
  error=>{

  }
)



}

QuitarParada(parada:string)
{


    if (parada=='A')
      {

        this.viaje.DirPrParada = null;
        this.viaje.LatPrParada = null;
        this.viaje.LngPrParada = null;
        this.Mapa.LatPr ='';
        this.Mapa.LngPr = '';
        this.paradaA.lat =0;
        this.paradaA.lng = 0;
        this.Waypoints.splice(0,1);
        (document.getElementById('PrimerParada') as HTMLInputElement).value=null;

      }

      if (parada=='B')
      {
        this.viaje.DirSgParada = null;
        this.viaje.LatSgParada = null;
        this.viaje.LngSgParada = null;
        this.Mapa.LatSg = '';
        this.Mapa.LngSg = '';
        this.paradaB.lat =0;
        this.paradaB.lng =0;
        this.Waypoints.splice(1,1);
        (document.getElementById('SegundaParada') as HTMLInputElement).value = null;
      }

      if (parada=='C')
      {
        this.viaje.DirTrParada = null;
        this.viaje.LatTrParada = null;
        this.viaje.LngTrParada = null;
        this.Mapa.LatTr ='';
        this.Mapa.LngTr ='';
        this.paradaC.lat =0;
        this.paradaC.lng =0;
        this.Waypoints.splice(2,1);
        (document.getElementById('TercerParada') as HTMLInputElement).value = null;
      }



}


}
