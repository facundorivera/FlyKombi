import {Component,OnInit} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {Usuario} from '../../Entidades/usuario';
import { Router } from '@angular/router';
import { Validators,FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Email } from 'src/app/Entidades/email';
import { EmailService } from 'src/app/services/email.service';
import { Sesion } from 'src/app/Entidades/sesion';
import { FirebasepushService } from 'src/app/services/firebasepush.service';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  //private EmailValido = /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$\;
  usuario: Usuario = new Usuario ;
  sesion: any;
  Email: Email = new Email();
  TipoUser: string;
  sesionusuario:Sesion = new Sesion();
  erroremail:boolean;
  manejoerror:boolean;
 

  constructor(
    private usuarioservice: UsuarioService ,
    private routes: Router,
    private fb: FormBuilder,
    private lstorage:LocalStorageService,
    private emailservice: EmailService,
    private push: FirebasepushService){
    this.usuario = new Usuario();
   }
   //Definicion del formulario reactivo y sus formcontrol
   RegistroForm = this.fb.group({
    Nombre: ['',Validators.required],
    Apellido: ['',Validators.required],
    Usuario: ['',[Validators.required, Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    Contrasenia: ['',Validators.required],
  });


  ngOnInit() {
    //this.mapa.MapaGoogle;
  }

  altaUsuario(){
    // console.log(this.usuario.Nombre,this.usuario.Apellido,this.usuario.Email,this.usuario.Localidad);

    if(this.usuario.Usuario==null || this.usuario.Nombre==null || this.usuario.Apellido==null || this.usuario.Contrasenia==null)
    {
      Swal.fire({
        title: 'Ups!',
        text: 'Datos Incompletos',
        showCloseButton : true,
      })
    }
    
    else{  
      console.log(JSON.stringify(this.usuario));
      this.usuarioservice.altaUsuario(this.usuario).subscribe(
        res => {
          if (res.Correcto ===true)
          {
            
            this.sesionusuario = res;
            this.push.SolicitarPermisos();
            this.Redireccionar();
          } else {
              Swal.fire({
                title:'Usario Existente',
                text:'Porfavor prueba con otros datos',
                timer:2000
              })}
        },
        error => {
          Swal.fire({
            title:'Ups, algo ocurrio',
            text:'Hubo un poblema con el registro, intente de nuevo',
            timer:2000
          })
        },
        );
    }
  }

  Cancelar(){
   Swal.fire({
     title: '¿Estas Seguro?',
     showConfirmButton:true,
     showCancelButton: true,
     confirmButtonText : 'Si',
     cancelButtonText: 'No'

   }).then((resultado)=>{
     if (resultado.isConfirmed){
     this.RegistroForm.reset();
     
    
   }
  }
   )}

   Redireccionar(){
    Swal.fire({
      title: 'Bienvenido ' + this.usuario.Nombre
    })
    //  localStorage.getItem('usuario')
    this.lstorage.Usuario.next(this.usuario.Nombre);
    localStorage.setItem('sesion',JSON.stringify(this.sesionusuario));
    this.EnviarCorreo();
    this.routes.navigateByUrl('home');
   }


  EnviarCorreo(){
    this.Email.to =this.usuario.Usuario;
    this.Email.mensaje = `${this.usuario.Nombre} queremos darte la bienvenida a FlyKombi`;
    this.Email.subject = 'Registro en plataforma Flykombi';
   // console.log(this.usuario.Email);

    this.emailservice.EmailRegistro(this.Email).subscribe(
      res=>{ 
          // this.Redireccionar();
          this.erroremail = true;
          this.manejoerror= true;
          console.log('No tira error',this.manejoerror)
      },
      error=>{
        this.erroremail = false; 
        this.manejoerror = false;
        console.log('Porque tira error',this.manejoerror)     
      })

  }

}
