namespace rcom.ws;

// using {
//     Currency,
//     User,
//     managed,
//     cuid
// } from '@sap/cds/common';

entity obtUser {
    key ID             : Integer;
        Resp           : String;
        nombreCompleto : String;
}
entity cabInfoUsuario {
    key ID             : Integer;
        detInfoUsuario : Composition of many detInfoUsuario
                             on detInfoUsuario.cabInfoUsuario = $self;
        // myResponse     : String;
}

entity detInfoUsuario {
    key ID             : Integer;
        nameId         : String;
        // myResponse     : String;
        nombreCompleto : String;
        cabInfoUsuario : Association to cabInfoUsuario;
}
entity inListClientes {
    key codCliente : String(10);
        myResponse : String;
}

entity infoPedido {
    key codCliente      : String(10);
    key fechaInicio     : String(8);
    key fechaFin        : String(8);
        codDestinatario : String(10);
        estado          : String(1);
        myResponse      : String;
}

entity transportistas {
    key codTransportista : String(10);
        myResponse       : String;
}

entity placaCisterna {
    key codTransportista : String(10);
        myResponse       : String;
}

entity infoCisterna {
    key placa      : String(10);
        myResponse : String;
}

entity infoTracto {
    key numVehiculo : String(10);
        myResponse  : String;
}

entity listaConductor {
    key numConductor : String(10);
        myResponse   : String;
}

entity infoConductor {
    key idConductor : String(10);
        myResponse  : String;
}

entity infoViajes {
    key codCentro       : String(4);
    key codCliente      : String(10);
    key fechaFin        : String(8);
    key fechaInicio     : String(8);
        codDestinatario : String(10);
        estado          : String(20);
        myResponse      : String;
}

entity listaDestinatarios {
    key codCliente : String(10);
        myResponse : String;
}

entity infoProductos {
    key codCliente      : String(10);
    key codDestinatario : String(10);
        codCentro       : String(10);
        myResponse      : String;
}

entity infoDetalleTransporte {
    key codCliente      : String(10);
    key numTransporte   : String(10);
        codDestinatario : String(10);
        myResponse      : String;
}

entity infoDetalleEntrega {
    key codCliente      : String(10);
    key numEntrega      : String(10);
        codDestinatario : String(10);
        myResponse      : String;
}

entity infoDetalleFactura {
    key codCliente      : String(10);
    key numPedido       : String(10);
        codDestinatario : String(10);
        myResponse      : String;
}

entity cotizacion {
    key codCentro       : String(4);
    key codCliente      : String(10);
        codDestinatario : String(10);
        fecha           : String(8);
        items           : Composition of many itemCotizacion
                              on items.cotizacion = $self;
        myResponse      : String;
}

entity itemCotizacion {
    key ID         : Integer;
        cotizacion : Association to cotizacion;
        areaVta    : String(8);
        codMat     : String(18);
        cantidad   : Integer;
}

entity cabSaldo {
    key codCliente : String(10);
        myResponse : String;
}

entity detSaldo {
    key codCliente : String(10);
        myResponse : String;
}

entity regPedido {
    key codCliente       : String(10);
    key codDestinatario  : String(10);
    key codCentro        : String(4);
        fechaPed         : String(8);
        flagComp         : String(1);
        flagCont         : String(1);
        codSCOP          : String(20);
        areaVta          : String(8);
        email            : String;
        detPedido        : Composition of many detPedido
                               on detPedido.regPedido = $self;

        codTransportista : String(10);
        dniConductor     : String(20);
        tipVeh           : String(4);
        numVeh           : String(10);

        detTransporte    : Composition of many detTransporte
                               on detTransporte.regPedido = $self;

        myResponse       : String;
}

entity detPedido {
    key ID        : Integer;
        regPedido : Association to regPedido;
        codProd   : String(18);
        volumen   : Integer;
}

entity detTransporte {
    key ID        : Integer;
        regPedido : Association to regPedido;
        numCom    : String(10);
        codProd   : String(18);
        volumen   : Integer;
}

entity infoRecalculaPedido {
    key ID          : Integer;
        listPedidos : Composition of many listPedidos
                          on listPedidos.infoRecalculaPedido = $self;
        myResponse  : String;
}

entity listPedidos {
    key pedido              : String(10);
        infoRecalculaPedido : Association to infoRecalculaPedido;
}

entity regTransporte {
    key tipVeh           : String(4);
    key numVeh           : String(10);
    key fechaTransporte  : String(8);
        codTransportista : String(10);
        dniConductor     : String(20);

        detTransporteT   : Composition of many detTransporteT
                               on detTransporteT.regTransporte = $self;

        pedidoT          : Composition of many pedidoT
                               on pedidoT.regTransporte = $self;

        myResponse       : String;
}

entity detTransporteT {
    key ID            : Integer;
        regTransporte : Association to regTransporte;
        numCom        : String(10);
        numPedido     : String(10);
        posPed        : String(6);
        codMat        : String(18);
        volPos        : Integer;
}

entity pedidoT {
    key numPedido       : String(10);
        codCliente      : String(10);
        codDestinatario : String(10);
        codCentro       : String(10);
        codSCOP         : String(20);
        fechaPedido     : String(8);
        regTransporte   : Association to regTransporte;
}

entity infoSCOP {
    key codSCOP    : String(20);       
        myResponse : String;
}
entity syncSCOP {
    key codSCOP    : String(20);
        codWERKS   : String(20);
        myResponse : String;
}
entity actPrdclides {
    key codCLI    : String(20);
        codDES   : String(20);
        myResponse : String;
}
entity listaSCOP {
    key codCliente      : String(10);
    key codDestinatario : String(10);
    key tipoSCOP        : String(10);
    key fechaInicio     : String(8);
    key fechaFin        : String(8);
        codEstado       : String(2);
        myResponse      : String;
}

entity cierraAnulaSCOP {
    key codSCOP    : String(20);
    key codEstado  : String(2);
        myResponse : String;
}

entity infoPagos {
    key codCliente  : String(10);
    key fechaFin    : String(8);
    key fechaInicio : String(8);
        myResponse  : String;
}

entity getDocTransporte {
    key shNumber   : String(10);
        myResponse : String;
}


//Correo
entity enviocorreo {
    key emailemisor   : String(50);
        emailreceptor : String;
        bcc           : String;
        asunto        : String;
        messagehtml   : String;
        texto         : String;
        adjunto_path  : Composition of many adjunto_path
                            on adjunto_path.enviocorreo = $self;

}

entity adjunto_path {
    key filename    : String;
        path        : String;
        content     : LargeString;
        encoding    : String;
        enviocorreo : Association to enviocorreo;
}

entity actEstadoTransp {
    key ID                 : Integer;
        detActEstadoTransp : Composition of many detActEstadoTransp
                                 on detActEstadoTransp.actEstadoTransp = $self;
        myResponse         : String;
}

entity detActEstadoTransp {
    key codCliente      : String(10);
    key codDestinatario : String(10);
    key transporte      : String(10);
        estado          : String(4);
        fecha           : String(8);
        hora            : String(6);
        actEstadoTransp : Association to actEstadoTransp;
}

//Web service SCOP
entity getListaOrdenPedido {
    key claveUsuario               : String(20);
    key loginUsuario               : String(20);
        codigoAutorizacion         : String(20);
        codigoError                : String(20);
        codigoMayoristaEquivalente : String(20);
        codigoPlanta               : String(20);
        codigoPlantaEquivalente    : String(20);
        codigoUsuario              : String(20);
        fechaFin                   : String(20);
        fechaInicio                : String(20);
        fechaRegistro              : String(20);
        fechaVenta                 : String(20);
        horaFin                    : String(20);
        horaInicio                 : String(20);
        horaRegistro               : String(20);
        idDetalleDivision1         : String(20);
        idDetalleDivision2         : String(20);
        placaTransporte            : String(20);
        resultado                  : String(20);
        ruc                        : String(20);
        tipoUsuario                : String(20);
        myResponse                 : String;
}


entity getListaOrdenPedidoPorSCOP {
    key claveUsuario               : String(20);
    key loginUsuario               : String(20);
        codigoAutorizacion         : String(20);
        codigoError                : String(20);
        codigoMayoristaEquivalente : String(20);
        codigoPlanta               : String(20);
        codigoPlantaEquivalente    : String(20);
        codigoUsuario              : String(20);
        fechaFin                   : String(20);
        fechaInicio                : String(20);
        fechaRegistro              : String(20);
        fechaVenta                 : String(20);
        horaFin                    : String(20);
        horaInicio                 : String(20);
        horaRegistro               : String(20);
        idDetalleDivision1         : String(20);
        idDetalleDivision2         : String(20);
        placaTransporte            : String(20);
        resultado                  : String(20);
        ruc                        : String(20);
        tipoUsuario                : String(20);
        myResponse                 : String;
}

entity creaSCOP {
    key loginUsuario               : String;
    key claveUsuario               : String;
    key TipoTransaccion            : String(1);
    key CodigoMayoristaEquivalente : String(2);
    key CodigoPlantaEquivalente    : String(2);
        PlacaTransporte            : String(8);
        Cola                       : String(1);
        detSCOP                    : Composition of many detSCOP
                                         on detSCOP.creaSCOP = $self;
        myResponse                 : String;
}

entity detSCOP {
    key ID                 : Integer;
        creaSCOP           : Association to creaSCOP;
        codigoProducto     : String(3);
        cantidadSolicitada : Integer;
}


entity creaSCOPGLP {
    key loginUsuario                      : String;
    key claveUsuario                      : String;
    key codigoOsinergComprador            : String;
    key codigoOsinergVendedor             : String(5);
    key codigoOsinergPlantaAbastecimiento : String(5);
        detSCOPGLP                        : Composition of many detSCOPGLP
                                                on detSCOPGLP.creaSCOPGLP = $self;
        myResponse                        : String;
}

entity detSCOPGLP {
    key ID                   : Integer;
        creaSCOPGLP          : Association to creaSCOPGLP;
        codigoProducto       : String(3);
        cantidadSolicitada   : String(13);
        unidadMedida         : String(3)
}

entity consultaHistorica {
    key fechaActualizacion : String(10);
    key codigoOsinergmin   : String(10);
        myResponse         : String;
}


entity regPrecio {
    key loginUsuario : String;
    key claveUsuario : String;
        detPrecio    : Composition of many detPrecio
                           on detPrecio.regPrecio = $self;
        myResponse   : String;
}

entity detPrecio {
    key ID             : Integer;
        regPrecio      : Association to regPrecio;
        codigoProducto : String(3);
        precio         : String;
        codigoUnidad   : String(1);
}


entity anulSCOP {
    key loginUsuario : String;
    key claveUsuario : String;
    key codSCOP      : String;
        detAnulSCOP  : Composition of many detAnulSCOP
                           on detAnulSCOP.anulSCOP = $self;
        myResponse   : String;
}

entity detAnulSCOP {
    key ID             : Integer;
        anulSCOP       : Association to anulSCOP;
        codigoProducto : String(3);
        codigoEstado   : String(02);
}

entity cierreSCOPGLP {
    key loginUsuario        : String;
    key claveUsuario        : String;
    key codSCOP             : String;
    key codOsinergComprador : String;
    key codOsinergVendedor  : String;
        detCierreSCOPGLP    : Composition of many detCierreSCOPGLP
                                  on detCierreSCOPGLP.cierreSCOP = $self;
        myResponse          : String;
}

entity detCierreSCOPGLP {
    key ID             : Integer;
        cierreSCOP     : Association to cierreSCOPGLP;
        codigoProducto : String(2);
        codigoEstado   : String(2);
        cantRecibida   : String(13);
        unidadMedida   : String(3);
}

//Begin I@OH-15/11/2021-Ticket-2021-007
entity anulaPedido {
    key numPedido  : String(10);
        myResponse : String;
}
//End I@OH-15/11/2021-Ticket-2021-007

entity infoUsuario {
    ID         : Integer;
    nameId     : String;
    myResponse : String;
}
//entity infoUsuario2 {
//   ID : Integer;
//   nameId : String;
//   myResponse : String;
// }