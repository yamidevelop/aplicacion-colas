const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    // se creó un file data.json que guardará info relevante a todo lo que se haga en el proceso por si se cae la conexion con el server no perder todos los datos
    // basicamente lo que hará es que primero se revisa el json por si hay algo debido a la caida

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = []; //este arreglo va a contener todos los tickets pendientes de revision, que no han sido atendidos por nadie
        this.ultimos4 = [];

        let data = require('../data/data.json')

        if (data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.reiniciarConteo()
        }

        console.log(data);
    }

    reiniciarConteo() {
        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];

        console.log('Se ha inicializado el sistema');
        this.grabarArchivo();
    }

    siguiente() {
        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null); //null porque aun no sabemos que escritorio lo va a atender
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${this.ultimo}`;
    }

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    }

    getUltimos4() {
        return this.ultimos4;
    }


    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return 'No hay tickets'
        }

        let numeroTicket = this.tickets[0].numero; //asi para romper la relacion que tiene js que todos los objetos son pasados por referencia
        this.tickets.shift(); //elimino la primera posicion del arreglo

        let atenderTicket = new Ticket(numeroTicket, escritorio); //crea un nuevo ticket para este escritorio pasado por parm
        this.ultimos4.unshift(atenderTicket); //esta instruccion lo agrega al inicio del arreglo, ilusion optica de que se van moviendo

        //hay que ir borrando los 5,6,7,....ticket-actual
        if (this.ultimos4.length > 4) { //verifica que solo existan 4 en el arreglo
            this.ultimos4.splice(-1, 1);
        }

        console.log('Ultimos 4');
        console.log(this.ultimos4);

        this.grabarArchivo();

        return atenderTicket;
    }

    grabarArchivo() {

        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }

}

module.exports = {
    TicketControl
}