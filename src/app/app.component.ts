import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { FirebasepushService } from './services/firebasepush.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SubiQueTeLlevoWeb';

  showhead:boolean=false;


  ngOnInit(){

  }

  constructor( private push:FirebasepushService, private rutas:Router){
    rutas.events.forEach((event) =>{
      if (event instanceof NavigationStart){
        if ((event['url'].match('/dashperfil') || (event['url']).match('/perfiluser'))){
          this.showhead=false;
        } else{
          this.showhead=true;
        }
      }
    });

    // this.afMessaging.requestToken
    // .subscribe(
    //   (token) => { console.log('Permission granted! Save to the server!', token); },
    //   (error) => { console.error(error); },  
    // );

    // this.push.RecibeMensaje().subscribe(payload=>{
    //   console.log(payload);
    // })


  }
}
