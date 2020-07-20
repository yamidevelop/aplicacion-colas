const { io } = require('../server');

const { TicketControl } = require('../classes/ticket-control')

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {

        let siguiente = ticketControl.siguiente();
        console.log(siguiente);

        callback(siguiente);
    });


    // emitir un evento llamado 'estadoActual'. Se pasa como 2do parametro para obtener el ultimo ticket
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    //callback para notificar cuando ya se haga el proceso, o para notificar cual es el escritorio que le toca
    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio); //aqui ya yo se cual es el ticket que le toca a ese escritorio

        callback(atenderTicket); //retornar para que la persona en el frontend lo pueda trabajar

        //actualizar/notificar en los ULTIMOS 4
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });
    });

});