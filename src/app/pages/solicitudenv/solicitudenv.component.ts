import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Sesion } from 'src/app/Entidades/sesion';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import{SolInfo} from '../../Entidades/Solicitud';

@Component({
  selector: 'app-solicitudenv',
  templateUrl: './solicitudenv.component.html',
  styleUrls: ['./solicitudenv.component.scss']
})
export class SolicitudenvComponent implements OnInit {


  showhead:boolean=false;
  sesion:Sesion=new Sesion();
  solicitud:SolInfo = new SolInfo();
  listadoSol : SolInfo[];
  listado:any;

  //inicio datos a mostrar en la tabla
  DirOrigen:string;
  DirDestino:string;
  FechaSalida:string;
  NombrePost:string;
  ApellidoPost:string;
  //Fin datos a mostrar en la tabla

  ngOnInit(): void {

    //Obtengo sesion del usuario para sacar datos (IDUsuario)
    this.sesion=this.locals.get('sesion');
    //Envio uno porque son las solicitudes enviadas por el usuario.
    this.ObtenerSolicitudes(this.sesion.IDUsuario,0,1);

  }

  constructor(private ruta:Router, private locals:LocalStorageService,private usuarioservice:UsuarioService){
    ruta.events.forEach((event) =>{
      if (event instanceof NavigationStart){
        if (event['url']=='dashperfil/solicitudenviada'){
          this.showhead=false;
        } else{
          this.showhead=true;
        }
      }
    }); 
  }

  ObtenerSolicitudes(IDUsuario: number,Filtro:number,TipoSolicitud:number)
  {
    //Se envia valor cero porque son solicutdes pendientes
    this.usuarioservice.ObtSolicitud(IDUsuario,Filtro,TipoSolicitud).subscribe(
      res=>{
        this.listado = res;
        // console.log(this.listado);
        //Transformo en array lo que me devuelve la API.
        this.listadoSol = Object.values(this.listado);
      },
      error=>{
        console.log(error);
      });
  }


  MostrarSolicitud(index:number){

    

  }


}
