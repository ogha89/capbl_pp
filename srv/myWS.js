const cds = require('@sap/cds');
// const jwtDecode = require('jwt-decode');
const fetch = require('node-fetch');
var nodemailer = require("nodemailer");
let base64 = require('base-64');

let username = process.env.WS_ERP_USERNAME;//DESCOMENTAR PARA DEPLOYAR
// let username = 'PIPORTALUSER';//COMENTAR PARA DEPLOYAR
let password = process.env.WS_ERP_PASSWORD;
// let password = 'P3tr0p3ru$01';
//  let password = 'P3tr0p3ru';//QAS //COMENTAR PARA DEPLOYAR
let erp_ip = process.env.WS_ERP_IP;//DESCOMENTAR PARA DEPLOYAR
// let erp_ip = 'http://181.65.245.10:8200'; // PRD
// let erp_ip = 'http://200.48.96.184:8100';//QAS COMENTAR PARA DEPLOYAR

let osinergmin_ip = process.env.WS_OSINERGMIN_IP;//COMENTAR PARA DEPLOYAR
// let osinergmin_ip = 'http://200.48.96.185:8011';//QAS


let usernameIas = process.env.WS_IAS_USERNAME;
let passwordIas = process.env.WS_IAS_PASSWORD;

let smtp_host = process.env.SMTP_HOST;
let smtp_port = process.env.SMTP_PORT;

let user_osinergmin = process.env.WS_OSINERGMIN_USER;
let password_osinergmin = process.env.WS_OSINERGMIN_PASSWORD;
//  let user_osinergmin = "3379100"; // QAS
//  let password_osinergmin = "P0rt4l$3s"; // QAS
        

module.exports = cds.service.impl(srv => {


    srv.on('CREATE', 'infoProductos', _obtenerProductos) //ZWS003

    srv.on('CREATE', 'listaSCOP', _obtenerListaSCOP) //ZWS004

    srv.on('CREATE', 'cierraAnulaSCOP', _cerrarAnularSCOP)//ZWS008

    srv.on('CREATE', 'transportistas', _obtenerTransportistas) //ZWS009

    srv.on('CREATE', 'placaCisterna', _obtenerPlacaCisterna) //ZWS010

    srv.on('CREATE', 'infoCisterna', _obtenerInfoCisterna) //ZWS011

    srv.on('CREATE', 'infoTracto', _obtenerInfoTracto) //ZWS012

    srv.on('CREATE', 'listaConductor', _obtenerListaConductor) //ZWS013

    srv.on('CREATE', 'infoConductor', _obtenerInfoConductor) //ZWS014

    srv.on('CREATE', 'infoSCOP', _obtenerSCOP)//ZWS015

    srv.on('CREATE', 'cotizacion', _simulaCotizacion) //ZWS016

    srv.on('CREATE', 'cabSaldo', _obtenerCabSaldo) //ZWS017

    srv.on('CREATE', 'detSaldo', _obtenerDetSaldo) //ZWS018

    srv.on('CREATE', 'infoPagos', _obtenerInfoPagos) //ZWS019

    srv.on('CREATE', 'regPedido', _registrarFlujoPedido) //ZWS020

    srv.on('CREATE', 'infoPedido', _obtenerInfoPedido) //ZWS021

    srv.on('CREATE', 'infoDetalleEntrega', _obtenerDetalleEntrega) //ZWS022

    srv.on('CREATE', 'infoDetalleTransporte', _obtenerDetalleTransporte) //ZWS023

    srv.on('CREATE', 'infoDetalleFactura', _obtenerDetalleFactura) //ZWS024

    srv.on('CREATE', 'regTransporte', _registraTransporte) //ZWS025

    srv.on('CREATE', 'infoRecalculaPedido', _recalculaPrecio) //ZWS026

    srv.on('CREATE', 'infoViajes', _obtenerViajes) //ZWS027

    srv.on('CREATE', 'actEstadoTransp', _actualizarEstadoTransporte) //ZWS028

    srv.on('CREATE', 'inListClientes', _obtenerClientes) //ZWS029

    srv.on('CREATE', 'listaDestinatarios', _obtenerListaDestinatarios) //ZWS030

    srv.on('CREATE', 'getDocTransporte', _obtenerDocTransporte) //ZWS031

    srv.on('CREATE', 'anulaPedido', _anularPedido) //ZWS032

    srv.on('CREATE', 'enviocorreo', _enviocorreo) //SEND EMAIL

    // Web Services SCOP

    srv.on('CREATE', 'getListaOrdenPedidoPorSCOP', _obtListaOrdenPedidoPorSCOP) //ObtenerListaOrdenPedidoPorSCOP

    srv.on('CREATE', 'getListaOrdenPedido', _obtListaOrdenPedido) //ObtenerListaOrdenPedido

    srv.on('CREATE', 'creaSCOP', _crearOrdenSCOP) //Crear Orden SCOP

    srv.on('CREATE', 'creaSCOPGLP', _crearOrdenSCOPGLP) //Crear Orden SCOP

    srv.on('CREATE', 'cierreSCOPGLP', _cierreOrdenSCOPGLP) //Crear Orden SCOP


    srv.on('CREATE', 'consultaHistorica', _obtenerPrecios) //Consulta histórica de Precios

    srv.on('CREATE', 'regPrecio', _registrarPrecios) //Consulta histórica de Precios

    srv.on('READ', 'obtUser', _obtenerUsuario)

    srv.on('CREATE', 'infoUsuario', _obtenerinfoUsuario)

    srv.on('CREATE', 'cabInfoUsuario', _obtenerUsuarios)

    // srv.on('CREATE', 'infoUsuario2', _obtenerinfoUsuario2)

    srv.on('CREATE', 'anulSCOP', _anulaSCOP) //Crear Orden SCOP

    srv.on('CREATE', 'syncSCOP', _sincronizaSCOP)//sincroniza SCOP

    srv.on('CREATE', 'actPrdclides', _Prod_cliente_destionatario)//cliente destiantario SCOP

    //ZWS003 - Extrae Productos
    async function _obtenerProductos(req) {
        var codCentro = req.data.codCentro;
        var codCliente = req.data.codCliente;
        var codDestinatario = req.data.codDestinatario;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Producto_Cliente_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:productos_cliente';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Producto_Cliente_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:productos_cliente';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:productos_cliente">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Producto_Cliente_Request>' +
            '<CENTRO>' + codCentro + '</CENTRO>' +
            '<CODCLI>' + codCliente + '</CODCLI>' +
            '<CODDES>' + codDestinatario + '</CODDES>' +
            '</urn:MT_Producto_Cliente_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        console.log(myBody);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });

        var myResponse = await respuesta.text();
        return req.reply({ codCliente: codCliente, codDestinatario: codDestinatario, codCentro: codCentro, myResponse })
    }

    //ZWS004 - Extrae lista SCOP
    async function _obtenerListaSCOP(req) {

        var codCliente = req.data.codCliente;
        var codDestinatario = req.data.codDestinatario;
        var tipoSCOP = req.data.tipoSCOP;
        var fechaInicio = req.data.fechaInicio;
        var fechaFin = req.data.fechaFin;
        var codEstado = req.data.codEstado;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Ext_CodScop_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_codigo_scop';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Ext_CodScop_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_codigo_scop';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:extraer_codigo_scop">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Ext_CodScop_Request>' +
            '<CODCLI>' + codCliente + '</CODCLI>' +
            '<CODDES>' + codDestinatario + '</CODDES>' +
            '<TIPSCOP>' + tipoSCOP + '</TIPSCOP>' +
            '<FECHA_INI>' + fechaInicio + '</FECHA_INI>' +
            '<FECHA_FIN>' + fechaFin + '</FECHA_FIN>' +
            '<!--Optional:-->' +
            '<CODESTADO>' + codEstado + '</CODESTADO>' +
            '</urn:MT_Ext_CodScop_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            codCliente: codCliente, codDestinatario: codDestinatario, tipoSCOP: tipoSCOP,
            fechaInicio: fechaInicio, fechaFin: fechaFin, codEstado, myResponse
        })
    }

    //ZWS008 - Cerrar/Anular SCOP
    async function _cerrarAnularSCOP(req) {
        var codSCOP = req.data.codSCOP;
        var codEstado = req.data.codEstado;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Anula_Scop_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:anulacion_codigo_scop';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Anula_Scop_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:anulacion_codigo_scop';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:anulacion_codigo_scop">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Anula_Scop_Request>' +
            '<CODSCOP>' + codSCOP + '</CODSCOP>' +
            '<CODESTADO>' + codEstado + '</CODESTADO>' +
            '</urn:MT_Anula_Scop_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        // console.log(myBody);
        return req.reply({ codSCOP: codSCOP, codEstado: codEstado, myResponse })
    }


    //ZWS009 - Obtener transportistas
    async function _obtenerTransportistas(req) {
        var codTransportista = req.data.codTransportista;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_extraer_transportista_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_transportista';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_extraer_transportista_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_transportista';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:extraer_transportista">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_ext_transportista_Request>' +
            '<!--Optional:-->' +
            '<CODTRA>' + codTransportista + '</CODTRA>' +
            '</urn:MT_ext_transportista_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ codTransportista: codTransportista, myResponse })

    }

    //ZWS010 - Obtener Placa Cisterna
    async function _obtenerPlacaCisterna(req) {
        var codTransportista = req.data.codTransportista;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_placa_cisterna_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_placa_cisterna';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_placa_cisterna_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_placa_cisterna';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:extraer_transportista">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_placa_cisterna_Request>' +
            '<!--Optional:-->' +
            '<CODTRA>' + codTransportista + '</CODTRA>' +
            '</urn:MT_placa_cisterna_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ codTransportista: codTransportista, myResponse })

    }

    //ZWS011 - Obtener Info Placa Cisterna
    async function _obtenerInfoCisterna(req) {
        var placa = req.data.placa;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Info_Cisterna_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:informacion_cisterna';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Info_Cisterna_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:informacion_cisterna';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:informacion_cisterna">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Info_Cisterna_Request>' +
            '<!--Optional:-->' +
            '<Placa>' + placa + '</Placa>' +
            '</urn:MT_Info_Cisterna_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ placa: placa, myResponse })

    }

    //ZWS011 - Obtener Info Tracto
    async function _obtenerInfoTracto(req) {
        var numVehiculo = req.data.numVehiculo;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Info_Tractor_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:informacion_tractor';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Info_Tractor_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:informacion_tractor';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:informacion_tractor">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Info_Tractor_Request>' +
            '<!--Optional:-->' +
            '<NUMVEH>' + numVehiculo + '</NUMVEH>' +
            '</urn:MT_Info_Tractor_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        //var myResponse = "<SOAP:Envelope xmlns:SOAP='http://schemas.xmlsoap.org/soap/envelope/'><SOAP:Header/><SOAP:Body><ns1:MT_Info_Tractor_Response xmlns:ns1='urn:petroperu.com.pe:pmerp:portal_cliente:informacion_tractor'><Grupo_Producto><item><NUMCOM>001</NUMCOM><CAPCOM>4860.0</CAPCOM><GPOCOM>DYG</GPOCOM></item><item><NUMCOM>002</NUMCOM><CAPCOM>4805.0</CAPCOM><GPOCOM>DYG</GPOCOM></item></Grupo_Producto><Licencia><item><TIPLIC>CU</TIPLIC><DESTIPLIC>REGISTRO DE CUBICACIÓN</DESTIPLIC><LICENCIA>TMB515</LICENCIA><FECINIVIG>2012-05-25</FECINIVIG><FECFINVIG>2014-01-15</FECFINVIG></item><item><TIPLIC>MT</TIPLIC><DESTIPLIC>CERTIFICADO MTC</DESTIPLIC><LICENCIA>1FUJA6CKX7LX6</LICENCIA><FECINIVIG>2013-06-05</FECINIVIG><FECFINVIG>2015-06-05</FECFINVIG></item><item><TIPLIC>PS</TIPLIC><DESTIPLIC>POLIZA SEGURO</DESTIPLIC><LICENCIA>A0300193</LICENCIA><FECINIVIG>2014-01-11</FECINIVIG><FECFINVIG>2015-01-11</FECFINVIG></item><item><TIPLIC>CU</TIPLIC><DESTIPLIC>REGISTRO DE CUBICACIÓN</DESTIPLIC><LICENCIA>TMB515</LICENCIA><FECINIVIG>2012-05-25</FECINIVIG><FECFINVIG>2014-01-15</FECFINVIG></item><item><TIPLIC>MT</TIPLIC><DESTIPLIC>CERTIFICADO MTC</DESTIPLIC><LICENCIA>1FUJA6CKX7LX6</LICENCIA><FECINIVIG>2013-06-05</FECINIVIG><FECFINVIG>2015-06-05</FECFINVIG></item><item><TIPLIC>PS</TIPLIC><DESTIPLIC>POLIZA SEGURO</DESTIPLIC><LICENCIA>A0300193</LICENCIA><FECINIVIG>2014-01-11</FECINIVIG><FECFINVIG>2015-01-11</FECFINVIG></item></Licencia></ns1:MT_Info_Tractor_Response></SOAP:Body></SOAP:Envelope>";

        return req.reply({ numVehiculo: numVehiculo, myResponse })

        // return req.reply ( { numVehiculo: numVehiculo, "<SOAP:Envelope xmlns:SOAP='http://schemas.xmlsoap.org/soap/envelope/'><SOAP:Header/><SOAP:Body><ns1:MT_Info_Tractor_Response xmlns:ns1='urn:petroperu.com.pe:pmerp:portal_cliente:informacion_tractor'><Grupo_Producto><item><NUMCOM>001</NUMCOM><CAPCOM>4860.0</CAPCOM><GPOCOM>BDI</GPOCOM></item><item><NUMCOM>002</NUMCOM><CAPCOM>4805.0</CAPCOM><GPOCOM>BDI</GPOCOM></item></Grupo_Producto><Licencia><item><TIPLIC>CU</TIPLIC><DESTIPLIC>REGISTRO DE CUBICACIÓN</DESTIPLIC><LICENCIA>TMB515</LICENCIA><FECINIVIG>2012-05-25</FECINIVIG><FECFINVIG>2014-01-15</FECFINVIG></item><item><TIPLIC>MT</TIPLIC><DESTIPLIC>CERTIFICADO MTC</DESTIPLIC><LICENCIA>1FUJA6CKX7LX6</LICENCIA><FECINIVIG>2013-06-05</FECINIVIG><FECFINVIG>2015-06-05</FECFINVIG></item><item><TIPLIC>PS</TIPLIC><DESTIPLIC>POLIZA SEGURO</DESTIPLIC><LICENCIA>A0300193</LICENCIA><FECINIVIG>2014-01-11</FECINIVIG><FECFINVIG>2015-01-11</FECFINVIG></item><item><TIPLIC>CU</TIPLIC><DESTIPLIC>REGISTRO DE CUBICACIÓN</DESTIPLIC><LICENCIA>TMB515</LICENCIA><FECINIVIG>2012-05-25</FECINIVIG><FECFINVIG>2014-01-15</FECFINVIG></item><item><TIPLIC>MT</TIPLIC><DESTIPLIC>CERTIFICADO MTC</DESTIPLIC><LICENCIA>1FUJA6CKX7LX6</LICENCIA><FECINIVIG>2013-06-05</FECINIVIG><FECFINVIG>2015-06-05</FECFINVIG></item><item><TIPLIC>PS</TIPLIC><DESTIPLIC>POLIZA SEGURO</DESTIPLIC><LICENCIA>A0300193</LICENCIA><FECINIVIG>2014-01-11</FECINIVIG><FECFINVIG>2015-01-11</FECFINVIG></item></Licencia></ns1:MT_Info_Tractor_Response></SOAP:Body></SOAP:Envelope>" })
    }


    //ZWS013 - Obtener Lista Conductor
    async function _obtenerListaConductor(req) {
        var numConductor = req.data.numConductor;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Lista_Conductor_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:lista_conductor';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Lista_Conductor_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:lista_conductor';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:lista_conductor">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Lista_Conductor_Request>' +
            '<!--Optional:-->' +
            '<NUNCOM>' + numConductor + '</NUNCOM>' +
            '</urn:MT_Lista_Conductor_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        // console.log(myBody);
        // console.log(username);
        // console.log(password);
        // var myResponse = '<SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/">'+
        //                    ' <SOAP:Header/>'+
        //                     '<SOAP:Body>'+
        //                         '<ns1:MT_Lista_Conductor_Response xmlns:ns1="urn:petroperu.com.pe:pmerp:portal_cliente:lista_conductor">'+
        //                             '<LISTA_CONDUCTOR>'+
        //                             '<NUMCOM>17693</NUMCOM>'+
        //                             '<IDCOND>PE08684283</IDCOND>'+
        //                             '<NOMCON>MIGUEL</NOMCON>'+
        //                             '<APECON>VILLAR</APECON>'+
        //                             '</LISTA_CONDUCTOR>'+
        //                         '</ns1:MT_Lista_Conductor_Response>'+
        //                     '</SOAP:Body>'+
        //                     '</SOAP:Envelope>';

        return req.reply({ numConductor: numConductor, myResponse })

    }

    //ZWS014 - Obtener info Conductor
    async function _obtenerInfoConductor(req) {
        // console.log(req.user);
        var idConductor = req.data.idConductor;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Info_Conductor_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:informacion_conductor';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Info_Conductor_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:informacion_conductor';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:informacion_conductor">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Info_Conductor_Request>' +
            '<IDCOND>' + idConductor + '</IDCOND>' +
            '</urn:MT_Info_Conductor_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ idConductor: idConductor, myResponse })

    }

    //ZWS015 - Obtener info SCOP
    async function _obtenerSCOP(req) {

        var codSCOP = req.data.codSCOP;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Estado_Scop_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:estado_scop';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Estado_Scop_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:estado_scop';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:estado_scop">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Estado_Scop_Request>' +
            '<CODSCOP>' + codSCOP + '</CODSCOP>' +
            '</urn:MT_Estado_Scop_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ codSCOP: codSCOP, myResponse })

    }
    //ZWS000 -Sincroniza SCOP
    async function _sincronizaSCOP(req) {

        var codSCOP = req.data.codSCOP;
        var codWERKS = req.data.codWERKS;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Estado_Scop_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:estado_scop';
        //const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Estado_Scop_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:estado_scop';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_SCOP_M3&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:SCOP_M3';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:SCOP_M3">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Portal_ScopM3_Request>' +
            '<I_COD_SCOP>' + codSCOP + '</I_COD_SCOP>' +
            '<I_WERKS>'+codWERKS+'</I_WERKS>'+
            '</urn:MT_Portal_ScopM3_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ codSCOP: codSCOP, codWERKS: codWERKS,  myResponse })

    }
    //ZWS000 -ProdclienteDestiantario
    async function _Prod_cliente_destionatario(req) {

        var codCLI = req.data.codCLI;
        var codDES = req.data.codDES;
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Prod_Cliente_Destinatario_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:producto_cliente_destintario';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:producto_cliente_destintario">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Producto_Cliente_Destinatario_Request>' +
            '<CODCLI>' + codCLI + '</CODCLI>' +
            '<CODDES>'+codDES+'</CODDES>'+
            '</urn:MT_Producto_Cliente_Destinatario_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        console.log(myBody);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ codCLI: codCLI, codDES: codDES,  myResponse })

    }    
    //ZWS016 - Obtener info Conductor
    async function _simulaCotizacion(req) {
        var codCentro = req.data.codCentro;
        var codCliente = req.data.codCliente;
        var codDestinatario = req.data.codDestinatario;
        var fecha = req.data.fecha;

        var items = {};

        items = req.data.items;
        if (req.data.items != null) {
            items = req.data.items;
        }

        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Simula_Cotizacion_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:simula_cotizacion';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Simula_Cotizacion_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:simula_cotizacion';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:simula_cotizacion">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Simula_Cotizacion_Request>' +
            '<IT_CLIENTE>' +
            '<Item>' +
            '<CENTRO>' + codCentro + '</CENTRO>' +
            '<CODCLI>' + codCliente + '</CODCLI>' +
            '<CODDES>' + codDestinatario + '</CODDES>' +
            '<FECHA>' + fecha + '</FECHA>' +
            '</Item>' +
            '</IT_CLIENTE>' +
            '<IT_PRODUCTO>' +
            '<!--Zero or more repetitions:-->'
        for (var i = 0; i < items.length; i++) {
            myBody = myBody +
                '<item>' +
                '<!--Optional:-->' +
                '<AREA_VTA>' + items[i].areaVta + '</AREA_VTA>' +
                ' <!--Optional:-->' +
                '<CENTRO>' + codCentro + '</CENTRO>' +
                ' <!--Optional:-->' +
                '<CODMAT>' + items[i].codMat + '</CODMAT>' +
                '<!--Optional:-->' +
                '<CANTIDAD>' + items[i].cantidad + '</CANTIDAD>' +
                '</item>'
        }
        myBody = myBody + '</IT_PRODUCTO>' +
            '</urn:MT_Simula_Cotizacion_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        // console.log(myBody);
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        // console.log(myBody);
        return req.reply({
            codCentro: codCentro, codCliente: codCliente,
            codDestinatario, fecha, items, myResponse
        })

    }

    //ZWS017 - Obtener Cabecera Saldo
    async function _obtenerCabSaldo(req) {
        var codCliente = req.data.codCliente;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Saldo_Cab_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:cabecera_saldo';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Saldo_Cab_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:cabecera_saldo';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:cabecera_saldo">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Saldo_Cab_Request>' +
            '<I_CODCLI>' + codCliente + '</I_CODCLI>' +
            '</urn:MT_Saldo_Cab_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        // var myResponse = "<SOAP:Envelope xmlns:SOAP='http://schemas.xmlsoap.org/soap/envelope/'><SOAP:Header/>" +

        // "<SOAP:Body><ns1:MT_Saldo_Cab_Response xmlns:ns1='urn:petroperu.com.pe:pmerp:portal_cliente:cabecera_saldo'><ET_SALDO_CAB>" +

        // "<Item><MONEDA>PEN</MONEDA><LIMCRE>999999999.00</LIMCRE><SLINEA>+</SLINEA><SALDIS>500000.68</SALDIS><SSALDIS>+</SSALDIS></Item></ET_SALDO_CAB></ns1:MT_Saldo_Cab_Response></SOAP:Body></SOAP:Envelope>";

        return req.reply({ codCliente: codCliente, myResponse })

    }

    //ZWS018 - Obtener Detalle Saldo
    async function _obtenerDetSaldo(req) {
        var codCliente = req.data.codCliente;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Saldo_Det_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:detalle_saldo';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Saldo_Det_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:detalle_saldo';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:detalle_saldo">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Saldo_Det_Request>' +
            '<I_COD_CLI>' + codCliente + '</I_COD_CLI>' +
            '</urn:MT_Saldo_Det_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ codCliente: codCliente, myResponse })

    }

    //ZWS019 - Obtener información Pagos
    async function _obtenerInfoPagos(req) {
        var codCliente = req.data.codCliente;
        var fechaFin = req.data.fechaFin;
        var fechaInicio = req.data.fechaInicio;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Informacion_Pagos&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:informacion_pagos';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Informacion_Pagos&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:informacion_pagos';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:informacion_pagos">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Info_Pagos_Request>' +
            '<I_COD_CLI>' + codCliente + '</I_COD_CLI>' +
            '<I_FECHAF>' + fechaFin + '</I_FECHAF>' +
            '<I_FECHAI>' + fechaInicio + '</I_FECHAI>' +
            '</urn:MT_Info_Pagos_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ codCliente: codCliente, fechaFin: fechaFin, fechaInicio: fechaInicio, myResponse })

    }

    //ZWS020 - Registrar flujo de Pedidos
    async function _registrarFlujoPedido(req) {
        var codCliente = req.data.codCliente;
        var codDestinatario = req.data.codDestinatario;
        var codCentro = req.data.codCentro;
        var fechaPed = req.data.fechaPed;
        var flagComp = req.data.flagComp;
        var flagCont = req.data.flagCont;
        var codSCOP = req.data.codSCOP;
        var areaVta = req.data.areaVta;
        var email = req.data.email;

        var detPedido = {};

        if (req.data.detPedido != null) {
            detPedido = req.data.detPedido;
        }

        var codTransportista = req.data.codTransportista;
        var dniConductor = req.data.dniConductor;
        var tipVeh = req.data.tipVeh;
        var numVeh = req.data.numVeh;

        var detTransporte = {};
        if (req.data.detTransporte != null) {
            detTransporte = req.data.detTransporte;
        }

        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Registra_Pedido_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:registrar_pedido';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Registra_Pedido_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:registrar_pedido';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:registrar_pedido">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Registra_Pedido_Request>' +
            '<I_CABPEDIDO>' +
            '<CODCLI>' + codCliente + '</CODCLI>' +
            '<CODDES>' + codDestinatario + '</CODDES>' +
            '<PLANTA>' + codCentro + '</PLANTA>' +
            '<!--Optional:-->' +
            '<FECHA_PED>' + fechaPed + '</FECHA_PED>' +
            '<!--Optional:-->' +
            '<FLAG_COMP>' + flagComp + '</FLAG_COMP>' +
            '<!--Optional:-->' +
            '<FLAG_CONT>' + flagCont + '</FLAG_CONT>' +
            '<!--Optional:-->' +
            '<CODSCOP>' + codSCOP + '</CODSCOP>' +
            '<!--Optional:-->' +
            '<AREAVTA>' + areaVta + '</AREAVTA>' +
            "<!--Optional:-->" + 
            "<EMAIL>" + email + "</EMAIL>" + 
            '</I_CABPEDIDO>' +
            '<IT_DETPEDIDO>' +
            '<!--1 or more repetitions:-->'
        for (var i = 0; i < detPedido.length; i++) {
            myBody = myBody + '<item>' +
                '<CODPROD>' + detPedido[i].codProd + '</CODPROD>' +
                '<VOLUMEN>' + detPedido[i].volumen + '</VOLUMEN>' +
                '</item>'
        }
        myBody = myBody + '</IT_DETPEDIDO>' +
            '<!--Optional:-->' +
            '<I_CABTRANSPORTE>' +
            '<!--Optional:-->' +
            '<TRANSPORTISTA>' + codTransportista + '</TRANSPORTISTA>' +
            '<!--Optional:-->' +
            '<DNICONDUCTOR>' + dniConductor + '</DNICONDUCTOR>' +
            '<!--Optional:-->' +
            '<TIPVEH>' + tipVeh + '</TIPVEH>' +
            '<!--Optional:-->' +
            '<NUMVEH>' + numVeh + '</NUMVEH>' +
            '</I_CABTRANSPORTE>' +
            '<!--Optional:-->' +
            '<IT_DETTRANSPORTE>' +
            '<!--Zero or more repetitions:-->'
        for (var j = 0; j < detTransporte.length; j++) {
            myBody = myBody + '<item>' +
                '<!--Optional:-->' +
                '<NUMCOM>' + detTransporte[j].numCom + '</NUMCOM>' +
                '<!--Optional:-->' +
                '<CODPROD>' + detTransporte[j].codProd + '</CODPROD>' +
                '<!--Optional:-->' +
                '<VOLUMEN>' + detTransporte[j].volumen + '</VOLUMEN>' +
                '</item>'
        }
        myBody = myBody + '</IT_DETTRANSPORTE>' +

            '</urn:MT_Registra_Pedido_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        console.log(myBody);
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            codCliente: codCliente, codDestinatario: codDestinatario, codCentro: codCentro,
            fechaPed, flagComp, flagCont, codSCOP, areaVta, detPedido, codTransportista, dniConductor,
            tipVeh, numVeh, detTransporte, myResponse
        })

    }

    //ZWS021 - Obtener info Pedidos //Presenta Lentitud
    async function _obtenerInfoPedido(req) {

        var codCliente = req.data.codCliente;
        var codDestinatario = req.data.codDestinatario;
        var estado = req.data.estado;
        var fechaInicio = req.data.fechaInicio;
        var fechaFin = req.data.fechaFin;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Extraer_Info_Pedido_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_info_pedido';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Extraer_Info_Pedido_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_info_pedido';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:extraer_info_pedido">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Extraer_Pedido_Request>' +
            '<I_CODCLI>' + codCliente + '</I_CODCLI>' +
            '<!--Optional:-->' +
            '<I_CODDES>' + codDestinatario + '</I_CODDES>' +
            '<!--Optional:-->' +
            '<I_ESTADO>' + estado + '</I_ESTADO>' +
            '<I_FECHA_INI>' + fechaInicio + '</I_FECHA_INI>' +
            '<I_FECHA_FIN>' + fechaFin + '</I_FECHA_FIN>' +
            '</urn:MT_Extraer_Pedido_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            codCliente: codCliente, fechaInicio: fechaInicio, fechaFin: fechaFin,
            codDestinatario, estado, myResponse
        })

    }

    //ZWS022	Extraer detalle de Entrega.
    async function _obtenerDetalleEntrega(req) {
        var codCliente = req.data.codCliente;//'1000000697';
        var codDestinatario = req.data.codDestinatario;//'86017';
        var numEntrega = req.data.numEntrega;//'8003227470';
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Ext_Det_Entrega_OUT&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_entrega';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Ext_Det_Entrega_OUT&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_entrega';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_entrega">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Ext_Det_Entrega_Request>' +
            '<CODCLI>' + codCliente + '</CODCLI>' +
            '<!--Optional:-->' +
            '<CODDES>' + codDestinatario + '</CODDES>' +
            '<NUMENT>' + numEntrega + '</NUMENT>' +
            '</urn:MT_Ext_Det_Entrega_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        return req.reply({
            codCliente: codCliente, numEntrega: numEntrega,
            codDestinatario: codDestinatario, myResponse
        })

    }

    //ZWS023	Extraer detalle de transporte.
    async function _obtenerDetalleTransporte(req) {
        var codCliente = req.data.codCliente;//'1000000697';
        var codDestinatario = req.data.codDestinatario;//'86017';
        var numTransporte = req.data.numTransporte;//'8003227470';
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Ext_Det_Transporte_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_transporte';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Ext_Det_Transporte_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_transporte';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_transporte">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Ext_Det_Transporte_Request>' +
            '<CODCLI>' + codCliente + '</CODCLI>' +
            '<!--Optional:-->' +
            '<CODDES>' + codDestinatario + '</CODDES>' +
            '<NUMTRA>' + numTransporte + '</NUMTRA>' +
            '</urn:MT_Ext_Det_Transporte_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        // var myResponse = "<SOAP:Envelope xmlns:SOAP='http://schemas.xmlsoap.org/soap/envelope/'><SOAP:Header/><SOAP:Body><ns1:MT_Ext_Det_Transporte_Response xmlns:ns1='urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_transporte'><ET_CAB_TRANSPORTE><item><NUMTRA>8003552850</NUMTRA><CODCEN>3001</CODCEN><NUMPLAC>PEB9F911</NUMPLAC><IDCON>PE43982451</IDCON><NOMCON>ADIEL RICHI</NOMCON>" + 
        //                  "<APECON>ALVARADO MEZA</APECON></item></ET_CAB_TRANSPORTE><ET_DET_COMPART><item><NUMTRA>8003552850</NUMTRA><NUMCOM>001</NUMCOM><NUMPED>5731754</NUMPED><POSPED>000050</POSPED><CODMAT>30422</CODMAT><VOLPOS>2200.0</VOLPOS><UNIMED>UGL</UNIMED><IMPFIN>31724.54</IMPFIN><MONEDA>PEN</MONEDA><CODCLI>1000000207</CODCLI><CODDES>32232</CODDES></item>" + 
        //                  "<item><NUMTRA>8003552850</NUMTRA><NUMCOM>002</NUMCOM><NUMPED>5731754</NUMPED><POSPED>000010</POSPED><CODMAT>30019</CODMAT><VOLPOS>1000.0</VOLPOS><UNIMED>UGL</UNIMED><IMPFIN>23246.73</IMPFIN><MONEDA>PEN</MONEDA><CODCLI>1000000207</CODCLI><CODDES>32232</CODDES></item><item><NUMTRA>8003552850</NUMTRA><NUMCOM>003</NUMCOM><NUMPED>5731754</NUMPED><POSPED>000010</POSPED>" + 
        //                  "<CODMAT>30019</CODMAT><VOLPOS>500.0</VOLPOS><UNIMED>UGL</UNIMED><IMPFIN>23246.73</IMPFIN><MONEDA>PEN</MONEDA><CODCLI>1000000207</CODCLI><CODDES>32232</CODDES></item></ET_DET_COMPART><ET_ESTADO_TRANS><item><NUMTRA>8003552850</NUMTRA><CODEST>4</CODEST><FECEST>2021-11-01</FECEST><HOREST>11:57:09</HOREST></item></ET_ESTADO_TRANS><ET_RETURN/>" + 
        //                  "</ns1:MT_Ext_Det_Transporte_Response></SOAP:Body></SOAP:Envelope>";



        return req.reply({
            codCliente: codCliente, numTransporte: numTransporte,
            codDestinatario: codDestinatario, myResponse
        })

    }

    //ZWS024	Extraer detalle de Factura.
    async function _obtenerDetalleFactura(req) {
        var codCliente = req.data.codCliente;//'1000000697';
        var codDestinatario = req.data.codDestinatario;//'86017';
        var numPedido = req.data.numPedido;//'8003227470';
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Ext_Det_Facturacion_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_facturacion';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Ext_Det_Facturacion_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_facturacion';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:extraer_det_facturacion">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Ext_Det_Facturacion_Request>' +
            '<CODCLI>' + codCliente + '</CODCLI>' +
            '<!--Optional:-->' +
            '<CODDES>' + codDestinatario + '</CODDES>' +
            '<NUMPED>' + numPedido + '</NUMPED>' +
            '</urn:MT_Ext_Det_Facturacion_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        return req.reply({
            codCliente: codCliente, numPedido: numPedido,
            codDestinatario: codDestinatario, myResponse
        })

    }


    //ZWS025	Registrar Transporte.
    async function _registraTransporte(req) {

        var tipVeh = req.data.tipVeh;
        var numVeh = req.data.numVeh;
        var fechaTransporte = req.data.fechaTransporte;
        var codTransportista = req.data.codTransportista;
        var dniConductor = req.data.dniConductor;

        var detTransporteT = {};
        var pedidoT = {};

        if (req.data.detTransporteT != null) {
            detTransporteT = req.data.detTransporteT;
        }

        if (req.data.pedidoT != null) {
            pedidoT = req.data.pedidoT;
        }


        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SOS_RegTransporte&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:registra_transporte';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SOS_RegTransporte&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:registra_transporte';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:registra_transporte">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_RegTransporte>' +
            '<!--Optional:-->' +
            '<CABECERA>' +
            '<!--Zero or more repetitions:-->' +
            '<ITEM>' +
            '<!--Optional:-->' +
            '<CODTRA>' + codTransportista + '</CODTRA>' +
            '<!--Optional:-->' +
            '<DNICON>' + dniConductor + '</DNICON>' +
            '<!--Optional:-->' +
            '<TIPVEH>' + tipVeh + '</TIPVEH>' +
            '<!--Optional:-->' +
            '<NUMVEH>' + numVeh + '</NUMVEH>' +
            '<!--Optional:-->' +
            '<FECTRA>' + fechaTransporte + '</FECTRA>' +
            '</ITEM>' +
            '</CABECERA>' +
            '<!--Optional:-->' +
            '<DETALLE>' +
            '<!--Zero or more repetitions:-->'
        for (var i = 0; i < detTransporteT.length; i++) {
            myBody = myBody + '<ITEM>' +
                '<!--Optional:-->' +
                '<NUMCOM>' + detTransporteT[i].numCom + '</NUMCOM>' +
                '<!--Optional:-->' +
                '<NUMPED>' + detTransporteT[i].numPedido + '</NUMPED>' +
                '<!--Optional:-->' +
                '<POSPED>' + detTransporteT[i].posPed + '</POSPED>' +
                '<!--Optional:-->' +
                '<CODMAT>' + detTransporteT[i].codMat + '</CODMAT>' +
                '<!--Optional:-->' +
                '<VOLPOS>' + detTransporteT[i].volPos + '</VOLPOS>' +
                '</ITEM>'
        }
        myBody = myBody + '</DETALLE>' +
            '<!--Optional:-->' +
            '<PEDIDO>' +
            '<!--Zero or more repetitions:-->'

        for (var j = 0; j < pedidoT.length; j++) {
            myBody = myBody + '<ITEM>' +
                '<!--Optional:-->' +
                '<CODCLI>' + pedidoT[j].codCliente + '</CODCLI>' +
                '<!--Optional:-->' +
                '<CODDES>' + pedidoT[j].codDestinatario + '</CODDES>' +
                '<!--Optional:-->' +
                '<NUMPED>' + pedidoT[j].numPedido + '</NUMPED>' +
                '<!--Optional:-->' +
                '<CODCEN>' + pedidoT[j].codCentro + '</CODCEN>' +
                '<!--Optional:-->' +
                '<FECPED>' + pedidoT[j].fechaPedido + '</FECPED>' +
                '<!--Optional:-->' +
                '<CODSCO>' + pedidoT[j].codSCOP + '</CODSCO>' +
                '</ITEM>'
        }
        myBody = myBody + '</PEDIDO>' +
            '</urn:MT_RegTransporte>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        // console.log(myBody);
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        return req.reply({
            tipVeh: tipVeh, numVeh: numVeh, fechaTransporte: fechaTransporte, codTransportista,
            dniConductor, detTransporteT, pedidoT, myResponse
        })

    }

    //ZWS026	Recalcula Precio.
    async function _recalculaPrecio(req) {
        var ID = req.data.ID;
        var listPedidos = {};

        if (req.data.listPedidos != null) {
            listPedidos = req.data.listPedidos;
        }
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Recalcula_Precio_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:recalcula_precio';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Recalcula_Precio_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:recalcula_precio';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:recalcula_precio">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Recalcula_Precio_Request>' +
            '<IT_PEDIDO>' +
            '<!--Zero or more repetitions:-->'
        for (var i = 0; i < listPedidos.length; i++) {
            myBody = myBody + '<item>' +
                '<!--Optional:-->' +
                '<DOC_PEDIDO>' + listPedidos[i].pedido + '</DOC_PEDIDO>' +
                '</item>'
        }
        myBody = myBody + '</IT_PEDIDO>' +
            '</urn:MT_Recalcula_Precio_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        return req.reply({ ID: ID, listPedidos, myResponse })

    }

    // ZWS027 - Obtener Viajes
    async function _obtenerViajes(req) {

        var codCentro = req.data.codCentro;
        var codCliente = req.data.codCliente;
        var codDestinatario = req.data.codDestinatario;
        var estado = req.data.estado;
        var fechaInicio = req.data.fechaInicio;
        var fechaFin = req.data.fechaFin;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SOS_ExtTransporte&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_transporte';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SOS_ExtTransporte&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:extraer_transporte';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:extraer_transporte">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_ExtTransporte>' +
            '<!--Optional:-->' +
            '<CODCEN>' + codCentro + '</CODCEN>' +
            '<!--Optional:-->' +
            '<CODCLI>' + codCliente + '</CODCLI>' +
            '<!--Optional:-->' +
            '<CODDES>' + codDestinatario + '</CODDES>' +
            '<!--Optional:-->' +
            '<ESTADO>' + estado + '</ESTADO>' +
            '<!--Optional:-->' +
            '<FECCREFIN>' + fechaFin + '</FECCREFIN>' +
            '<!--Optional:-->' +
            '<FECCREINI>' + fechaInicio + '</FECCREINI>' +
            '</urn:MT_ExtTransporte>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        // var myResponse = "<SOAP:Envelope xmlns:SOAP='http://schemas.xmlsoap.org/soap/envelope/'><SOAP:Header/><SOAP:Body><ns1:MT_ExtTransporteRes xmlns:ns1='urn:petroperu.com.pe:pmerp:portal_cliente:extraer_transporte'>" + 
        //                  "<DOCUMENTOS><ITEM><NUMTRA>8003554637</NUMTRA><NUMPED>5132141</NUMPED><NUMENT>85750982</NUMENT></ITEM><ITEM><NUMTRA>8003557203</NUMTRA><NUMPED>5739557</NUMPED><NUMENT>85755032</NUMENT></ITEM><ITEM><NUMTRA>8003560982</NUMTRA><NUMPED>5747139</NUMPED><NUMENT>85761948</NUMENT></ITEM><ITEM><NUMTRA>8003564594</NUMTRA><NUMPED>5753817</NUMPED><NUMENT>85768633</NUMENT></ITEM>" + 
        //                  "<ITEM><NUMTRA>8003565827</NUMTRA><NUMPED>5132141</NUMPED><NUMENT>85771191</NUMENT></ITEM><ITEM><NUMTRA>8003551819</NUMTRA><NUMPED>5730674</NUMPED><NUMENT>85744999</NUMENT></ITEM><ITEM><NUMTRA>8003552301</NUMTRA><NUMPED>5730219</NUMPED><NUMENT>85745760</NUMENT></ITEM><ITEM><NUMTRA>8003556087</NUMTRA><NUMPED>5724537</NUMPED><NUMENT>85752967</NUMENT></ITEM>" + 
        //                  "<ITEM><NUMTRA>8003558598</NUMTRA><NUMPED>5132141</NUMPED><NUMENT>85746798</NUMENT></ITEM><ITEM><NUMTRA>8003559166</NUMTRA><NUMPED>5743317</NUMPED><NUMENT>85758182</NUMENT></ITEM><ITEM><NUMTRA>8003552850</NUMTRA><NUMPED>5731754</NUMPED><NUMENT>85744468</NUMENT></ITEM><ITEM><NUMTRA>8003553403</NUMTRA><NUMPED>5731229</NUMPED><NUMENT>85747855</NUMENT></ITEM>" + 
        //                  "<ITEM><NUMTRA>8003561665</NUMTRA><NUMPED>5132141</NUMPED><NUMENT>85763289</NUMENT></ITEM><ITEM><NUMTRA>8003562416</NUMTRA><NUMPED>5750037</NUMPED><NUMENT>85764863</NUMENT></ITEM><ITEM><NUMTRA>8003564130</NUMTRA><NUMPED>5753153</NUMPED><NUMENT>85767972</NUMENT></ITEM><ITEM><NUMTRA>8003554048</NUMTRA><NUMPED>5734163</NUMPED><NUMENT>85748927</NUMENT></ITEM>" + 
        //                  "<ITEM><NUMTRA>8003564507</NUMTRA><NUMPED>5132141</NUMPED><NUMENT>85769345</NUMENT></ITEM></DOCUMENTOS>" + 
        //                  "<TRANSPORTE><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003554637</NUMTRA><PLACA>AFJ714/F1T986</PLACA><IDCON>PE16137350</IDCON><NOMCON>LORENZO CESAR</NOMCON><APECON>CAJAHUARINGA CONTRER</APECON><FECREC>2021-11-03</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003557203</NUMTRA><PLACA>AFJ714/F1T986</PLACA><IDCON>PE16137350</IDCON><NOMCON>LORENZO CESAR</NOMCON>" + 
        //                  "<APECON>CAJAHUARINGA CONTRER</APECON><FECREC>2021-11-05</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003560982</NUMTRA><PLACA>BJL719</PLACA><IDCON>PE43982451</IDCON><NOMCON>ADIEL RICHI</NOMCON><APECON>ALVARADO MEZA</APECON><FECREC>2021-11-09</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003564594</NUMTRA><PLACA>BJL719</PLACA><IDCON>PE43982451</IDCON>" + 
        //                  "<NOMCON>ADIEL RICHI</NOMCON><APECON>ALVARADO MEZA</APECON><FECREC>2021-11-13</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003565827</NUMTRA><PLACA>BJL719</PLACA><IDCON>PE43982451</IDCON><NOMCON>ADIEL RICHI</NOMCON><APECON>ALVARADO MEZA</APECON><FECREC>2021-11-15</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003551819</NUMTRA><PLACA>B9F911</PLACA>" + 
        //                  "<IDCON>PE43982451</IDCON><NOMCON>ADIEL RICHI</NOMCON><APECON>ALVARADO MEZA</APECON><FECREC>2021-10-30</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003552301</NUMTRA><PLACA>BJL719</PLACA><IDCON>PE40872434</IDCON><NOMCON>CLEVER CLODOALDO</NOMCON><APECON>SANTA CRUZ MORY</APECON><FECREC>2021-10-30</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003556087</NUMTRA>" + 
        //                  "<PLACA>AFJ714/F1T986</PLACA><IDCON>PE16137350</IDCON><NOMCON>LORENZO CESAR</NOMCON><APECON>CAJAHUARINGA CONTRER</APECON><FECREC>2021-11-04</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003558598</NUMTRA><PLACA>AFJ714/F1T986</PLACA><IDCON>PE16137350</IDCON><NOMCON>LORENZO CESAR</NOMCON><APECON>CAJAHUARINGA CONTRER</APECON><FECREC>2021-11-06</FECREC></ITEM>" + 
        //                  "<ITEM><CODCEN>3001</CODCEN><NUMTRA>8003559166</NUMTRA><PLACA>BEG908/AMM972</PLACA><IDCON>PE40872434</IDCON><NOMCON>CLEVER CLODOALDO</NOMCON><APECON>SANTA CRUZ MORY</APECON><FECREC>2021-11-08</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003552850</NUMTRA><PLACA>B9F911</PLACA><IDCON>PE43982451</IDCON><NOMCON>ADIEL RICHI</NOMCON><APECON>ALVARADO MEZA</APECON>" + 
        //                  "<FECREC>2021-11-01</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003553403</NUMTRA><PLACA>BJL719</PLACA><IDCON>PE40872434</IDCON><NOMCON>CLEVER CLODOALDO</NOMCON><APECON>SANTA CRUZ MORY</APECON><FECREC>2021-11-02</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003561665</NUMTRA><PLACA>BJL719</PLACA><IDCON>PE43982451</IDCON><NOMCON>ADIEL RICHI</NOMCON>" + 
        //                  "<APECON>ALVARADO MEZA</APECON><FECREC>2021-11-10</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003562416</NUMTRA><PLACA>BEG908/AMM972</PLACA><IDCON>PE40872434</IDCON><NOMCON>CLEVER CLODOALDO</NOMCON><APECON>SANTA CRUZ MORY</APECON><FECREC>2021-11-11</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003564130</NUMTRA><PLACA>BJL719</PLACA><IDCON>PE43982451</IDCON>" + 
        //                  "<NOMCON>ADIEL RICHI</NOMCON><APECON>ALVARADO MEZA</APECON><FECREC>2021-11-12</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003554048</NUMTRA><PLACA>BJL719</PLACA><IDCON>PE40872434</IDCON><NOMCON>CLEVER CLODOALDO</NOMCON><APECON>SANTA CRUZ MORY</APECON><FECREC>2021-11-03</FECREC></ITEM><ITEM><CODCEN>3001</CODCEN><NUMTRA>8003564507</NUMTRA>" + 
        //                  "<PLACA>AFJ714/F1T986</PLACA><IDCON>PE16137350</IDCON><NOMCON>LORENZO CESAR</NOMCON><APECON>CAJAHUARINGA CONTRER</APECON><FECREC>2021-11-13</FECREC></ITEM></TRANSPORTE></ns1:MT_ExtTransporteRes></SOAP:Body></SOAP:Envelope>";

        // codCentro = req.data.codCentro;
        // var codCliente = req.data.codCliente;
        // var codDestinatario = req.data.codDestinatario;
        // var estado = req.data.estado;
        // var fechaInicio = req.data.fechaInicio;
        // var fechaFin = req.data.fechaFin;

        return req.reply({
            codCentro: codCentro, codCliente: codCliente, fechaFin: fechaFin,
            fechaInicio: fechaInicio, codDestinatario, estado, myResponse
        })

    }

    //ZWS028 - Actualiza Estado Cliente
    async function _actualizarEstadoTransporte(req) {
        var ID = req.data.ID;
        var detActEstadoTransp = {};
        if (req.data.detActEstadoTransp != null) {
            detActEstadoTransp = req.data.detActEstadoTransp;
        }

        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Act_Est_Transporte_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:actualiza_estado_transporte';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:actualiza_estado_transporte">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Estado_Transporte_Request>' +
            '<IT_ESTADO>' +
            '<!--Zero or more repetitions:-->'
        for (var i = 0; i < detActEstadoTransp.length; i++) {
            myBody = myBody + '<item>' +
                '<CODCLI>' + detActEstadoTransp[i].codCliente + '</CODCLI>' +
                '<!--Optional:-->' +
                '<CODDES>' + detActEstadoTransp[i].codDestinatario + '</CODDES>' +
                '<TRANSPORTE>' + detActEstadoTransp[i].transporte + '</TRANSPORTE>' +
                '<ESTADO>' + detActEstadoTransp[i].estado + '</ESTADO>' +
                '<FECHA>' + detActEstadoTransp[i].fecha + '</FECHA>' +
                '<HORA>' + detActEstadoTransp[i].hora + '</HORA>' +
                '</item>'
        }
        myBody = myBody + '</IT_ESTADO>' +
            '</urn:MT_Estado_Transporte_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        return req.reply({ ID: ID, detActEstadoTransp: detActEstadoTransp, myResponse })
    }

    //ZWS029 - Extrae Destinatarios
    async function _obtenerListaDestinatarios(req) {
        var codCliente = req.data.codCliente;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Dest_Cliente_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:destinatarios_cliente';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Dest_Cliente_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:destinatarios_cliente';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:destinatarios_cliente">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Dest_Cliente_Request>' +
            '<CODCLIENTE>' + codCliente + '</CODCLIENTE>' +
            '</urn:MT_Dest_Cliente_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        return req.reply({ codCliente: codCliente, myResponse })
    }

    //ZWS030 - Extrae Clientes
    async function _obtenerClientes(req) {

        var codCliente = req.data.codCliente;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Relacion_Clientes_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:relacion_clientes';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Relacion_Clientes_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:relacion_clientes';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:relacion_clientes">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Relacion_Cliente_Request>' +
            '<CODCLIENTE>' + codCliente + '</CODCLIENTE>' +
            '</urn:MT_Relacion_Cliente_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        return req.reply({ codCliente: codCliente, myResponse })
    }



    //ZWS031 - Obtener Documento de Transporte
    async function _obtenerDocTransporte(req) {

        var shNumber = req.data.shNumber;
        // const url = 'http://200.48.96.184:8100/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SOS_DocTrans&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:doc_transporte';
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SOS_DocTrans&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:doc_transporte';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:doc_transporte">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_DocTransReq>' +
            '<SHNUMBER>' + shNumber + '</SHNUMBER>' +
            '</urn:MT_DocTransReq>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        return req.reply({ shNumber: shNumber, myResponse })
    }

//Begin I@OH-15/11/2021-Ticket-2021-007
    //ZWS031 - Obtener Documento de Transporte
    async function _anularPedido(req) {

        var numPedido = req.data.numPedido;
        
        const url = erp_ip + '/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_WS&receiverParty=&receiverService=&interface=SI_Portal_Rechazar_Pedido_Out&interfaceNamespace=urn:petroperu.com.pe:pmerp:portal_cliente:rechazar_pedido';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:petroperu.com.pe:pmerp:portal_cliente:rechazar_pedido">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<urn:MT_Recharzar_Pedido_Request>' +
            '<I_PEDIDO>' + numPedido + '</I_PEDIDO>' +
            '</urn:MT_Recharzar_Pedido_Request>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
        console.log(myBody);    
        myHeaders.append('Content-Type', 'application/xml');
        myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        
        return req.reply({ numPedido: numPedido, myResponse })
    }
//End I@OH-15/11/2021-Ticket-2021-007

    async function _enviocorreo(req) {
        var emailemisor = req.data.emailemisor;
        var asunto = req.data.asunto;
        var emailreceptor = req.data.emailreceptor;
        var bcc = req.data.bcc;
        var texto = req.data.texto;
        var messagehtml = req.data.messagehtml;
        var adjunto_path = req.data.adjunto_path;

        // var adjunto_path = {};

        if (req.data.adjunto_path != null) {
            adjunto_path = req.data.adjunto_path;
        } else {
            adjunto_path = {};
        }

        const output = messagehtml;

        let transporter = nodemailer.createTransport({
            // host: 'in-v3.mailjet.com',
            // host: 'smtp.petroperu.com.pe',
            host: smtp_host,
            // port: 587,
            // port: 25,
            port: smtp_port,
            secure: false, // true for 465, false for other ports
            // auth: {
            //     user: '598bba66fa978c3dad729b73e42f8b02', // generated ethereal user
            //     pass: '30974bdb531d0435cfbe0e7541a5107a'  // generated ethereal password
            //     // user: '', // generated ethereal user
            //     // pass: ''  // generated ethereal password
            // },
            tls: {
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            from: emailemisor, // sender address
            to: emailreceptor, // list of receivers
            bcc: bcc,
            subject: asunto, // Subject line
            text: texto, // plain text body
            html: output, // html body1
            attachments: adjunto_path
            // attachments: [
            //     {   // use URL as an attachment
            //         filename: 'license.txt',
            //         path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
            //     }
            //     //,
            //     /*{   // utf-8 string as an attachment
            //         filename: 'text1.txt',
            //         content: 'hello world!'
            //     },
            //     {   // binary buffer as an attachment
            //         filename: 'text2.txt',
            //         content: new Buffer('hello world!','utf-8')
            //     },
            //     {   // file on disk as an attachment
            //         filename: 'text3.txt',
            //         path: '/path/to/file.txt' // stream this file
            //     },
            //     {   // filename and content type is derived from path
            //         path: '/path/to/file.txt'
            //     },
            //     {   // stream as an attachment
            //         filename: 'text4.txt',
            //         content: fs.createReadStream('file.txt')
            //     },
            //     {   // define custom content type for the attachment
            //         filename: 'text.bin',
            //         content: 'hello world!',
            //         contentType: 'text/plain'
            //     },
            //     {   // use URL as an attachment
            //         filename: 'license.txt',
            //         path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
            //     },
            //     {   // encoded string as an attachment
            //         filename: 'text1.txt',
            //         content: 'aGVsbG8gd29ybGQh',
            //         encoding: 'base64'
            //     },
            //     {   // data uri as an attachment
            //         path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
            //     },
            //     {
            //         // use pregenerated MIME node
            //         raw: 'Content-Type: text/plain\r\n' +
            //             'Content-Disposition: attachment;\r\n' +
            //             '\r\n' +
            //             'Hello world!'
            //     }*/
            // ]
        };

        console.log(mailOptions);
        let info = transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
            }
        });
        console.log(info);

        return req.reply({ emailemisor: emailemisor, emailreceptor, bcc, asunto, messagehtml, texto })

    }

    // WebService SCOP - getOrdenPedidoByCodigoAutorizacion
    //http://200.48.96.185
    async function _obtListaOrdenPedidoPorSCOP(req) {
        var claveUsuario = req.data.claveUsuario;
        var loginUsuario = req.data.loginUsuario;
        var codigoAutorizacion = req.data.codigoAutorizacion;
        var codigoError = req.data.codigoError;
        var codigoMayoristaEquivalente = req.data.codigoMayoristaEquivalente;
        var codigoPlanta = req.data.codigoPlanta;
        var codigoPlantaEquivalente = req.data.codigoPlantaEquivalente;
        var codigoUsuario = req.data.codigoUsuario;
        var fechaFin = req.data.fechaFin;
        var fechaInicio = req.data.fechaInicio;
        var fechaRegistro = req.data.fechaRegistro;
        var fechaVenta = req.data.fechaVenta;
        var horaFin = req.data.horaFin;
        var horaInicio = req.data.horaInicio;
        var horaRegistro = req.data.horaRegistro;
        var idDetalleDivision1 = req.data.idDetalleDivision1;
        var idDetalleDivision2 = req.data.idDetalleDivision2;
        var placaTransporte = req.data.placaTransporte;
        var resultado = req.data.resultado;
        var ruc = req.data.ruc;
        var tipoUsuario = req.data.tipoUsuario;


        // var dest = DestinationAccesor.getDestination("SCOPWSDESA-OSINERGMIN_80-IP");
        // console.log(dest);
        // const url = 'https://webdmz1dev.petroperu.com.pe:443/scopws/diensten/MayoristasService';
        // const url = 'http://200.48.96.185/scopws/diensten/MayoristasService';
        const url = osinergmin_ip + '/scopws/diensten/MayoristasService';
        // console.log(url);
        let myHeaders = new fetch.Headers();
        let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +
            '<soap:Header/>' +
            '<soap:Body>' +
            '<ser:getOrdenPedidoByCodigoAutorizacion>' +
            '<parametro>' +

            '<!--Optional:-->' +
            '<claveUsuario>' + claveUsuario + '</claveUsuario>' +
            '<!--Optional:-->' +
            '<codigoAutorizacion>' + codigoAutorizacion + '</codigoAutorizacion>' +
            '<!--Optional:-->' +
            '<codigoError>' + codigoError + '</codigoError>' +
            '<!--Optional:-->' +
            '<codigoMayoristaEquivalente>' + codigoMayoristaEquivalente + '</codigoMayoristaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoPlanta>' + codigoPlanta + '</codigoPlanta>' +
            '<!--Optional:-->' +
            '<codigoPlantaEquivalente>' + codigoPlantaEquivalente + '</codigoPlantaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoUsuario>' + codigoUsuario + '</codigoUsuario>' +
            '<!--Optional:-->' +
            '<fechaFin>' + fechaFin + '</fechaFin>' +
            '<!--Optional:-->' +
            '<fechaInicio>' + fechaInicio + '</fechaInicio>' +
            '<!--Optional:-->' +
            '<fechaRegistro>' + fechaRegistro + '</fechaRegistro>' +
            '<!--Optional:-->' +
            '<fechaVenta>' + fechaVenta + '</fechaVenta>' +
            '<!--Optional:-->' +
            '<horaFin>' + horaFin + '</horaFin>' +
            '<!--Optional:-->' +
            '<horaInicio>' + horaInicio + '</horaInicio>' +
            '<!--Optional:-->' +
            '<horaRegistro>' + horaRegistro + '</horaRegistro>' +
            '<!--Optional:-->' +
            '<idDetalleDivision1>' + idDetalleDivision1 + '</idDetalleDivision1>' +
            '<!--Optional:-->' +
            '<idDetalleDivision2>' + idDetalleDivision2 + '</idDetalleDivision2>' +
            '<!--Optional:-->' +
            '<loginUsuario>' + loginUsuario + '</loginUsuario>' +
            '<!--Optional:-->' +
            '<placaTransporte>' + placaTransporte + '</placaTransporte>' +
            '<!--Optional:-->' +
            '<resultado>' + resultado + '</resultado>' +
            '<!--Optional:-->' +
            '<ruc>' + ruc + '</ruc>' +
            '<!--Optional:-->' +
            '<tipoUsuario>' + tipoUsuario + '</tipoUsuario>' +
            '</parametro>' +
            '</ser:getOrdenPedidoByCodigoAutorizacion>' +
            '</soap:Body>' +
            '</soap:Envelope>'
        myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
        console.log(myBody);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            claveUsuario: claveUsuario, loginUsuario: loginUsuario, codigoAutorizacion, codigoError,
            codigoMayoristaEquivalente, codigoPlanta, codigoPlantaEquivalente, codigoUsuario, fechaFin,
            fechaInicio, fechaRegistro, fechaVenta, horaFin, horaInicio, horaRegistro, idDetalleDivision1,
            idDetalleDivision2, placaTransporte, resultado, ruc, tipoUsuario, myResponse
        })
    }

    // WebService SCOP - getOrdenPedido
    async function _obtListaOrdenPedido(req) {
        var claveUsuario = req.data.claveUsuario;
        var loginUsuario = req.data.loginUsuario;
        var codigoAutorizacion = req.data.codigoAutorizacion;
        var codigoError = req.data.codigoError;
        var codigoMayoristaEquivalente = req.data.codigoMayoristaEquivalente;
        var codigoPlanta = req.data.codigoPlanta;
        var codigoPlantaEquivalente = req.data.codigoPlantaEquivalente;
        var codigoUsuario = req.data.codigoUsuario;
        var fechaFin = req.data.fechaFin;
        var fechaInicio = req.data.fechaInicio;
        var fechaRegistro = req.data.fechaRegistro;
        var fechaVenta = req.data.fechaVenta;
        var horaFin = req.data.horaFin;
        var horaInicio = req.data.horaInicio;
        var horaRegistro = req.data.horaRegistro;
        var idDetalleDivision1 = req.data.idDetalleDivision1;
        var idDetalleDivision2 = req.data.idDetalleDivision2;
        var placaTransporte = req.data.placaTransporte;
        var resultado = req.data.resultado;
        var ruc = req.data.ruc;
        var tipoUsuario = req.data.tipoUsuario;


        // const url = 'http://200.48.96.185/scopws/diensten/MayoristasService';
        const url = osinergmin_ip + '/scopws/diensten/MayoristasService';
        let myHeaders = new fetch.Headers();
        let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<ser:getOrdenPedidoByCodigoAutorizacion>' +
            '<parametro>' +

            '<!--Optional:-->' +
            '<claveUsuario>' + claveUsuario + '</claveUsuario>' +
            '<!--Optional:-->' +
            '<codigoAutorizacion>' + codigoAutorizacion + '</codigoAutorizacion>' +
            '<!--Optional:-->' +
            '<codigoError>' + codigoError + '</codigoError>' +
            '<!--Optional:-->' +
            '<codigoMayoristaEquivalente>' + codigoMayoristaEquivalente + '</codigoMayoristaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoPlanta>' + codigoPlanta + '</codigoPlanta>' +
            '<!--Optional:-->' +
            '<codigoPlantaEquivalente>' + codigoPlantaEquivalente + '</codigoPlantaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoUsuario>' + codigoUsuario + '</codigoUsuario>' +
            '<!--Optional:-->' +
            '<fechaFin>' + fechaFin + '</fechaFin>' +
            '<!--Optional:-->' +
            '<fechaInicio>' + fechaInicio + '</fechaInicio>' +
            '<!--Optional:-->' +
            '<fechaRegistro>' + fechaRegistro + '</fechaRegistro>' +
            '<!--Optional:-->' +
            '<fechaVenta>' + fechaVenta + '</fechaVenta>' +
            '<!--Optional:-->' +
            '<horaFin>' + horaFin + '</horaFin>' +
            '<!--Optional:-->' +
            '<horaInicio>' + horaInicio + '</horaInicio>' +
            '<!--Optional:-->' +
            '<horaRegistro>' + horaRegistro + '</horaRegistro>' +
            '<!--Optional:-->' +
            '<idDetalleDivision1>' + idDetalleDivision1 + '</idDetalleDivision1>' +
            '<!--Optional:-->' +
            '<idDetalleDivision2>' + idDetalleDivision2 + '</idDetalleDivision2>' +
            '<!--Optional:-->' +
            '<loginUsuario>' + loginUsuario + '</loginUsuario>' +
            '<!--Optional:-->' +
            '<placaTransporte>' + placaTransporte + '</placaTransporte>' +
            '<!--Optional:-->' +
            '<resultado>' + resultado + '</resultado>' +
            '<!--Optional:-->' +
            '<ruc>' + ruc + '</ruc>' +
            '<!--Optional:-->' +
            '<tipoUsuario>' + tipoUsuario + '</tipoUsuario>' +
            '</parametro>' +
            '</ser:getOrdenPedidoByCodigoAutorizacion>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
        myHeaders.append('Content-Type', 'application/xml');
        // myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));

        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            claveUsuario: claveUsuario, loginUsuario: loginUsuario, codigoAutorizacion, codigoError,
            codigoMayoristaEquivalente, codigoPlanta, codigoPlantaEquivalente, codigoUsuario, fechaFin,
            fechaInicio, fechaRegistro, fechaVenta, horaFin, horaInicio, horaRegistro, idDetalleDivision1,
            idDetalleDivision2, placaTransporte, resultado, ruc, tipoUsuario, myResponse
        })
    }


    // WebService SCOP - Crear Pedido
    async function _crearOrdenSCOP(req) {
        var loginUsuario = req.data.loginUsuario;
        var claveUsuario = req.data.claveUsuario;
        var TipoTransaccion = req.data.TipoTransaccion;
        var CodigoMayoristaEquivalente = req.data.CodigoMayoristaEquivalente;
        var CodigoPlantaEquivalente = req.data.CodigoPlantaEquivalente;
        var PlacaTransporte = req.data.PlacaTransporte;
        var Cola = req.data.Cola;

        var detSCOP = {};

        if (req.data.detSCOP != null) {
            detSCOP = req.data.detSCOP;
        }


        // const url = 'http://200.48.96.185:8011/scopws/services/OrdenPedidoService';
        const url = osinergmin_ip + '/scopws/services/OrdenPedidoService';
        let myHeaders = new fetch.Headers();
        let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +
            '<soap:Header/>' +
            '<soap:Body>' +
            '<ser:generateSimpleOrder>' +
            '<!--Optional:-->' +
            '<ordenPedido>' +
            '<!--Optional:-->' +
            '<claveUsuario>' + claveUsuario + '</claveUsuario>' +
            '<!--Optional:-->' +
            '<codigoMayoristaEquivalente>' + CodigoMayoristaEquivalente + '</codigoMayoristaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoPlantaEquivalente>' + CodigoPlantaEquivalente + '</codigoPlantaEquivalente>' +
            '<!--Optional:-->' +
            '<cola>' + Cola + '</cola>' +
            '<!--Zero or more repetitions:-->'

        for (var i = 0; i < detSCOP.length; i++) {
            myBody += '<detalles>' +
                '<cantidad1></cantidad1>' +
                '<cantidad2></cantidad2>' +
                '<cantidadDespachada></cantidadDespachada>' +
                '<cantidadSolicitada>' + detSCOP[i].cantidadSolicitada + '</cantidadSolicitada>' +
                '<cantidadVendida></cantidadVendida>' +
                '<!--Optional:-->' +
                '<codigoProducto>' + detSCOP[i].codigoProducto + '</codigoProducto>' +
                '<densidadObservada></densidadObservada>' +
                '<factorAPI></factorAPI>' +
                '<factorApor></factorApor>' +
                '<factorComp></factorComp>' +
                '<!--Optional:-->' +
                '<placaTransporte>' + PlacaTransporte + '</placaTransporte>' +
                '<precio></precio>' +
                '<precioGalon></precioGalon>' +
                '<temperatura></temperatura>' +
                '</detalles>'
        }
        myBody += '<!--Optional:-->' +
            '<loginUsuario>' + loginUsuario + '</loginUsuario>' +
            '<!--Optional:-->' +
            '<tipoTransaccion>' + TipoTransaccion + '</tipoTransaccion>' +
            '<volumenVenta></volumenVenta>' +
            '</ordenPedido>' +
            '</ser:generateSimpleOrder>' +
            '</soap:Body>' +
            '</soap:Envelope>'

        myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
        // myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        // console.log(myBody);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            loginUsuario: loginUsuario, claveUsuario: claveUsuario, TipoTransaccion: TipoTransaccion,
            CodigoMayoristaEquivalente: CodigoMayoristaEquivalente, CodigoPlantaEquivalente: CodigoPlantaEquivalente,
            PlacaTransporte, Cola, detSCOP, myResponse
        })
    }

    // WebService SCOP - Crea SCOP GLP
    async function _crearOrdenSCOPGLP(req) {
        var loginUsuario = req.data.loginUsuario;
        var claveUsuario = req.data.claveUsuario;
        var codigoOsinergComprador = req.data.codigoOsinergComprador;
        var codigoOsinergVendedor = req.data.codigoOsinergVendedor;
        var codigoOsinergPlantaAbastecimiento = req.data.codigoOsinergPlantaAbastecimiento;

        var detSCOPGLP = {};

        if (req.data.detSCOPGLP != null) {
            detSCOPGLP = req.data.detSCOPGLP;
        }


        // const url = 'http://200.48.96.185:8011/scopws/services/OrdenPedidoService';
        const url = osinergmin_ip + '/scopglpws/services/PlantaEnvasadoraGLP';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.webservicesglp.scopglp.osinerg.com">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
                '<ser:registraOrdenSimple soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
                    '<ordenPedido xsi:type="bean:OrdenPedido" xmlns:bean="http://beans.webservicesglp.scopglp.osinerg.com">' +
                        '<claveUsuario xsi:type="xsd:string">' + claveUsuario + '</claveUsuario>' +
                        '<codigoAutorizacion xsi:type="xsd:string"></codigoAutorizacion>' +
                        '<codigoAutorizacionCompra xsi:type="xsd:string"></codigoAutorizacionCompra>' +
                        '<codigoComprador xsi:type="xsd:string"></codigoComprador>' +
                        '<codigoDGH xsi:type="xsd:string"></codigoDGH>' +
                        '<codigoEstado xsi:type="xsd:string"></codigoEstado>' +
                        '<codigoOsinergComprador xsi:type="xsd:string">' + codigoOsinergComprador + '</codigoOsinergComprador>' +
                        '<codigoOsinergPlantaAbastecimiento xsi:type="xsd:string"></codigoOsinergPlantaAbastecimiento>' +
                        '<codigoOsinergVendedor xsi:type="xsd:string">' + codigoOsinergVendedor + '</codigoOsinergVendedor>' +
                        '<codigoPlantaAbastecimiento xsi:type="xsd:string">' + codigoOsinergPlantaAbastecimiento + '</codigoPlantaAbastecimiento>' +
                        '<codigoVendedor xsi:type="xsd:string"></codigoVendedor>' +
                        '<!--1 or more repetitions:-->'
                        for (var i = 0; i < detSCOPGLP.length; i++) {
                        myBody += 
                        '<detalles xsi:type="bean:DetalleOrden">' +
                        '<cantidad xsi:type="xsd:double"></cantidad>' +
                        '<cantidadKilogramos xsi:type="xsd:double"></cantidadKilogramos>' +
                        '<cantidadPedidaDistribuida xsi:type="xsd:double"></cantidadPedidaDistribuida>' +
                        '<cantidadPedidaPredio xsi:type="xsd:double">' + detSCOPGLP[i].cantidadSolicitada + '</cantidadPedidaPredio>' +
                        '<cantidadRecibidaDistribuida xsi:type="xsd:double"></cantidadRecibidaDistribuida>' +
                        '<cantidadRecibidaPredio xsi:type="xsd:double"></cantidadRecibidaPredio>' +
                        '<codigoEstado xsi:type="xsd:string"></codigoEstado>' +
                        '<codigoMotivoRechazo xsi:type="xsd:string"></codigoMotivoRechazo>' +
                        '<codigoProducto xsi:type="xsd:string">' + detSCOPGLP[i].codigoProducto + '</codigoProducto>' +
                        '<numeroOrden xsi:type="xsd:string"></numeroOrden>' +
                        '<placaTransporte xsi:type="xsd:string"></placaTransporte>' +
                        '<tipoTransporte xsi:type="xsd:string"></tipoTransporte>' +
                        '<unidadMedida xsi:type="xsd:string">' + detSCOPGLP[i].unidadMedida + '</unidadMedida>' +
                        '<valorDensidad xsi:type="xsd:double"></valorDensidad>' +
                        '<valorTemperatura xsi:type="xsd:string"></valorTemperatura>' +
                        '<densidad xsi:type="xsd:double"></densidad>' +
                        '<densidadPedida xsi:type="xsd:double"></densidadPedida>' +
                        '<densidadVendida xsi:type="xsd:double"></densidadVendida>' +
                        '<id xsi:type="xsd:string"></id>' +
                        '<factorComp xsi:type="xsd:double"></factorComp>' +
                        '<factorApor xsi:type="xsd:double"></factorApor>' +
                        '</detalles>'
                        }
                        myBody += 
                        '<fechaModificacion xsi:type="xsd:string"></fechaModificacion>' +
                        '<fechaRegistro xsi:type="xsd:string"></fechaRegistro>' +
                        '<horaModificacion xsi:type="xsd:string"></horaModificacion>' +
                        '<horaRegistro xsi:type="xsd:string"></horaRegistro>' +
                        '<loginUsuario xsi:type="xsd:string">' + loginUsuario + '</loginUsuario>' +
                        '<numeroFactura xsi:type="xsd:string"></numeroFactura>' +
                        '<numeroGuia xsi:type="xsd:string"></numeroGuia>' +
                        '<numeroOrden xsi:type="xsd:string"></numeroOrden>' +
                        '<placaTransporte xsi:type="xsd:string"></placaTransporte>' +
                        '<id xsi:type="xsd:string"></id>' +
                        '<tipoVentaFactor xsi:type="xsd:string"></tipoVentaFactor>' +
                        '<fechaFactura xsi:type="xsd:string"></fechaFactura>' +
                    '</ordenPedido>' +
                '</ser:registraOrdenSimple>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'

        myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
        // myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        console.log(myBody);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            loginUsuario: loginUsuario, claveUsuario: claveUsuario,
            codigoOsinergComprador: codigoOsinergComprador, codigoOsinergVendedor: codigoOsinergVendedor, 
            codigoOsinergPlantaAbastecimiento: codigoOsinergPlantaAbastecimiento,
            detSCOPGLP, myResponse
        })
    }

// WebService SCOP - Cierre SCOP GLP
    async function _cierreOrdenSCOPGLP(req) {
        var loginUsuario = req.data.loginUsuario;
        var claveUsuario = req.data.claveUsuario;
        var codSCOP = req.data.codSCOP;
        var codOsinergComprador = req.data.codOsinergComprador;
        var codOsinergVendedor = req.data.codOsinergVendedor;

        var detCierreSCOPGLP = {};

        if (req.data.detCierreSCOPGLP != null) {
            detCierreSCOPGLP = req.data.detCierreSCOPGLP;
        }


        // const url = 'http://200.48.96.185:8011/scopws/services/OrdenPedidoService';
        const url = osinergmin_ip + '/scopglpws/services/PlantaEnvasadoraGLP';
        let myHeaders = new fetch.Headers();
        let myBody = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.webservicesglp.scopglp.osinerg.com">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
                '<ser:registraCierreOrden soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
                    '<ordenPedido xsi:type="bean:OrdenPedido" xmlns:bean="http://beans.webservicesglp.scopglp.osinerg.com">' +
                        '<claveUsuario xsi:type="xsd:string">' + claveUsuario + '</claveUsuario>' +
                        '<codigoAutorizacion xsi:type="xsd:string">' + codSCOP + '</codigoAutorizacion>' +
                        '<codigoAutorizacionCompra xsi:type="xsd:string"></codigoAutorizacionCompra>' +
                        '<codigoComprador xsi:type="xsd:string"></codigoComprador>' +
                        '<codigoDGH xsi:type="xsd:string"></codigoDGH>' +
                        '<codigoEstado xsi:type="xsd:string"></codigoEstado>' +
                        '<codigoOsinergComprador xsi:type="xsd:string">' + codOsinergComprador + '</codigoOsinergComprador>' +
                        '<codigoOsinergPlantaAbastecimiento xsi:type="xsd:string"></codigoOsinergPlantaAbastecimiento>' +
                        '<codigoOsinergVendedor xsi:type="xsd:string">' + codOsinergVendedor + '</codigoOsinergVendedor>' +
                        '<codigoPlantaAbastecimiento xsi:type="xsd:string"></codigoPlantaAbastecimiento>' +
                        '<codigoVendedor xsi:type="xsd:string"></codigoVendedor>' +
                        '<!--1 or more repetitions:-->'
                        for (var i = 0; i < detCierreSCOPGLP.length; i++) {
                        myBody += 
                        '<detalles xsi:type="bean:DetalleOrden">' +
                        '<cantidad xsi:type="xsd:double"></cantidad>' +
                        '<cantidadKilogramos xsi:type="xsd:double"></cantidadKilogramos>' +
                        '<cantidadPedidaDistribuida xsi:type="xsd:double"></cantidadPedidaDistribuida>' +
                        '<cantidadPedidaPredio xsi:type="xsd:double">' + detCierreSCOPGLP[i].cantRecibida + '</cantidadPedidaPredio>' +
                        '<cantidadRecibidaDistribuida xsi:type="xsd:double"></cantidadRecibidaDistribuida>' +
                        '<cantidadRecibidaPredio xsi:type="xsd:double"></cantidadRecibidaPredio>' +
                        '<codigoEstado xsi:type="xsd:string">' + detCierreSCOPGLP[i].codigoEstado + '</codigoEstado>' +
                        '<codigoMotivoRechazo xsi:type="xsd:string"></codigoMotivoRechazo>' +
                        '<codigoProducto xsi:type="xsd:string">' + detCierreSCOPGLP[i].codigoProducto + '</codigoProducto>' +
                        '<numeroOrden xsi:type="xsd:string"></numeroOrden>' +
                        '<placaTransporte xsi:type="xsd:string"></placaTransporte>' +
                        '<tipoTransporte xsi:type="xsd:string"></tipoTransporte>' +
                        '<unidadMedida xsi:type="xsd:string">' + detCierreSCOPGLP[i].unidadMedida + '</unidadMedida>' +
                        '<valorDensidad xsi:type="xsd:double"></valorDensidad>' +
                        '<valorTemperatura xsi:type="xsd:string"></valorTemperatura>' +
                        '<densidad xsi:type="xsd:double"></densidad>' +
                        '<densidadPedida xsi:type="xsd:double"></densidadPedida>' +
                        '<densidadVendida xsi:type="xsd:double"></densidadVendida>' +
                        '<id xsi:type="xsd:string"></id>' +
                        '<factorComp xsi:type="xsd:double"></factorComp>' +
                        '<factorApor xsi:type="xsd:double"></factorApor>' +
                        '</detalles>'
                        }
                        myBody += 
                        '<fechaModificacion xsi:type="xsd:string"></fechaModificacion>' +
                        '<fechaRegistro xsi:type="xsd:string"></fechaRegistro>' +
                        '<horaModificacion xsi:type="xsd:string"></horaModificacion>' +
                        '<horaRegistro xsi:type="xsd:string"></horaRegistro>' +
                        '<loginUsuario xsi:type="xsd:string">' + loginUsuario + '</loginUsuario>' +
                        '<numeroFactura xsi:type="xsd:string"></numeroFactura>' +
                        '<numeroGuia xsi:type="xsd:string"></numeroGuia>' +
                        '<numeroOrden xsi:type="xsd:string"></numeroOrden>' +
                        '<placaTransporte xsi:type="xsd:string"></placaTransporte>' +
                        '<id xsi:type="xsd:string"></id>' +
                        '<tipoVentaFactor xsi:type="xsd:string"></tipoVentaFactor>' +
                        '<fechaFactura xsi:type="xsd:string"></fechaFactura>' +
                    '</ordenPedido>' +
                '</ser:registraCierreOrden>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'

        myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
        // myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        console.log(myBody);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            loginUsuario: loginUsuario, claveUsuario: claveUsuario, codSCOP: codSCOP,
            codOsinergComprador: codOsinergComprador, codOsinergVendedor: codOsinergVendedor,
            detCierreSCOPGLP, myResponse
        })
    }

// WebService SCOP - Anula Pedido
    async function _anulaSCOP(req) {
        var loginUsuario = req.data.loginUsuario;
        var claveUsuario = req.data.claveUsuario;
        var codSCOP = req.data.codSCOP;
        
        var detAnulSCOP = {};

        if (req.data.detAnulSCOP != null) {
            detAnulSCOP = req.data.detAnulSCOP;
        }


        // const url = 'http://200.48.96.185:8011/scopws/services/OrdenPedidoService';
        const url = osinergmin_ip + '/scopws/services/AtencionesService';
        let myHeaders = new fetch.Headers();
        let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +
            '<soap:Header/>' +
            '<soap:Body>' +
            '<ser:anulacionOrdenPedidoSCOP>' +
            '<!--Optional:-->' + 
            '<ordenPedido>' +
            '<!--Optional:-->' +
            '<API></API>' +
            '<!--Optional:-->' +
            '<actividad></actividad>' +
            '<!--Optional:-->' +
            '<afectoIGV></afectoIGV>' +
            '<!--Optional:-->' +
            '<afectoISC></afectoISC>' +
            '<!--Optional:-->' +
            '<claveUsuario>' + claveUsuario + '</claveUsuario>' +
            '<!--Optional:-->' +
            '<codigoAerolinea></codigoAerolinea>' +
            '<!--Optional:-->' +
            '<codigoAutorizacion>' + codSCOP + '</codigoAutorizacion>' + 
            '<!--Optional:-->' +
            '<codigoDGHCliente></codigoDGHCliente>' +
            '<!--Optional:-->' +
            '<codigoEquivalenteMayorista1></codigoEquivalenteMayorista1>' +
            '<!--Optional:-->' +
            '<codigoEquivalenteMayorista2></codigoEquivalenteMayorista2>' +
            '<!--Optional:-->' +
            '<codigoEquivalentePlanta1></codigoEquivalentePlanta1>' +
            '<!--Optional:-->' +
            '<codigoEquivalentePlanta2></codigoEquivalentePlanta2>' +
            '<!--Optional:-->' +
            '<codigoEquivalenteProductor></codigoEquivalenteProductor>' +
            '<!--Optional:-->' +
            '<codigoEstado></codigoEstado>' +
            '<!--Optional:-->' +
            '<codigoMayorista></codigoMayorista>' +
            '<!--Optional:-->' +
            '<codigoMayoristaDestino></codigoMayoristaDestino>' +
            '<!--Optional:-->' +
            '<codigoMayoristaDestinoEquivalente></codigoMayoristaDestinoEquivalente>' +
            '<!--Optional:-->' +
            '<codigoMayoristaEquivalente></codigoMayoristaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoMayoristaOrigen></codigoMayoristaOrigen>' +
            '<!--Optional:-->' +
            '<codigoMayoristaOrigenEquivalente></codigoMayoristaOrigenEquivalente>' +
            '<!--Optional:-->' +
            '<codigoOrigen></codigoOrigen>' +
            '<!--Optional:-->' +
            '<codigoOsinergCliente></codigoOsinergCliente>' +
            '<!--Optional:-->' +
            '<codigoOsinergComprador></codigoOsinergComprador>' +
            '<!--Optional:-->' +
            '<codigoPlanta></codigoPlanta>' +
            '<!--Optional:-->' +
            '<codigoPlantaDestino></codigoPlantaDestino>' +
            '<!--Optional:-->' +
            '<codigoPlantaDestinoEquivalente></codigoPlantaDestinoEquivalente>' +
            '<!--Optional:-->' +
            '<codigoPlantaEquivalente></codigoPlantaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoPlantaOrigen></codigoPlantaOrigen>' +
            '<!--Optional:-->' +
            '<codigoPlantaOrigenEquivalente></codigoPlantaOrigenEquivalente>' +
            '<!--Optional:-->' +
            '<codigoProducto></codigoProducto>' +
            '<!--Optional:-->' +
            '<codigoProveedor></codigoProveedor>' +
            '<!--Optional:-->' +
            '<codigoTransporte></codigoTransporte>' +
            '<!--Optional:-->' +
            '<codigoUnidadOperativa></codigoUnidadOperativa>' +
            '<!--Optional:-->' +
            '<codigoUsuario></codigoUsuario>' +
            '<!--Optional:-->' +
            '<cola></cola>' +
            '<!--Optional:-->' +
            '<descripcionEstado></descripcionEstado>' +


            
            '<!--Zero or more repetitions:-->'
        for (var i = 0; i < detAnulSCOP.length; i++) {
            myBody += '<detalles>' +
                '<cantidad1></cantidad1>' +
                '<cantidad2></cantidad2>' +
                '<cantidadDespachada></cantidadDespachada>' +
                '<cantidadSolicitada></cantidadSolicitada>' +
                '<cantidadVendida></cantidadVendida>' +
                '<!--Optional:-->' + 
                '<codigoEstado>' + detAnulSCOP[i].codigoEstado + '</codigoEstado>' +
                '<!--Optional:-->' +
                '<codigoMarca></codigoMarca>' +
                '<!--Optional:-->' +
                '<codigoMotivoRechazo></codigoMotivoRechazo>' +
                '<!--Optional:-->' +
                '<codigoProducto>' + detAnulSCOP[i].codigoProducto + '</codigoProducto>' +
                '<!--Optional:-->' +
                '<codigoUnidad></codigoUnidad>' +
                '<densidadObservada></densidadObservada>' +
                '<!--Optional:-->' +
                '<descripcionEstado></descripcionEstado>' +
                '<!--Optional:-->' +
                '<detallePedido></detallePedido>' +
                '<factorAPI></factorAPI>' +
                '<factorApor></factorApor>' +
                '<factorComp></factorComp>' +
                '<!--Optional:-->' +
                '<fechaDespacho></fechaDespacho>' +
                '<!--Optional:-->' +
                '<fechaVenta></fechaVenta>' +
                '<!--Optional:-->' +
                '<idProducto></idProducto>' +
                '<!--Optional:-->' +
                '<placaTransporte></placaTransporte>' +
                '<precio></precio>' +
                '<precioGalon></precioGalon>' +
                '<temperatura></temperatura>' +
                '<!--Optional:-->' +
                '<tipoUsuario></tipoUsuario>' +
                '<!--Optional:-->' +
                '<zonaPrecios></zonaPrecios>' +
                '</detalles>'
        }
        myBody += '<!--Optional:-->' +
            '<!--Optional:-->' +
            '<direccionDestino></direccionDestino>' +
            '<!--Optional:-->' +
            '<direccionDestinoVenta></direccionDestinoVenta>' +
            '<!--Optional:-->' +
            '<dua1></dua1>' +
            '<!--Optional:-->' +
            '<dua2></dua2>' +
            '<!--Optional:-->' +
            '<dua3></dua3>' +
            '<!--Optional:-->' +
            '<fechaCompra></fechaCompra>' +
            '<!--Optional:-->' +
            '<fechaEntrega></fechaEntrega>' +
            '<!--Optional:-->' +
            '<fechaFactura></fechaFactura>' +
            '<!--Optional:-->' +
            '<fechaModificacion></fechaModificacion>' +
            '<!--Optional:-->' +
            '<fechaRegistro></fechaRegistro>' +
            '<!--Optional:-->' +
            '<fechaVenta></fechaVenta>' +
            '<!--Optional:-->' +
            '<flagFactura></flagFactura>' +
            '<!--Optional:-->' +
            '<formaVenta></formaVenta>' +
            '<!--Optional:-->' +
            '<horaModificacion></horaModificacion>' +
            '<!--Optional:-->' +
            '<horaRegistro></horaRegistro>' +
            '<!--Optional:-->' +
            '<horaVenta></horaVenta>' +
            '<!--Optional:-->' +
            '<idProducto></idProducto>' +
            '<!--Optional:-->' +
            '<isStock></isStock>' +
            '<!--Zero or more repetitions:-->' +
            '<listaTransporte></listaTransporte>' +
            '<!--Optional:-->' +
            '<loginUsuario>' + loginUsuario + '</loginUsuario>' +

            '<!--Optional:-->' +
            '<medioTransporte></medioTransporte>' +
            '<!--Optional:-->' +
            '<nombreAerolinea></nombreAerolinea>' +
            '<!--Optional:-->' +
            '<numeroEntrega></numeroEntrega>' +
            '<!--Optional:-->' +
            '<numeroFactura></numeroFactura>' +
            '<!--Optional:-->' +
            '<numeroGuia></numeroGuia>' +
            '<!--Optional:-->' +
            '<ordenPedido></ordenPedido>' +
            '<!--Optional:-->' +
            '<placaTransporte></placaTransporte>' +
            '<!--Optional:-->' +
            '<rucComprador></rucComprador>' +
            '<!--Optional:-->' +
            '<rucMayorista1></rucMayorista1>' +
            '<!--Optional:-->' +
            '<rucMayorista2></rucMayorista2>' +
            '<!--Optional:-->' +
            '<serieNumeroFactura></serieNumeroFactura>' +
            '<!--Optional:-->' +
            '<serieNumeroGuia></serieNumeroGuia>' +
            '<!--Optional:-->' +
            '<temperatura></temperatura>' +
            '<!--Optional:-->' +
            '<tipoOrden></tipoOrden>' +
            '<!--Optional:-->' +
            '<tipoTransaccion></tipoTransaccion>' +
            '<!--Optional:-->' +
            '<tipoVentaFactor></tipoVentaFactor>' +
            '<!--Optional:-->' +
            '<volumenSolicitado></volumenSolicitado>' +
            '<volumenVenta></volumenVenta>' +
            '<!--Optional:-->' +
            '<vuelo></vuelo>' +


            '</ordenPedido>' + 
            '</ser:anulacionOrdenPedidoSCOP>' +
            '</soap:Body>' +
            '</soap:Envelope>'

        myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
        // myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        console.log(myBody);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({
            loginUsuario: loginUsuario, claveUsuario: claveUsuario, codSCOP: codSCOP, detAnulSCOP, myResponse
        })
    }


    // WebService SCOP - Obtener precios
    async function _obtenerPrecios(req) {
        // var loginUsuario = "3379100";//PRD-2
        // var claveUsuario = "95320553";//PRD-2
        // var loginUsuario = "3379126"; //PRD-1
        // var claveUsuario = "12345678";
        // var claveUsuario = "P1P0RT4LUS3R"; //PRD-1
        // var loginUsuario = "3379100"; // QAS
        // var claveUsuario = "P0rt4l$3s"; // QAS
        var loginUsuario = user_osinergmin;
        var claveUsuario = password_osinergmin;
        var fechaActualizacion = req.data.fechaActualizacion;
        var codigoOsinergmin = req.data.codigoOsinergmin;

        // console.log(codigoOsinergmin);
        // console.log(osinergmin_ip);

        // const url = 'http://200.48.96.185:8011/scopws/diensten/PriceService'; //QAS
        // const url = 'http://181.65.245.5:8021/scopws/diensten/PriceService';//PRD
        const url = osinergmin_ip + '/scopws/diensten/PriceService';
        let myHeaders = new fetch.Headers();
        let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +
            '<soap:Header/>' +
            '<soap:Body>' +
            '<ser:consultaHistorica>' +
            '<!--Optional:-->' +
            '<parametro>' +
            '<!--Optional:-->' +
            '<claveUsuario>' + claveUsuario + '</claveUsuario>' +
            '<!--Optional:-->' +
            '<codigoOsinergmin>' + codigoOsinergmin + '</codigoOsinergmin>' +
            '<!--Optional:-->' +
            '<fechaActualizacion>' + fechaActualizacion + '</fechaActualizacion>' +
            '<!--Optional:-->' +
            '<loginUsuario>' + loginUsuario + '</loginUsuario>' +
            '</parametro>' +
            '</ser:consultaHistorica>' +
            '</soap:Body>' +
            '</soap:Envelope>'

        myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
        // myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        console.log(myBody);
        console.log(url);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();
        //  var myResponse = '';

        return req.reply({ fechaActualizacion: fechaActualizacion, codigoOsinergmin: codigoOsinergmin, myResponse })
    }


    // WebService SCOP - Obtener precios
    async function _registrarPrecios(req) {
        var loginUsuario = req.data.loginUsuario;
        var claveUsuario = req.data.claveUsuario;
        var detPrecio = {};

        if (req.data.detPrecio != null) {
            detPrecio = req.data.detPrecio;
        }



        // const url = 'http://200.48.96.185:8011/scopws/diensten/PriceService';
        const url = osinergmin_ip + '/scopws/diensten/PriceService';
        let myHeaders = new fetch.Headers();
        let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +
            '<soap:Header/>' +
            '<soap:Body>' +
            '<ser:registraPriceLiquidos>' +
            '<!--Optional:-->' +
            '<ordenPedido>' +
            '<!--Optional:-->' +
            '<API></API>' +
            '<!--Optional:-->' +
            '<actividad></actividad>' +
            '<!--Optional:-->' +
            '<afectoIGV></afectoIGV>' +
            '<!--Optional:-->' +
            '<afectoISC></afectoISC>' +
            '<!--Optional:-->' +
            '<claveUsuario>' + claveUsuario + '</claveUsuario>' +
            '<!--Optional:-->' +
            '<codigoAerolinea></codigoAerolinea>' +
            '<!--Optional:-->' +
            '<codigoAutorizacion></codigoAutorizacion>' +
            '<!--Optional:-->' +
            '<codigoDGHCliente></codigoDGHCliente>' +
            '<!--Optional:-->' +
            '<codigoEquivalenteMayorista1></codigoEquivalenteMayorista1>' +
            '<!--Optional:-->' +
            '<codigoEquivalenteMayorista2></codigoEquivalenteMayorista2>' +
            '<!--Optional:-->' +
            '<codigoEquivalentePlanta1></codigoEquivalentePlanta1>' +
            '<!--Optional:-->' +
            '<codigoEquivalentePlanta2></codigoEquivalentePlanta2>' +
            '<!--Optional:-->' +
            '<codigoEquivalenteProductor></codigoEquivalenteProductor>' +
            '<!--Optional:-->' +
            '<codigoEstado></codigoEstado>' +
            '<!--Optional:-->' +
            '<codigoMayorista></codigoMayorista>' +
            '<!--Optional:-->' +
            '<codigoMayoristaDestino></codigoMayoristaDestino>' +
            '<!--Optional:-->' +
            '<codigoMayoristaDestinoEquivalente></codigoMayoristaDestinoEquivalente>' +
            '<!--Optional:-->' +
            '<codigoMayoristaEquivalente></codigoMayoristaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoMayoristaOrigen></codigoMayoristaOrigen>' +
            '<!--Optional:-->' +
            '<codigoMayoristaOrigenEquivalente></codigoMayoristaOrigenEquivalente>' +
            '<!--Optional:-->' +
            '<codigoOrigen></codigoOrigen>' +
            '<!--Optional:-->' +
            '<codigoOsinergCliente></codigoOsinergCliente>' +
            '<!--Optional:-->' +
            '<codigoOsinergComprador></codigoOsinergComprador>' +
            '<!--Optional:-->' +
            '<codigoPlanta></codigoPlanta>' +
            '<!--Optional:-->' +
            '<codigoPlantaDestino></codigoPlantaDestino>' +
            '<!--Optional:-->' +
            '<codigoPlantaDestinoEquivalente></codigoPlantaDestinoEquivalente>' +
            '<!--Optional:-->' +
            '<codigoPlantaEquivalente></codigoPlantaEquivalente>' +
            '<!--Optional:-->' +
            '<codigoPlantaOrigen></codigoPlantaOrigen>' +
            '<!--Optional:-->' +
            '<codigoPlantaOrigenEquivalente></codigoPlantaOrigenEquivalente>' +
            '<!--Optional:-->' +
            '<codigoProducto></codigoProducto>' +
            '<!--Optional:-->' +
            '<codigoProveedor></codigoProveedor>' +
            '<!--Optional:-->' +
            '<codigoTransporte></codigoTransporte>' +
            '<!--Optional:-->' +
            '<codigoUnidadOperativa></codigoUnidadOperativa>' +
            '<!--Optional:-->' +
            '<codigoUsuario></codigoUsuario>' +
            '<!--Optional:-->' +
            '<cola></cola>' +
            '<!--Optional:-->' +
            '<descripcionEstado></descripcionEstado>' +
            '<!--Zero or more repetitions:-->'

        for (var i = 0; i < detPrecio.length; i++) {
            myBody += '<detalles>' +
                '<cantidad1></cantidad1>' +
                '<cantidad2></cantidad2>' +
                '<cantidadDespachada></cantidadDespachada>' +
                '<cantidadSolicitada></cantidadSolicitada>' +
                '<cantidadVendida></cantidadVendida>' +
                '<!--Optional:-->' +
                '<codigoEstado></codigoEstado>' +
                '<!--Optional:-->' +
                '<codigoMarca></codigoMarca>' +
                '<!--Optional:-->' +
                '<codigoMotivoRechazo></codigoMotivoRechazo>' +
                '<!--Optional:-->' +
                '<codigoProducto>' + detPrecio[i].codigoProducto + '</codigoProducto>' +
                '<!--Optional:-->' +
                '<codigoUnidad>' + detPrecio[i].codigoUnidad + '</codigoUnidad>' +
                '<densidadObservada></densidadObservada>' +
                '<!--Optional:-->' +
                '<descripcionEstado></descripcionEstado>' +
                '<!--Optional:-->' +
                '<detallePedido></detallePedido>' +
                '<factorAPI></factorAPI>' +
                '<factorApor></factorApor>' +
                '<factorComp></factorComp>' +
                '<!--Optional:-->' +
                '<fechaDespacho></fechaDespacho>' +
                '<!--Optional:-->' +
                '<fechaVenta></fechaVenta>' +
                '<!--Optional:-->' +
                '<idProducto></idProducto>' +
                '<!--Optional:-->' +
                '<placaTransporte></placaTransporte>' +
                '<precio>' + detPrecio[i].precio + '</precio>' +
                '<precioGalon></precioGalon>' +
                '<temperatura></temperatura>' +
                '<!--Optional:-->' +
                '<tipoUsuario></tipoUsuario>' +
                '<!--Optional:-->' +
                '<zonaPrecios></zonaPrecios>' +
                '</detalles>'
        }
        myBody += '<!--Optional:-->' +
            '<direccionDestino></direccionDestino>' +
            '<!--Optional:-->' +
            '<direccionDestinoVenta></direccionDestinoVenta>' +
            '<!--Optional:-->' +
            '<dua1></dua1>' +
            '<!--Optional:-->' +
            '<dua2></dua2>' +
            '<!--Optional:-->' +
            '<dua3></dua3>' +
            '<!--Optional:-->' +
            '<fechaCompra></fechaCompra>' +
            '<!--Optional:-->' +
            '<fechaEntrega></fechaEntrega>' +
            '<!--Optional:-->' +
            '<fechaFactura></fechaFactura>' +
            '<!--Optional:-->' +
            '<fechaModificacion></fechaModificacion>' +
            '<!--Optional:-->' +
            '<fechaRegistro></fechaRegistro>' +
            '<!--Optional:-->' +
            '<fechaVenta></fechaVenta>' +
            '<!--Optional:-->' +
            '<flagFactura></flagFactura>' +
            '<!--Optional:-->' +
            '<formaVenta></formaVenta>' +
            '<!--Optional:-->' +
            '<horaModificacion></horaModificacion>' +
            '<!--Optional:-->' +
            '<horaRegistro></horaRegistro>' +
            '<!--Optional:-->' +
            '<horaVenta></horaVenta>' +
            '<!--Optional:-->' +
            '<idProducto></idProducto>' +
            '<!--Optional:-->' +
            '<isStock></isStock>' +
            '<!--Zero or more repetitions:-->' +
            '<listaTransporte></listaTransporte>' +
            '<!--Optional:-->' +
            '<loginUsuario>' + loginUsuario + '</loginUsuario>' +
            '<!--Optional:-->' +
            '<medioTransporte></medioTransporte>' +
            '<!--Optional:-->' +
            '<nombreAerolinea></nombreAerolinea>' +
            '<!--Optional:-->' +
            '<numeroEntrega></numeroEntrega>' +
            '<!--Optional:-->' +
            '<numeroFactura></numeroFactura>' +
            '<!--Optional:-->' +
            '<numeroGuia></numeroGuia>' +
            '<!--Optional:-->' +
            '<ordenPedido></ordenPedido>' +
            '<!--Optional:-->' +
            '<placaTransporte></placaTransporte>' +
            '<!--Optional:-->' +
            '<rucComprador></rucComprador>' +
            '<!--Optional:-->' +
            '<rucMayorista1></rucMayorista1>' +
            '<!--Optional:-->' +
            '<rucMayorista2></rucMayorista2>' +
            '<!--Optional:-->' +
            '<serieNumeroFactura></serieNumeroFactura>' +
            '<!--Optional:-->' +
            '<serieNumeroGuia></serieNumeroGuia>' +
            '<!--Optional:-->' +
            '<temperatura></temperatura>' +
            '<!--Optional:-->' +
            '<tipoOrden></tipoOrden>' +
            '<!--Optional:-->' +
            '<tipoTransaccion></tipoTransaccion>' +
            '<!--Optional:-->' +
            '<tipoVentaFactor></tipoVentaFactor>' +
            '<!--Optional:-->' +
            '<volumenSolicitado></volumenSolicitado>' +
            '<volumenVenta></volumenVenta>' +
            '<!--Optional:-->' +
            '<vuelo></vuelo>' +
            '</ordenPedido>' +
            '</ser:registraPriceLiquidos>' +
            '</soap:Body>' +
            '</soap:Envelope>'

        myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
        // myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        console.log(myBody);
        var respuesta = await fetch(url, { method: 'POST', body: myBody, headers: myHeaders });
        var myResponse = await respuesta.text();

        return req.reply({ loginUsuario: loginUsuario, claveUsuario: claveUsuario, detPrecio, myResponse })
    }

    async function _obtenerUsuario(req) {
        var vID = 1;
        // var myRes;
        // var myRes = "Mi respuesta: ";
        var myRes = req.user;

        var nameId = req.user.id;
        var nombreCompleto = "";
        // var usernameIas = "bb289973-69ea-419a-b03c-eadd10f7974f";
        // var passwordIas = "auNZ?M6Fg9460pXMFf7OK.orN8FiNMUW:GY";
        var xml_id = "";
        var respuesta = "";
        var myResponse = "";

        const url = 'https://a71yv3j8e.accounts.ondemand.com/service/users?name_id=' + nameId;

        let myHeaders = new fetch.Headers();
        let myBody;
        // let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +

        try {

            myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
            myHeaders.append('Authorization', 'Basic ' + base64.encode(usernameIas + ":" + passwordIas));
            // console.log(myBody);
            respuesta = await fetch(url, { method: 'GET', body: myBody, headers: myHeaders });
            // console.log(respuesta);
            myResponse = await respuesta.text();
            // console.log(myResponse);
        } catch (ews) {
            console.log(ews);
        }


        // read XML from a file
        // const xml = fs.readFileSync('user.xml');
        // const xml = myResponse;
        xml_id = myResponse;
        // nombreCompleto = xml;
        // convert XML to JSON
        if (xml_id != "") {
            try {

                const xml2js = require('xml2js');

                xml2js.parseString(xml_id, { mergeAttrs: true }, (err, result) => {
                    if (err) {
                        throw err;
                    }

                    // `result` is a JavaScript object
                    // convert it to a JSON string
                    const json = JSON.stringify(result, null, 4);
                    console.log(json);
                    // var nombreComp = json.first_name + " " + json.last_name;
                    // console.log(nombreComp);
                    // save JSON in a file
                    // fs.writeFileSync('user.json', json);

                    // var string = JSON.stringify(json);
                    var resultado = json;

                    var resultObj = JSON.parse(resultado);
                    var user = resultObj['user'];
                    var nombreObj = JSON.stringify(user['first_name']);

                    nombreObj = nombreObj.replace("[", "");
                    nombreObj = nombreObj.replace('"', "");
                    nombreObj = nombreObj.replace('"', "");
                    nombreObj = nombreObj.replace("]", "");

                    var apellidoObj = JSON.stringify(user['last_name']);
                    apellidoObj = apellidoObj.replace("[", "");
                    apellidoObj = apellidoObj.replace('"', "");
                    apellidoObj = apellidoObj.replace('"', "");
                    apellidoObj = apellidoObj.replace("]", "");

                    nombreCompleto = nombreObj + " " + apellidoObj;

                    // var result = result.replace(/(^\[)/, '');
                    // result = result.replace(/(\]$)/, '');
                    // console.log(result);

                    // try {
                    //     var resultObj = JSON.parse(result);
                    //     console.log(resultObj);
                    // } catch (e) {
                    //     console.log("Error, not a valid JSON string");
                    // }
                });
            } catch (e) {
                console.log(e);
            }
        }

        return req.reply({ ID: vID, Resp: myRes, nombreCompleto: nombreCompleto });
        // return req.reply({ ID: vID, Resp: myRes });
    }

     async function _obtenerinfoUsuario(req) {
         var vID = req.data.ID;
         var nameId = req.data.nameId;
        var usernameIas = "bb289973-69ea-419a-b03c-eadd10f7974f";
        var passwordIas = "auNZ?M6Fg9460pXMFf7OK.orN8FiNMUW:GY";

         const url = 'https://a71yv3j8e.accounts.ondemand.com/service/users?name_id=' + nameId;
         let myHeaders = new fetch.Headers();
         let myBody;
         // let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +


         myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
         myHeaders.append('Authorization', 'Basic ' + base64.encode(usernameIas + ":" + passwordIas));
         console.log(usernameIas,passwordIas);
         var respuesta = await fetch(url, { method: 'GET', body: myBody, headers: myHeaders });
         // console.log(respuesta);d
         var myResponse = await respuesta.text();
         // console.log(myResponse);

         return req.reply({ ID: vID, nameId, myResponse });
     }
         async function _obtenerUsuarios(req) {
        var vID = req.data.ID;
        // var nameId = req.data.nameId;
        //var usernameIas = "bb289973-69ea-419a-b03c-eadd10f7974f";
        //var passwordIas = "auNZ?M6Fg9460pXMFf7OK.orN8FiNMUW:GY";
        var detInfoUsuario = {};

        detInfoUsuario = req.data.detInfoUsuario;
        if (req.data.detInfoUsuario != null) {
            detInfoUsuario = req.data.detInfoUsuario;
        }

        //var usernameIas = "3e0e57d5-38e5-4f9f-9fdd-9fdd0c5edb4a";
        //var passwordIas = "Gpa:PZ:amsbVQGtHqacIyXg]IQC@xB-";
        for (var i = 0; i < detInfoUsuario.length; i++) {
            const url = 'https://a71yv3j8e.accounts.ondemand.com/service/users?name_id=' + detInfoUsuario[i].nameId;
            let myHeaders = new fetch.Headers();
            let myBody;
            console.log(url);
            try {

                myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
                myHeaders.append('Authorization', 'Basic ' + base64.encode(usernameIas + ":" + passwordIas));
                // console.log(myBody);
                var respuesta = await fetch(url, { method: 'GET', body: myBody, headers: myHeaders });
                // console.log(respuesta);
                var myResponse = await respuesta.text();
                // console.log(myResponse);
            } catch (ews) {
                console.log(ews);
                continue;
            }
            var xml_id = myResponse;
            if (xml_id != "") {
                try {

                    const xml2js = require('xml2js');

                    xml2js.parseString(xml_id, { mergeAttrs: true }, (err, result) => {
                        if (err) {
                            throw err;
                        }

                        // `result` is a JavaScript object
                        // convert it to a JSON string
                        const json = JSON.stringify(result, null, 4);
                        console.log(json);
                        // var nombreComp = json.first_name + " " + json.last_name;
                        // console.log(nombreComp);
                        // save JSON in a file
                        // fs.writeFileSync('user.json', json);

                        // var string = JSON.stringify(json);
                        var resultado = json;

                        var resultObj = JSON.parse(resultado);
                        var user = resultObj['user'];
                        // var Login_nameObj = JSON.stringify(user['login_name']);
                        // Login_nameObj = Login_nameObj.replace("[", "");
                        // Login_nameObj = Login_nameObj.replace('"', "");
                        // Login_nameObj = Login_nameObj.replace('"', "");
                        // Login_nameObj = Login_nameObj.replace("]", "");  

                        var nombreObj = JSON.stringify(user['first_name']);
                        nombreObj = nombreObj.replace("[", "");
                        nombreObj = nombreObj.replace('"', "");
                        nombreObj = nombreObj.replace('"', "");
                        nombreObj = nombreObj.replace("]", "");

                        var apellidoObj = JSON.stringify(user['last_name']);
                        apellidoObj = apellidoObj.replace("[", "");
                        apellidoObj = apellidoObj.replace('"', "");
                        apellidoObj = apellidoObj.replace('"', "");
                        apellidoObj = apellidoObj.replace("]", "");

                        // nombreCompleto =Login_nameObj;// nombreObj + " " + apellidoObj;
                        detInfoUsuario[i].nombreCompleto = nombreObj + " " + apellidoObj;

                        // var result = result.replace(/(^\[)/, '');
                        // result = result.replace(/(\]$)/, '');
                        // console.log(result);

                        // try {
                        //     var resultObj = JSON.parse(result);
                        //     console.log(resultObj);
                        // } catch (e) {
                        //     console.log("Error, not a valid JSON string");
                        // }
                    });
                } catch (e) {
                    console.log(e);
                    continue;
                }
            }
            
        }
        return req.reply({ ID: vID, detInfoUsuario: detInfoUsuario });
    }
     /*async function _obtenerinfoUsuario2(req) {
         var vID = req.data.ID;
         var nameId = req.data.nameId;
         //var usernameIas = "bb289973-69ea-419a-b03c-eadd10f7974f";
         //var passwordIas = "auNZ?M6Fg9460pXMFf7OK.orN8FiNMUW:GY";
         var usernameIas = "cbf122ab-f0c3-4dd1-aa02-fd3b1dac9315";
         var passwordIas = "NSvu743?o6O?.iWob_YnLVhQ?Qvt]ZQfZ3";

         const url = 'https://akkoeannk.accounts.ondemand.com/service/users?name_id=' + nameId;
         //const url = 'https://a71yv3j8e.accounts.ondemand.com/service/users?name_id=' + nameId;
         let myHeaders = new fetch.Headers();
         let myBody;
         var nombreCompleto = "";
         var xml_id = "";
         // let myBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.webservices.scop.osinergmin.com">' +


         myHeaders.append('Content-Type', 'application/soap+xml;charset=UTF-8');
         myHeaders.append('Authorization', 'Basic ' + base64.encode(usernameIas + ":" + passwordIas));
         // console.log(myBody);
         var respuesta = await fetch(url, { method: 'GET', body: myBody, headers: myHeaders });
         // console.log(respuesta);
         var myResponse = await respuesta.text();
         // console.log(myResponse);
         xml_id = myResponse;
         // nombreCompleto = xml;
         // convert XML to JSON
         if (xml_id != "") {
             try {
             const xml2js = require('xml2js');

                 xml2js.parseString(xml_id, { mergeAttrs: true }, (err, result) => {
                     if (err) {
                         throw err;
                     }

                     // `result` is a JavaScript object
                     // convert it to a JSON string
                     const json = JSON.stringify(result, null, 4);
                     //console.log(json);
                     // var nombreComp = json.first_name + " " + json.last_name;
                     // console.log(nombreComp);
                     // save JSON in a file
                     // fs.writeFileSync('user.json', json);
                     // var string = JSON.stringify(json);
                     var resultado = json;

                     var resultObj = JSON.parse(resultado);
                     var user = resultObj['user'];
                     var Login_name = JSON.stringify(user['login_name']);
                     var nombreObj = JSON.stringify(user['first_name']);

                     nombreObj = nombreObj.replace("[", "");
                     nombreObj = nombreObj.replace('"', "");
                     nombreObj = nombreObj.replace('"', "");
                     nombreObj = nombreObj.replace("]", "");

                     var apellidoObj = JSON.stringify(user['last_name']);
                     apellidoObj = apellidoObj.replace("[", "");
                     apellidoObj = apellidoObj.replace('"', "");
                     apellidoObj = apellidoObj.replace('"', "");
                     apellidoObj = apellidoObj.replace("]", "");

                     nombreCompleto = nombreObj + " " + apellidoObj;
                     console.log(Login_name);
                     // var result = result.replace(/(^\[)/, '');
                     // result = result.replace(/(\]$)/, '');
                     // console.log(result);

                     // try {
                     //     var resultObj = JSON.parse(result);
                     //     console.log(resultObj);
                     // } catch (e) {
                     //     console.log("Error, not a valid JSON string");
                     // }
                 });
             } catch (e) {
                 console.log(e);
             }
         }
         return req.reply({ ID: vID, nameId, myResponse });
     }*/
})