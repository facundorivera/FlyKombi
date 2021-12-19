import { Usuario } from "./usuario";


export class Viajes{
    //Herencia de IDUsuario
    DirOrigen:string;
    DirDestino:string;
    //Waypoints
    DirPrParada:string;
    DirSgParada:string;
    DirTrParada:string;
    //Fin Waypoints
    Nombre:string;
    IDUsuario:number;
    Email:string;
    IDViaje:number;
    TipoUsuario: string;
    LatOrigen:string;
    LngOrigen:string;
    //Latitudes Longitudes waypoints
    LatPrParada:string;
    LngPrParada:String;
    LatSgParada:string;
    LngSgParada:string;
    LatTrParada:string;
    LngTrParada:string;
    //Fin Latitudes Longitudes waypoints
    LatDestino:string;
    LngDestino:string;
    GastoTotal:number;
    HoraSalida:string;
    FechaSalida:string;
    EspaciosDispo:number;
    EspaciosNeces:number;
    EspaciosLibresPasaj:number;
    CantDisponible:number;
    DistValor:number;
    DistText:string;
    DuraValor:number;
    DuraText: string;
    CantNafta:number;
    ValorNafta:number;
    Existe:boolean;
    PerMascota:string;
    PerBebe:String;
    PerFumar:String;
    MensajeGral:String;
}

//Se podria usar Herencia
export class ListaViaje{
    IDViaje: number;
    DirOrigen:string;
    LatOrigen:string;
    LngOrigen:string;
    DirDestino:string;
     //Waypoints
     DirPrParada:string;
     DirSgParada:string;
     DirTrParada:string;
     //Fin Waypoints
    LatDestino:string;
    LngDestino:string;
     //Latitudes Longitudes waypoints
     LatPrParada:string;
     LngPrParada:String;
     LatSgParada:string;
     LngSgParada:string;
     LatTrParada:string;
     LngTrParada:string;
     //Fin Latitudes Longitudes waypoints
    Nombre:string;
    Apellido:string;
    Email:string;
    IDUsuario:string;
    TipoUsuario:string;
    TokenFirebase:string;
    EstadoViaje:string;
    HoraSalida: string;
    FechaSalida: string;
    EspaciosDispo:number;
    EspaciosNeces:number;
    EspaciosLibresPasaj:number;
    GastoTotal:number;
    CantDiponible:number;
    Solicitud:string;
    DistValor:number;
    DistText:string;
    DuraValor:number;
    DuraText: string;
    CantNafta:number;
    ValorNafta:number;
    EspaciosLibres:number;
    PerMascota:string;
    PerBebe:String;
    PerFumar:String;
    MensajeGral:String;
    CantBuena:number;
    CantMala:number;
    
}

//Clase para modificar el viaje, solo atributos modificables.
export class ModViaje extends ListaViaje{
    IDusuario:number;
    Costo:number;
    FechaSalida:string;
    IDViaje:number;
}

//Herencia de clase ListaViaje

export class ViajesSol extends ListaViaje{
    FechaSolicitud:string;
    // MaxPasajeros: number;
    Usuarioabajo:string;
    EstadoSolicitud:string;
    Arrepentido:string;
    Integrantes:string;
    EmailPostulante:string;

}

export class Integrantes extends Usuario{
    
}


