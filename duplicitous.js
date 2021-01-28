const assert = require('assert')
const stream = require('stream')

class Duplicitous extends stream.Duplex {
    constructor (options = {}) {
        super(options)
        this.input = new stream.PassThrough
        this.output = new stream.PassThrough
        this.input.on('end', () => this.push(null))
        this.input.on('readable', () => this._pull())
        this.on('finish', () => this.output.end())
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
        assert(encoding == 'buffer')
        this.output.write(chunk)
        callback()
    }
}

module.exports = Duplicitous
