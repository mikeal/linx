const Block = require('ipfs-block')
const {promisify} = require('util')
const multihashing = promisify(require('multihashing-async'))
const CID = require('cids')

exports.asyncIter = (func, dedupe=true) => {
  let iter = func()
  let resolveFirst
  let resolveLast
  let seen = new Set()
  let ret = (async function * () {
    let first = false
    let last
    let value
    for await (value of iter) {
      if (!Block.isBlock(value)) {
        let err = new Error('Iterator must only contain Block objects.')
        err.code = 422
        throw err
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
  ret.resolve = () => {
    ;(async () => {
      for await (let x of ret) {
        // do nothing
      }
    })()
    return ret
  }
  return ret
}

exports.mkcid = async (buff, algo, codec) => {
  let hash = await multihashing(buff, algo)
  return new CID(1, codec, hash)
}
exports.mkblock = async (buff, algo, codec) => {
  let cid = await exports.mkcid(buff, algo, codec)
  return new Block(buff, cid)
}
