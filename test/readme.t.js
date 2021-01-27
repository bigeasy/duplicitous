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

require('proof')(4, async okay => {
    okay('always okay')
    okay(true, 'okay if true')
    okay(1, 1, 'okay if equal')
    okay({ value: 1 }, { value: 1 }, 'okay if deep strict equal')
})
