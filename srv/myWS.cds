using { rcom.ws as my } from '../db/dbWS';

@path     : '/browse'
@requires : 'authenticated-user' //DESCOMENTAR PARA DEPLOYAR
service myWS {
    entity obtUser as projection on my.obtUser;

    entity inListClientes as projection on my.inListClientes;
    entity infoPedido as projection on my.infoPedido;
    entity transportistas as projection on my.transportistas;
    entity placaCisterna as projection on my.placaCisterna;
    entity infoCisterna as projection on my.infoCisterna;
    entity infoTracto as projection on my.infoTracto;
    entity listaConductor as projection on my.listaConductor;
    entity infoConductor as projection on my.infoConductor;
    entity infoViajes as projection on my.infoViajes;
    entity listaDestinatarios as projection on my.listaDestinatarios;
    entity infoProductos as projection on my.infoProductos;
    entity infoDetalleTransporte as projection on my.infoDetalleTransporte;
    entity infoDetalleEntrega as projection on my.infoDetalleEntrega;
    entity infoDetalleFactura as projection on my.infoDetalleFactura;
    entity cotizacion as projection on my.cotizacion;
    entity cabSaldo as projection on my.cabSaldo;
    entity detSaldo as projection on my.detSaldo;
    entity regPedido as projection on my.regPedido;
    entity infoRecalculaPedido as projection on my.infoRecalculaPedido;
    entity regTransporte as projection on my.regTransporte;
    entity infoSCOP as projection on my.infoSCOP;
    entity syncSCOP as projection on my.syncSCOP;
    entity actPrdclides as projection on my.actPrdclides;
    entity listaSCOP as projection on my.listaSCOP;
    entity cierraAnulaSCOP as projection on my.cierraAnulaSCOP;
    entity infoPagos as projection on my.infoPagos;
    entity getDocTransporte as projection on my.getDocTransporte;
    entity actEstadoTransp as projection on my.actEstadoTransp;
    entity getListaOrdenPedidoPorSCOP as projection on my.getListaOrdenPedidoPorSCOP;
    entity getListaOrdenPedido as projection on my.getListaOrdenPedido;
    entity creaSCOP as projection on my.creaSCOP;
    entity creaSCOPGLP as projection on my.creaSCOPGLP;
    entity anulSCOP as projection on my.anulSCOP;
    entity cierreSCOPGLP as projection on my.cierreSCOPGLP;
    entity consultaHistorica as projection on my.consultaHistorica;
    entity regPrecio as projection on my.regPrecio;
    entity enviocorreo as projection on my.enviocorreo;
    entity anulaPedido as projection on my.anulaPedido;//I@OH-15/11/2021

     entity infoUsuario as projection on my.infoUsuario;
     entity cabInfoUsuario   as projection on my.cabInfoUsuario;
    //entity infoUsuario2 as projection on my.infoUsuario2;

}