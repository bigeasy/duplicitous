require('proof')(4, async (okay) => {
    const once = require('eject')
    const stream = require('stream')
    const Duplicitous = require('../duplicitous')
    const input = new stream.PassThrough
    const output = new stream.PassThrough
    const duplicitous = new Duplicitous(input, output)
    okay(duplicitous.read(20), null, 'nothing')
    const inward = once(duplicitous, 'readable').promise
    input.write(Buffer.from('x'))
    console.log('await inward')
    await inward
    okay(duplicitous.read(20), null, 'still nothing')
    okay(duplicitous.read(1).toString(), 'x', 'read')
    const outward = once(output, 'readable').promise
    duplicitous.write(Buffer.from('o'))
    console.log('await outward')
    await outward
    okay(output.read(1).toString(), 'o', 'written')
})
