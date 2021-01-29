[![Actions Status](https://github.com/bigeasy/duplicitous/workflows/Node%20CI/badge.svg)](https://github.com/bigeasy/duplicitous/actions)
[![codecov](https://codecov.io/gh/bigeasy/duplicitous/branch/master/graph/badge.svg)](https://codecov.io/gh/bigeasy/duplicitous)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A mock duplex stream.

| What          | Where                                             |
| --- | --- |
| Discussion    | https://github.com/bigeasy/duplicitous/issues/1   |
| Documentation | https://bigeasy.github.io/duplicitous             |
| Source        | https://github.com/bigeasy/duplicitous            |
| Issues        | https://github.com/bigeasy/duplicitous/issues     |
| CI            | https://travis-ci.org/bigeasy/duplicitous         |
| Coverage:     | https://codecov.io/gh/bigeasy/duplicitous         |
| License:      | MIT                                               |


```
//{ "mode": "text" }
npm install duplicitous
```

## Usage

This `README.md` is also a unit test using the
[Proof](https://github.com/bigeasy/proof) unit test framework. We'll use the
Proof `okay` function to assert out statements in the readme. A Proof unit test
generally looks like this.

```javascript
//{ "code": { "tests": 4 }, "text": { "tests": 4  } }
require('proof')(%(tests)d, async okay => {
    //{ "include": "test", "mode": "code" }
    //{ "include": "testDisplay" }
})
```

```javascript
//{ "name": "testDisplay", "mode": "text" }
okay('always okay')
okay(true, 'okay if true')
okay(1, 1, 'okay if equal')
okay({ value: 1 }, { value: 1 }, 'okay if deep strict equal')
```

You can run this unit test yourself to see the output from the various
code sections of the readme.

```text
//{ "mode": "text" }
git clone git@github.com:bigeasy/duplicitous.git
cd duplicitous
npm install --no-package-lock --no-save
node test/readme.t.js
```

The `'duplicitous'` module exports a single `Duplex` object.

```javascript
//{ "mode": "text" }
const { Duplex } = require('duplicitous')
```

```javascript
//{ "name": "test", "mode": "code" }
const { Duplex } = require('..')
```

Duplicitous is a mock Duplex stream. It has two through streams properties.
You use `input` to write what the duplex stream reads. You use `output` to read
what the duplex stream writes.

```javascript
//{ "name": "test" }
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
```

You can test back-pressure on writes by setting the `writableHighWaterMark` of
the `Duplex` object in the constructor.

```javascript
//{ "name": "test" }
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
```

Note that `Duplex.output` has no high water mark set so it will not apply
back-pressure on the `Duplex` writable stream. This doesn't matter.
