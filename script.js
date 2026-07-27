"use strict";
window.onload = function () {
    cargarMonedas();
    recuperarLocal();
    // Uso de jQuery para manejar los eventos como pide la rúbrica
    $("#btnConvertir").click(function () {
        convertir();
    });
    $("#btnGuardar").click(function () {
        guardar();
    });
};
let monedas = [];
let ultimaConversion = null;
function cargarMonedas() {
    $.ajax({
        url: "datos.json",
        method: "get",
        dataType: "json",
        success: function (datos) {
            monedas = datos;
            llenarSelect();
        },
        error: function () {
            $("#mensajes").html("Error al cargar las monedas desde AJAX.");
        }
    });
}
function llenarSelect() {
    let htmlselect = "<option value=''>Seleccione moneda</option>";
    for (let i = 0; i < monedas.length; i++) {
        htmlselect += "<option value='" + monedas[i].codigo + "'>" + monedas[i].moneda + "</option>";
    }
    document.getElementById("selectorMoneda").innerHTML = htmlselect;
}
function convertir() {
    // Limpiar mensajes
    $("#mensajes").html("");
    $("#resultado").html("");
    let cantidadTexto = document.getElementById("cantidad").value;
    let codigoMoneda = document.getElementById("selectorMoneda").value;
    // Validaciones
    if (cantidadTexto.trim() == "") {
        $("#mensajes").html("Error: La cantidad está vacía.");
        return;
    }
    let cantidad = Number(cantidadTexto);
    if (cantidad <= 0) {
        $("#mensajes").html("Error: La cantidad es igual o menor que cero.");
        return;
    }
    if (codigoMoneda == "") {
        $("#mensajes").html("Error: No se ha seleccionado una moneda.");
        return;
    }
    let indice = posicionMoneda(Number(codigoMoneda));
    if (indice != 99) {
        let monedaDestino = monedas[indice].moneda;
        let tasa = monedas[indice].tasa;
        let resultadoConversion = cantidad * tasa;
        // Mostrar resultado con dos decimales y dinámicamente con jQuery
        let textoResultado = cantidad + " USD equivalen a " + resultadoConversion.toFixed(2) + " " + monedaDestino;
        $("#resultado").html(textoResultado);
        ultimaConversion = {
            cantidadUSD: cantidad,
            monedaDestino: monedaDestino,
            resultadoObtenido: resultadoConversion.toFixed(2)
        };
    }
}
function posicionMoneda(codigo) {
    for (let i = 0; i < monedas.length; i++) {
        if (monedas[i].codigo == codigo) {
            return i;
        }
    }
    return 99;
}
function guardar() {
    if (ultimaConversion != null) {
        localStorage.setItem("conversionGuardada", JSON.stringify(ultimaConversion));
        $("#mensajes").html("Conversión guardada correctamente en Local Storage.");
        recuperarLocal();
    }
    else {
        $("#mensajes").html("Error: Primero debe realizar una conversión.");
    }
}
function recuperarLocal() {
    let local = localStorage.getItem("conversionGuardada");
    if (local != null) {
        let conversionGuardada = JSON.parse(local);
        let textoInfo = "<strong>Última conversión guardada:</strong><br>";
        textoInfo += "Cantidad original: " + conversionGuardada.cantidadUSD + " USD<br>";
        textoInfo += "Moneda de destino: " + conversionGuardada.monedaDestino + "<br>";
        textoInfo += "Resultado: " + conversionGuardada.resultadoObtenido;
        $("#informacion").html(textoInfo);
    }
}
