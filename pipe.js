const stream = require('stream')
const { Duplex } = require('./duplicitous')

class Pipe {
    constructor (up = {}, down = {}) {
        const pipe = {
            up: new stream.PassThrough(up) ,
            down: new stream.PassThrough(down)
        }
        this.client = new Duplex(pipe.down, pipe.up)
        this.server = new Duplex(pipe.up, pipe.down)
    }
}

module.exports = Pipe
