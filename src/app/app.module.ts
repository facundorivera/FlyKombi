import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//---------------------------------------------------/
import { LeafletService } from './services/leaflet.service';
import { DashperfilComponent } from './pages/dashperfil/dashperfil.component';
import { SidedashComponent } from './shared/sidedash/sidedash.component';
import { UsuarioService } from './services/usuario.service';
import { ViajesComponent } from './pages/viajes/viajes.component';
import { SolictudesComponent } from './pages/solictudes/solictudes.component';
import { PerfilComponent } from './perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SolicitudenvComponent } from './pages/solicitudenv/solicitudenv.component';
import { ViajessolComponent } from './pages/viajessol/viajessol.component';
import { CalificacionComponent } from './pages/calificacion/calificacion.component';
import { InfoviajeComponent } from './pages/infoviaje/infoviaje.component';
import { AltaviajeComponent } from './pages/altaviaje/altaviaje.component';
import { InfoviajesolComponent } from './pages/infoviajesol/infoviajesol.component';
import { PerfilterceroComponent } from './pages/perfiltercero/perfiltercero.component';
import { ConversacionesComponent } from './pages/conversaciones/conversaciones.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import {AngularFireMessagingModule} from '@angular/fire/messaging';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    RegistroComponent,
    LoginComponent,
    DashperfilComponent,
    SidedashComponent,
    ViajesComponent,
    SolictudesComponent,
    PerfilComponent,
    DashboardComponent,
    SolicitudenvComponent,
    ViajessolComponent,
    CalificacionComponent,
    InfoviajeComponent,
    AltaviajeComponent,
    InfoviajesolComponent,
    PerfilterceroComponent,
    ConversacionesComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
   // GooglePlaceModule
  ],
  providers: [LeafletService,UsuarioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
