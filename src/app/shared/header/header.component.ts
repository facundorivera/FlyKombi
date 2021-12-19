// import { Component, OnInit } from '@angular/core';
import {Component,OnInit,Input,ViewChild} from '@angular/core';
import { Sesion } from 'src/app/Entidades/sesion';
import {LocalStorageService} from '../../services/local-storage.service';
import {Usuario} from '../../Entidades/usuario';
import {UsuarioService} from '../../services/usuario.service'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  sesion:Sesion= new Sesion();
  usuario : Usuario = new Usuario();
  message: string;
  editMessage: string;
  Prueba: string;
  Loged: boolean;
  

  contador:number;
  
  constructor(private router:Router, private servicio: UsuarioService,private cookies: LocalStorageService) {
    
   }
   

  ngOnInit() {
//Para mantener sesion abierta al actualizar.
this.cookies.Usuario.subscribe(
  res=>{
    this.Prueba=res;
    console.log(this.Prueba);
  }
)
this.sesion = this.cookies.get('sesion');
if (this.sesion !=null)
{
   this.Prueba=this.cookies.get('sesion').Nombre;
  
}
  }

  CerrarSesion(){
    Swal.fire({
      title: '¿Te vas?',
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        // this.ngOnInit();
         this.router.navigateByUrl('home');
        
        this.cookies.Usuario.next(null);
        localStorage.removeItem('sesion');
        localStorage.removeItem('infoviaje');
        localStorage.removeItem('IDViajeInfo');

      } else if (result.isDenied) {
        //Swal.fire('Aca no paso nada', '', 'info')
      }
    })
    
  }
}
