import { Component, OnInit } from '@angular/core';
import { Calificacion } from 'src/app/Entidades/calificacion';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.scss']
})
export class CalificacionComponent implements OnInit {

  Listado:Calificacion[];
  listado:any;
  ImagenCalifica:string[];

  constructor(private servicio:UsuarioService,private locals:LocalStorageService) { }

  ngOnInit(): void {
    this.GetCalificaciones();
  }


  GetCalificaciones(){
    this.servicio.Calificacion(this.locals.get('sesion').IDUsuario).subscribe(
      res=>{
        this.listado = Object.values(res);
        this.Listado=this.listado;
        this.ImagenCalifica = this.Listado.filter(x=> x.ImagenCalifica).map(x=>atob(x.ImagenCalifica));
        console.log('Calificaciones',this.Listado);
        console.log(this.ImagenCalifica);
        //console.log(this.Listado);

      }
    )
  }

}
