declare var $:any;

window.onload=function(){
    cargarMonedas();
    recuperarLocal();

    
    $("#btnConvertir").click(function(){
        convertir();
    });

    $("#btnGuardar").click(function(){
        guardar();
    });
}

interface Moneda{
    codigo: number;
    moneda: string;
    tasa: number;
}

let monedas: Moneda[] = [];
let ultimaConversion: any = null;

function cargarMonedas(){
    $.ajax({
        url:"datos.json",
        method:"get",
        dataType:"json",
        success: function(datos:Moneda[]){
            monedas=datos;
            llenarSelect();
        },
        error: function(){
            $("#mensajes").html("Error al cargar las monedas desde AJAX.");
        }
    });
}

function llenarSelect(){
    let htmlselect:string="<option value=''>Seleccione moneda</option>";
    for(let i=0; i<monedas.length;i++){
        htmlselect+="<option value='"+monedas[i].codigo+"'>"+monedas[i].moneda+"</option>";
    }
    (document.getElementById("selectorMoneda") as HTMLSelectElement).innerHTML=htmlselect;
}

function convertir(){
    // Limpiar mensajes
    $("#mensajes").html("");
    $("#resultado").html("");

    let cantidadTexto:string = (document.getElementById("cantidad") as HTMLInputElement).value;
    let codigoMoneda:string = (document.getElementById("selectorMoneda") as HTMLSelectElement).value;

    // Validaciones
    if(cantidadTexto.trim()==""){
        $("#mensajes").html("Error: La cantidad está vacía.");
        return;
    }

    let cantidad:number = Number(cantidadTexto);
    if(cantidad<=0){
        $("#mensajes").html("Error: La cantidad es igual o menor que cero.");
        return;
    }

    if(codigoMoneda==""){
        $("#mensajes").html("Error: No se ha seleccionado una moneda.");
        return;
    }

    let indice:number = posicionMoneda(Number(codigoMoneda));
    if(indice!=99){
        let monedaDestino:string = monedas[indice].moneda;
        let tasa:number = monedas[indice].tasa;
        let resultadoConversion:number = cantidad * tasa;

        // Mostrar 
        let textoResultado:string = cantidad + " USD equivalen a " + resultadoConversion.toFixed(2) + " " + monedaDestino;
        $("#resultado").html(textoResultado);

        ultimaConversion = {
            cantidadUSD: cantidad,
            monedaDestino: monedaDestino,
            resultadoObtenido: resultadoConversion.toFixed(2)
        };
    }
}

function posicionMoneda(codigo:number){
    for(let i=0; i<monedas.length;i++){
        if(monedas[i].codigo==codigo){
            return i;
        }
    }
    return 99;
}

function guardar(){
    if(ultimaConversion!=null){
        localStorage.setItem("conversionGuardada", JSON.stringify(ultimaConversion));
        $("#mensajes").html("Conversión guardada correctamente en Local Storage.");
        recuperarLocal();
    }else{
        $("#mensajes").html("Error: Primero debe realizar una conversión.");
    }
}

function recuperarLocal(){
    let local = localStorage.getItem("conversionGuardada");
    if(local!=null){
        let conversionGuardada = JSON.parse(local);
        let textoInfo:string = "<strong>Última conversión guardada:</strong><br>";
        textoInfo += "Cantidad original: " + conversionGuardada.cantidadUSD + " USD<br>";
        textoInfo += "Moneda de destino: " + conversionGuardada.monedaDestino + "<br>";
        textoInfo += "Resultado: " + conversionGuardada.resultadoObtenido;
        
        $("#informacion").html(textoInfo);
    }
}
