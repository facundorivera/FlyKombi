//---Importaciones---//
// import { Injectable } from '@angular/core';
// import {HttpClient,HttpParams} from '@angular/common/http';
 import { BehaviorSubject } from 'rxjs';
// import {Component, OnInit} from '@angular/core';
// import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
// let mapa:google.maps.Map;
declare var google;


export class LeafletService {
//Variables para iniciacion de mapa y google places (autocompletado)
originPlaceId: string;
destinationPlaceId: string;
//Latitud, Longitud y direccion destino
LatDes:string ='';
LngDes:string= '';
DireccionDes: string ='';
//Latitud, Longitud y direccion origen
LatiOr: string='';
LngOr: string='';
DireccionOr: string='';
//Latitud, Longitud y direccion primer parada
LatPr:string='';
LngPr:string='';
DireccionPr:string='';
//Latitud, Longitud y direccion segunda parada
LatSg:string='';
LngSg:string ='';
DireccionSg:string ='';
//Latitud, Longitud y direccion tercer parada
LatTr:string='';
LngTr:string='';
DireccionTr:string='';

origen = {lat:0, lng: 0};
destino = {lat: 0, lng:0};

Muestrapunto = new BehaviorSubject<boolean>(true);
MuestraPuntoB = new BehaviorSubject<boolean>(true);
MuestraPuntoC= new BehaviorSubject<boolean>(true);

//public map;
  constructor(){ }
       MapaGoogle(map: google.maps.Map) {
         map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: { lat: -32.410278, lng: -63.231389 },
          zoom: 15,
        });
      }

      LatLngDestino(DESTINO: google.maps.places.Autocomplete, map: google.maps.Map,marker: google.maps.Marker){
        DESTINO.addListener('place_changed',()=>{
        const placedes=DESTINO.getPlace();
        this.LatDes=placedes.geometry.location.lat().toString();
        this.LngDes=placedes.geometry.location.lng().toString();
        this.DireccionDes=placedes.formatted_address;
        this.Muestrapunto.next(false);
        if (placedes.geometry.viewport) {
          map.fitBounds(placedes.geometry.viewport);
        } else {
          map.setCenter(placedes.geometry.location);
          map.setZoom(17);
        }
        marker.setPosition(placedes.geometry.location);
        marker.setVisible(true);
      });
      }

      LatLngOrigen(ORIGEN: google.maps.places.Autocomplete, map: google.maps.Map, marker: google.maps.Marker){
        ORIGEN.addListener('place_changed',()=>{
        const placeor=ORIGEN.getPlace();
        this.LatiOr= placeor.geometry.location.lat().toString();
        this.LngOr= placeor.geometry.location.lng().toString();
        this.DireccionOr= placeor.formatted_address;
        if (placeor.geometry.viewport) {
          map.fitBounds(placeor.geometry.viewport);
        } else {
          map.setCenter(placeor.geometry.location);
          map.setZoom(17);
        }
        marker.setPosition(placeor.geometry.location);
        marker.setVisible(true);
      });
      }

      LatLngPrparada(PRPARADA: google.maps.places.Autocomplete, map: google.maps.Map, marker: google.maps.Marker){
        PRPARADA.addListener('place_changed',()=>{
          console.log('Hola perro salvaje')
        const placepr=PRPARADA.getPlace();
        this.LatPr= placepr.geometry.location.lat().toString();
        this.LngPr= placepr.geometry.location.lng().toString();        
        this.DireccionPr= placepr.formatted_address;
        this.MuestraPuntoB.next(false);
        if (placepr.geometry.viewport) {
          map.fitBounds(placepr.geometry.viewport);
        } else {
          map.setCenter(placepr.geometry.location);
          map.setZoom(17);
        }
        marker.setPosition(placepr.geometry.location);
        marker.setVisible(true);
      });
      }

      LatLngSgparada(SGPARADA: google.maps.places.Autocomplete, map: google.maps.Map, marker: google.maps.Marker){
        SGPARADA.addListener('place_changed',()=>{
        const placesg=SGPARADA.getPlace();
        this.LatSg= placesg.geometry.location.lat().toString();
        this.LngSg= placesg.geometry.location.lng().toString();
        this.DireccionOr= placesg.formatted_address;
        this.MuestraPuntoC.next(false);
        if (placesg.geometry.viewport) {
          map.fitBounds(placesg.geometry.viewport);
        } else {
          map.setCenter(placesg.geometry.location);
          map.setZoom(17);
        }
        marker.setPosition(placesg.geometry.location);
        marker.setVisible(true);
      });
      }

      LatLngTrparada(TRPARADA: google.maps.places.Autocomplete, map: google.maps.Map, marker: google.maps.Marker){
        TRPARADA.addListener('place_changed',()=>{
        const placetr=TRPARADA.getPlace();
        this.LatTr= placetr.geometry.location.lat().toString();
        this.LngTr= placetr.geometry.location.lng().toString();
        this.DireccionOr= placetr.formatted_address;
        if (placetr.geometry.viewport) {
          map.fitBounds(placetr.geometry.viewport);
        } else {
          map.setCenter(placetr.geometry.location);
          map.setZoom(17);
        }
        marker.setPosition(placetr.geometry.location);
        marker.setVisible(true);
      });
      }

      //Obtener Direccion, latitud y lonigtud de origen
      DireOrigen(): string{
        return this.DireccionOr;
      }
      LatOrigen():string{
        return this.LatiOr;
      }
      LngOrigen():string{
        return this.LngOr;
      }

    //Obtener Direccion, latitud y longitud de destino
    DireDestino():string{
      return this.DireccionDes;
    }
    LatDestino():string{
      return this.LatDes;
    }
    LngDestino(): string{
      return this.LngDes;
    }
    //Obtener direccion, latitud y longitud de la primer parada (hacer push de array waypoint)
    DirePrimer():string{
      return this.DireccionPr;
    }
    LatPrimer():string{
      return this.LatPr;
    }
    LngPrimer():string{
      return this.LngPr;
    }
    //Obtener direccion, latitud y longitud de la segunda parada (hacer push de array waypoint)
    DireSegunda():string{
      return this.DireccionSg;
    }
    LatSegunda():string{
      return this.LatSg;
    }
    LngSegunda():string{
      return this.LngSg;
    }
//Obtener direccion, latitud y longitud de la tercer parada (hacer push de array waypoint)
    DireTercera():string{
      return this.DireccionTr;
    }
    LatTercera():string{
      return this.LatTr;      
    }
    LngTercera():string{
      return this.LngTr;
    }

    }
  