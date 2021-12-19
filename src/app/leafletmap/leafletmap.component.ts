import { Component, OnInit,AfterViewInit,ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leafletmap',
  templateUrl: './leafletmap.component.html',
  styleUrls: ['./leafletmap.component.scss']
})
export class LeafletmapComponent implements OnInit {
  // public map;

  constructor() { }

  ngOnInit(): void {
    // this.muestramapa();
  }

  // private muestramapa(): void{
  //   this.map=L.map('map').setView([-32.410278, -63.231389], 15);

  //   const titles =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //   });

  //   titles.addTo(this.map);
  // }

}
