const Block = require('ipfs-block')

exports.asyncIter = (func, dedupe=true) => {
  let iter = func()
  let resolveFirst
  let resolveLast
  let seen = new Set()
  let ret = (async function * () {
    let first = false
    let last
    for await (let value of iter) {
      if (!Block.isBlock(value)) {
        throw new Error('Iterator must only contain Block objects.')
      }
      if (!first) {
        first = true
        resolveFirst(value)
      }
      last = value
      if (dedupe) {
        let _cid = value.cid.toBaseEncodedString()
        if (!seen.has(_cid)) yield value
        seen.add(_cid)
      } else {
        yield value
      }
    }
    resolveLast(value)
  })()
  ret.first = new Promise(resolve => {
    resolveFirst = resolve
  })
  ret.last = new Promise(resolve => {
    resolveLast = resolve
  })
  return ret
}
