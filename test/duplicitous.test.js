describe('duplicitous', () => {
    const assert = require('assert')
    it('can read and write buffers', async () => {
        const once = require('prospective/once')
        const stream = require('stream')
        const Duplicitous = require('../duplicitous')
        const input = new stream.PassThrough
        const output = new stream.PassThrough
        const duplicitous = new Duplicitous(input, output)
        assert.equal(duplicitous.read(20), null, 'nothing')
        const inward = once(duplicitous, 'readable').promise
        input.write(Buffer.from('x'))
        console.log('await inward')
        await inward
        assert.equal(duplicitous.read(20), null, 'still nothing')
        assert.equal(duplicitous.read(1).toString(), 'x', 'read')
        const outward = once(output, 'readable').promise
        duplicitous.write(Buffer.from('o'))
        console.log('await outward')
        await outward
        assert.equal(output.read(1), 'o', 'written')
        console.log('done')
    })
})
