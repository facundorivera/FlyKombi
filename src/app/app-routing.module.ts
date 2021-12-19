import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { DashperfilComponent } from './pages/dashperfil/dashperfil.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ViajesComponent } from './pages/viajes/viajes.component';
import { SolictudesComponent } from './pages/solictudes/solictudes.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SolicitudenvComponent } from './pages/solicitudenv/solicitudenv.component';
import { ViajessolComponent } from './pages/viajessol/viajessol.component';
import { CalificacionComponent } from './pages/calificacion/calificacion.component';
import { InfoviajeComponent } from './pages/infoviaje/infoviaje.component';
import { AltaviajeComponent } from './pages/altaviaje/altaviaje.component';
import { InfoviajesolComponent } from './pages/infoviajesol/infoviajesol.component';
import { PerfilterceroComponent } from './pages/perfiltercero/perfiltercero.component';
import { ConversacionesComponent } from './pages/conversaciones/conversaciones.component';



const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'datoviaje',component:InfoviajeComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'login', component: LoginComponent},
  {path: 'altaviaje', component:AltaviajeComponent},
  {path: 'perfiluser/:iduser',component:PerfilterceroComponent},
  {path: 'dashperfil',
  component: DashperfilComponent,
  children:[
    {path:'perfil',component:PerfilComponent},
    {path:'misviajes',component:ViajesComponent},
    {path:'solicitudes',component:SolictudesComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'solicitudenviada',component:SolicitudenvComponent},
    {path: 'viajessol',component:ViajessolComponent},
    {path: 'calificacion',component:CalificacionComponent},
    {path: 'infoviajesol',component: InfoviajesolComponent },
    {path: 'conversacion/:id',component:ConversacionesComponent }
  ]},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
