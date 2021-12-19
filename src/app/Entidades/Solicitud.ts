export class SolInfo{
    IDSolicitud: number;
    FechaSolicitud: string;
    IDSolicitante: number;
    IDViaje: number;
    NombreSol: string;
    ApellidoSol: string;
    TipoUsuarioSolicitante:string;
    EmailSol:string;
    TokenFirebase:string;
    CelularSol:number;
    FacebookSol:string;
    TwiiterSol:string;
    InstagramSol:string;
    PinterestSol:string;
    EstadoSol: string;
    IDPost: number;
    NombrePost: string;
    ApellidoPost: string;
    IDEstadoSolicitud:number;
    FechaSalida:string;
    DirOrigen:string;
    DirDestino:string;
    EspaciosNeces:number;
    Integrantes:number;
}


export class SolicitudViaje{
    IDViaje:number;
    IDUsuario:number;
    IDTipoUsuario: number;
    AsientosNeces: number;
}


export class listNotif {
    IDMensaje:number;
    IDUsuario:number;
    Mensaje:String;
    Respuesta:number;
    IDEstadoSolicitud:number;
    RespCancelacion:string;
    Arrepentido:string;
    IDViaje:number;
    IDSolicitud:number;
    EspaciosNeces:number;
}