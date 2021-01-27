const coalesce = require('extant')
const stream = require('stream')
const assert = require('assert')


class Duplicitous extends stream.Duplex {
    constructor (options = {}) {
        super(options)
        this.input = new stream.PassThrough
        this.output = new stream.PassThrough
        this.input.on('end', () => this.push(null))
        this.input.on('readable', () => this._pull())
        this.output.on('drain', () => this.emit('drain'))
        this.output.on('finish', () => this.emit('finish'))
    }

    _pull () {
        for (;;) {
            const buffer = this.input.read()
            if (buffer == null) {
                break
            }
            this._size -= buffer.length
            if (! this.push(buffer) || this._size <= 0) {
                break
            }
        }
    }

    _read (size) {
        this._size = size
        return true
    }

    _write (chunk, encoding, callback) {
        if (Buffer.isBuffer(chunk)) {
            this.output.write(chunk)
        } else {
            this.output.write(chunk, 'utf8')
        }
        callback()
    }
}

module.exports = Duplicitous
