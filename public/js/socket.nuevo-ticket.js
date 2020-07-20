// Comando para establecer la conexion
var socket = io();
var label = $('#lblNuevoTicket')

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Desconectado del servidor');
});

// on 'estadoActual'
socket.on('estadoActual', function(resp) {
    console.log(resp);
    label.text(resp.actual)
});

//todos los botones al hacer click en esta pantalla va a disparar esta funcion
$('button').on('click', function() {

    //.emit es para enviar informacion al servidor. Esto lo hará instanteamente cuando ya tenga la conexion
    socket.emit('siguienteTicket', null, function(siguienteTicket) {
        label.text(siguienteTicket);
    });
})