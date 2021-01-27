require('proof')(4, async (okay) => {
    const once = require('eject')
    const Duplicitous = require('../duplicitous')
    const duplicitous = new Duplicitous
    okay(duplicitous.read(), null, 'nothing')
    const inward = once(duplicitous, 'readable').promise
    duplicitous.input.write(Buffer.from('x'))
    await inward
    okay(duplicitous.read(20), null, 'still nothing')
    okay(duplicitous.read(1).toString(), 'x', 'read')
    const outward = once(duplicitous.output, 'readable').promise
    duplicitous.write(Buffer.from('o'))
    await outward
    okay(duplicitous.output.read(1).toString(), 'o', 'written')
})
