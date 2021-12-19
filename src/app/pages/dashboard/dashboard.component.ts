import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import {Sesion} from '../../Entidades/sesion';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import {ChartxMes,ChartSolicitud} from '../../Entidades/chart';
import { FirebasepushService } from 'src/app/services/firebasepush.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  sesion:Sesion= new Sesion();

  //Solicitudes Pendientes
  solPendientes:number;
  //Variables charts dashboard
  PorcPerfil:number;
  ViajesMes:number;
  SolicitudesMes:number;
  chartxmes: ChartxMes = new ChartxMes();
  chartxmes2 : ChartxMes = new ChartxMes();
  chartsolicitud: ChartSolicitud = new ChartSolicitud();
  chartsolicitud2: ChartSolicitud = new ChartSolicitud();
  Meses:any[];
  Cantidad: any[];
  Meses2:any[];
  Cantidad2:any[];
  solPendientesEnviadas:number;
  CalificacionesBuenas:number;
  CalififacionesMalas:number;

  Estado: any[];
  Cantidades: any[];

  constructor(private push:FirebasepushService ,private Charts: ChartService,private servicio:UsuarioService, private lstorage:LocalStorageService) { }

  ngOnInit(): void {
    //Obtengo IDusuario con Local Storage
    //Obtener cantidad de solicitudes
     this.sesion=this.lstorage.get('sesion');
    //  this.servicio.SolPendientes(this.sesion.IDUsuario).subscribe(
    //    res=>{
    //      this.solPendientes=res;
    //    },
    //    error=>{
    //      console.log(error);
    //   }
    //  )
    this.GetViajesMensuales();
    this.GetViajesMensuales2();
    this.GetCharSolicitudes();
    this.GetCharSolicitudes2();

    this.GetChartPerfil();
    this.GetViajesMes();
    this.GetSolicitudesMes();
    this.GetSolPendientes(this.sesion.IDUsuario);
    this.GetSolPendEnviadas(this.sesion.IDUsuario);
    this.GetCantCalificaBuenas(this.sesion.IDUsuario,"Buena");
    this.GetCantCalificaMalas(this.sesion.IDSesion,"Mala");

    // this.push.RecibeMensaje().subscribe(payload=>{
    //   console.log(payload);
    // })
    

  }


  //Metodo que consume endpoint para devolver chart de porcentaje perfil completo.
  GetChartPerfil()
  {
    this.Charts.GetChartPerfil(this.sesion.IDUsuario).subscribe(
      res=>{
        this.PorcPerfil = res;
      },
      error=>{

      }
    );
}


GetViajesMes()
{
  this.Charts.GetViajesMes(this.sesion.IDUsuario).subscribe(
    res=>{
     this.ViajesMes = res;
    },
    error=>{

    }
  )
}

GetSolicitudesMes()
{
  this.Charts.GetSolicitudesMes(this.sesion.IDUsuario).subscribe(
    res=>{
     this.SolicitudesMes=res;
    },
    error=>{

    }
  )
}

GetViajesMensuales(){
  this.Charts.GetGraficoxMes(this.sesion.IDUsuario).subscribe(
    res =>{
      this.chartxmes = res;
      this.Meses = Object.values(this.chartxmes).map(x=> x.Nombre);
      this.Cantidad = Object.values(this.chartxmes).map(x=>x.Cantidad);
      //console.log(this.Meses,this.Cantidad);
      const myChart = new Chart("myChart", {
        type: 'bar',
        data: {
            labels: [this.Meses[0],this.Meses[1],this.Meses[2],this.Meses[3],this.Meses[4],this.Meses[5]],
            datasets: [{
                label: 'Viajes por mes',
                data: [this.Cantidad[0], this.Cantidad[1], this.Cantidad[2], this.Cantidad[3], this.Cantidad[4],this.Cantidad[5]],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    

      
    },
    error=>{

    }
  )}

  GetViajesMensuales2(){
  this.Charts.GetGraficoxMes2(this.sesion.IDUsuario).subscribe(
    res =>{
      this.chartxmes2 = res;
      this.Meses = Object.values(this.chartxmes2).map(x=> x.Nombre);
      this.Cantidad = Object.values(this.chartxmes2).map(x=>x.Cantidad);
      //console.log(this.Meses,this.Cantidad);
      const myChart = new Chart("myChartA", {
        type: 'bar',
        data: {
            labels: [this.Meses[0],this.Meses[1],this.Meses[2],this.Meses[3],this.Meses[4],this.Meses[5]],
            datasets: [{
                label: 'Viajes por mes',
                data: [this.Cantidad[0], this.Cantidad[1], this.Cantidad[2], this.Cantidad[3], this.Cantidad[4],this.Cantidad[5]],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    

      
    },
    error=>{

    }
  )}

  GetCharSolicitudes(){

    this.Charts.GetChartSolicitud(this.sesion.IDUsuario).subscribe(
      res =>{
        this.chartsolicitud = res;
        this.Estado = Object.values(this.chartsolicitud).map(x=>x.Nombre);
        this.Cantidades = Object.values(this.chartsolicitud).map(x=>x.Cantidad);
        const chart = new Chart("myChart2",{
          type: 'doughnut',
          data: {
            labels: [
              this.Estado[0],
              this.Estado[1],
              this.Estado[2]
            ],
            datasets: [{
              label: 'My First Dataset',
              data: [this.Cantidades[0],this.Cantidades[1], this.Cantidades[2]],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          }
        });

      },
      error=>{

      }
    )}


    GetCharSolicitudes2(){

      this.Charts.GetChartSolicitud2(this.sesion.IDUsuario).subscribe(
        res =>{
          this.chartsolicitud2 = res;
          this.Estado = Object.values(this.chartsolicitud2).map(x=>x.Nombre);
          this.Cantidades = Object.values(this.chartsolicitud2).map(x=>x.Cantidad);
          const chart = new Chart("myChartB",{
            type: 'doughnut',
            data: {
              labels: [
                this.Estado[0],
                this.Estado[1],
                this.Estado[2]
              ],
              datasets: [{
                label: 'My First Dataset',
                data: [this.Cantidades[0],this.Cantidades[1], this.Cantidades[2]],
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
              }]
            }
          });
  
        },
        error=>{
  
        }
      )}

    GetSolPendientes(IDUsuario:number)
    {

      this.Charts.GetSolPendientes(IDUsuario).subscribe(
        res=>{
          this.solPendientes = res;
        },
        error=>{

        }
      )

    }

    GetSolPendEnviadas(IDUsuario:number)
    {
      this.Charts.getSolPendientesEnviadas(IDUsuario).subscribe(
        res=>{
          this.solPendientesEnviadas = res;
        }
      )
    }

    GetCantCalificaBuenas(IDUsuario:number,Estado:string)
    {
      this.Charts.getCalificaciones(IDUsuario,Estado).subscribe(
        res=>{
          this.CalificacionesBuenas = res;
        },
        error=>{

        }
      )
    }

    GetCantCalificaMalas(IDUsuario:number,Estado:string)
    {
      this.Charts.getCalificaciones(IDUsuario,Estado).subscribe(
        res=>{
          this.CalififacionesMalas = res;
        },
        error=>{

        }
      )
    }

}
