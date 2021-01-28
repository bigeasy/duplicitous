require('proof')(1, async okay => {
    const Duplex = require('../duplicitous')
    const duplex = new Duplex({ readableHighWaterMark: 1 })

    duplex.input.write('a')
    duplex.input.write('b')
    duplex.input.write('c')
    duplex.input.end()

    const read = []
    duplex.on('readable', () => {
        const buffer = duplex.read()
        if (buffer != null) {
            read.push(buffer)
        }
    })
    await new Promise(resolve => duplex.on('end', resolve))
    okay(String(Buffer.concat(read)), 'abc', 'drained')
})
