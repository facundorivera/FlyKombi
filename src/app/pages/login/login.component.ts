import {Component,OnInit, Output,NgZone} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import { Usuario } from 'src/app/Entidades/usuario';
import {Router} from '@angular/router'
import { Sesion } from 'src/app/Entidades/sesion';
import Swal from 'sweetalert2';
import { LoginEntity} from 'src/app/Entidades/login';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FirebasepushService } from 'src/app/services/firebasepush.service';
import { Validators,FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  guser;
  usuario:Usuario=new Usuario();
  sesion:Sesion=new Sesion();
  login: LoginEntity = new LoginEntity();
  message: string;
  editMessage: string;

  ID:number;
  

  constructor( private fb:FormBuilder, private push:FirebasepushService, private servicio:UsuarioService,private router:Router, private locals:LocalStorageService,
    ngZone: NgZone) { }

   FormLogin = this.fb.group({
    Usuario : ['',Validators.required],
    Contrasenia: ['',Validators.required],
  });
   //metodo para refrescar el header con nombre de usuario.

  ngOnInit() {

  }

  afterSignUp(googleUser){

    this.guser = googleUser;
    alert(this.guser);
  }

  LoginUsuario(){
      this.servicio.LoginUsuario(this.login).subscribe(
      res=>{
        //console.log(res);
        this.sesion = res;
        localStorage.setItem('sesion',JSON.stringify(this.sesion));
        this.servicio.ObtenerId(this.sesion.IDUsuario);
      },
      error =>{
        console.log(error);
      },
      ()=>this.Validacion()
    );
  }

  //Validacion datos login correcto
  Validacion(){
    if (this.sesion.Correcto==true)
    {
      Swal.fire('Bienvenido' + ' ' + this.sesion.Nombre);
     this.locals.Usuario.next(this.sesion.Nombre);
     this.router.navigateByUrl('home');
     this.push.SolicitarPermisos();
    }
     else
     Swal.fire({
      icon: 'error',
      title: 'Ups...',
      text: 'Al parecer todavia no estas registrado!'
    })
  }

  //Metodo de redireccionamiento al Home

}
