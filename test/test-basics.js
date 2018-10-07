const {test} = require('tap')
const linx = require('../')

const buff = Buffer.from('asdf')
const based = 'zb2rhnrdMkf3DYrybL4psWdrsVKLhR7VUnemamC3Ub64ekDsG'

const af = async function * () {
  let i = 0
  while (i < 2) {
    yield await linx.mkblock(buff, 'sha2-256','raw')
    i += 1
  }
}

test('create cid', async t => {
  let cid = await linx.mkcid(buff, 'sha2-256','raw')
  t.same(cid.toBaseEncodedString(), based)
})

test('create block', async t => {
  let block = await linx.mkblock(buff, 'sha2-256','raw')
  t.same(block.cid.toBaseEncodedString(), based)
  t.same(block.data, buff)
})

test('async iter first', async t => {
  let block = await linx.asyncIter(af).resolve().first
  t.same(block.cid.toBaseEncodedString(), based)
  t.same(block.data, buff)
})

test('async iter last', async t => {
  let block = await linx.asyncIter(af).resolve().last
  t.same(block.cid.toBaseEncodedString(), based)
  t.same(block.data, buff)
})

test('async iter dedup', async t => {
  let count = async gen => {
    let i = 0
    for await (let x of gen) {
      i++
    }
    return i
  }
  t.same(await count(linx.asyncIter(af)), 1)
  t.same(await count(linx.asyncIter(af, false)), 2)
})

test('fail on non-block', async t => {
  let gen = linx.asyncIter(async function * () {
    yield 'asdf'
  })
  try {
    for await (let x of gen) {
      throw new Error('Should not get anything from generator')
    }
  } catch (e) {
    if (e.code === 422) t.ok(true)
    else throw e
  }
})
