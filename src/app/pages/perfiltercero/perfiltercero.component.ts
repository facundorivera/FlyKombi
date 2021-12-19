import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/Entidades/usuario';
import { Calificacion } from 'src/app/Entidades/calificacion';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-perfiltercero',
  templateUrl: './perfiltercero.component.html',
  styleUrls: ['./perfiltercero.component.scss']
})
export class PerfilterceroComponent implements OnInit {

  IDUsuario:number;
  User:Usuario = new Usuario();
  Calificaciones:Calificacion[];

  //DatosUsuario//
  Nombre:string;
  Apellido:string;
  Celular:number;
  Facebook:string;
  Instagram:string;
  Whatsapp:string;
  src = "...";
  imagencalifica:string[];
  


  constructor(private route: ActivatedRoute, private uservice: UsuarioService) { }

  ngOnInit(): void {

    // this.uservice.IDUsuario.subscribe(
    //   res=>{
    //     this.IDUsuario = res;
        
    //   }
    // );

    this.route.paramMap.subscribe(params=>{
        if (params.has("iduser")){
          console.log(params.get("iduser"))
          this.IDUsuario = Number(params.get("iduser"));
        }
    })

    this.DatosUsuario();
    this.GetCalificaciones();

  
  }



  DatosUsuario(){
    // this.uservice.getUsuario()
    this.uservice.getUsuario(this.IDUsuario).subscribe(
      usuario =>{
          this.User = usuario;
          this.src=atob(this.User.Imagen);
          console.log(this.User);
      },
      error=>{

      }
    )
  }

  GetCalificaciones(){
    this.uservice.Calificacion(this.IDUsuario).subscribe(
      res=>{
        this.Calificaciones = Object.values(res);
        this.imagencalifica = this.Calificaciones.filter(x=>x.ImagenCalifica).map(x=>atob(x.ImagenCalifica));
        console.log(this.imagencalifica)
      },
      error=>{

      }
    )
  }

}
