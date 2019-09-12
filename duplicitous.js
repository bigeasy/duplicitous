const coalesce = require('extant')
const stream = require('stream')
const assert = require('assert')

class Duplicitous extends stream.Duplex {
    constructor (input, output, options = {}) {
        super(options)
        this._input = input
        this._output = output
    }

    _read (size) {
        const buffer = this._input.read(null)
        if (buffer == null) {
            const readable = () => {
                this._input.removeListener('readable', readable)
                this._input.removeListener('end', readable)
                this._read(size)
            }
            this._input.on('end', readable)
            this._input.on('readable', readable)
        } else {
            this.push(buffer)
        }
    }

    _write (chunk, encoding, callback) {
        assert.equal(encoding, 'buffer', 'encoding is not buffer')
        this._output.write(chunk, callback)
    }
}

module.exports = Duplicitous
