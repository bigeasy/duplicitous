// [![Actions Status](https://github.com/bigeasy/duplicitous/workflows/Node%20CI/badge.svg)](https://github.com/bigeasy/duplicitous/actions)
// [![codecov](https://codecov.io/gh/bigeasy/duplicitous/branch/master/graph/badge.svg)](https://codecov.io/gh/bigeasy/duplicitous)
// [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
//
// A mock duplex stream.
//
// | What          | Where                                             |
// | --- | --- |
// | Discussion    | https://github.com/bigeasy/duplicitous/issues/1   |
// | Documentation | https://bigeasy.github.io/duplicitous             |
// | Source        | https://github.com/bigeasy/duplicitous            |
// | Issues        | https://github.com/bigeasy/duplicitous/issues     |
// | CI            | https://travis-ci.org/bigeasy/duplicitous         |
// | Coverage:     | https://codecov.io/gh/bigeasy/duplicitous         |
// | License:      | MIT                                               |

// ## Usage
//
// This `README.md` is also a unit test using the
// [Proof](https://github.com/bigeasy/proof) unit test framework. We'll use the
// Proof `okay` function to assert out statements in the readme. A Proof unit test
// generally looks like this.

require('proof')(4, async okay => {
    const { Duplex } = require('..')

    // Duplicitous is a mock Duplex stream. It has two through streams properties.
    // You use `input` to write what the duplex stream reads. You use `output` to read
    // what the duplex stream writes.

    {
        const duplex = new Duplex

        const read = []
        duplex.on('readable', () => {
            const buffer = duplex.read()
            if (buffer != null) {
                read.push({ event: 'readable', buffer: String(buffer) })
            }
        })
        duplex.on('end', () => read.push({ event: 'end' }))

        duplex.input.write(Buffer.from('x'))
        duplex.input.end()

        await new Promise(resolve => duplex.once('end', resolve))

        okay(read, [{
            event: 'readable', buffer: 'x'
        }, {
            event: 'end'
        }], 'read')

        const wrote = []
        duplex.output.on('readable', () => {
            const buffer = duplex.output.read()
            if (buffer != null) {
                wrote.push(buffer)
            }
        })

        duplex.write('x')
        duplex.write(Buffer.from('x'))
        duplex.end()

        await new Promise(resolve => duplex.output.once('end', resolve))

        okay(String(Buffer.concat(wrote)), 'xx', 'wrote')
    }

    // You can test back-pressure on writes by setting the `writableHighWaterMark` of
    // the `Duplex` object in the constructor.

    {
        const duplex = new Duplex({ writableHighWaterMark: 1 })

        if (! duplex.write('ab')) {
            okay('awaited')
            await new Promise(resolve => duplex.on('drain', resolve))
        }

        duplex.end()
        duplex.input.end()

        okay(String(duplex.output.read()), 'ab', 'write with drain')
    }

    // Note that `Duplex.output` has no high water mark set so it will not apply
    // back-pressure on the `Duplex` writable stream. This doesn't matter.
    //
    // As a final note, I've found a class like this mock Net module to be helpful in
    // unit tests.

    class Net {
        constructor () {
            this.client = new Duplex
            this.server = new Duplex
            this.client.output.pipe(this.server.input)
            this.server.output.pipe(this.client.input)
            this.client.unref = () => {}
        }

        connect (path) {
            return this.client
        }
    }
})

// You can run this unit test yourself to see the output from the various
// code sections of the readme.

// The `'duplicitous'` module exports a single `Duplex` object.
