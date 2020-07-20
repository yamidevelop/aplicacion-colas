// Comando para establecer la conexion
var socket = io();

//esta funcion es posible que el navegador Edge no lo soporte
var searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) { //has para preguntar si existe el escritorio en la url. url/?escritorio=1
    window.location = 'index.html';
    throw new Error('El escritorio es necesario'); //se detiene aqui el js. No se pone un return porque no estoy dentro de una funcion
}

//aqui viene info del escritorio
var escritorio = searchParams.get('escritorio');
var label = $('small');

console.log(escritorio);

$('h1').text('Escritorio ' + escritorio);

$('button').on('click', function() {
    socket.emit('atenderTicket', { escritorio: escritorio }, function(resp) {

        if (resp === 'No hay tickets') {
            label.text(resp);
            alert(resp);
            return;
        }
        label.text('Ticket ' + resp.numero);
        console.log(resp);

    });
});