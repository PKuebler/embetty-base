const {start, restore} = require('@heise/request-promise-native-record')
const assert = require('assert')
const path = require('path')
const SimpleCache = require('./lib/simple-cache')

start({folder: path.join(__dirname, 'fixtures')})

const Embetty = require('../')
const InstagramPost = require('../lib/instagram-post')

afterEach(restore)

const embetty = new Embetty(new SimpleCache())
const createInstagramPost = id => new InstagramPost(id, {embetty})

describe('InstagramPost', () => {
  it('schould construct', () => {
    assert.doesNotThrow(() => { createInstagramPost('123') })
  })

  it('should only accept strings', () => {
    assert.throws(() => { createInstagramPost(123) })
  })

  it('should be able to be output as JSON', async () => {
    const t = createInstagramPost('Bm21NK8APqG')
    await t.retrieve()
    const json = JSON.stringify(t)
    const data = JSON.parse(json)
    assert.equal(data.author_id, '8097972913')
  })

  it('should of the type "tweet"', () => {
    const t = createInstagramPost('Bm21NK8APqG')
    assert.equal(t.type, 'instagram')
  })

  describe('Media', () => {
    it('getImageUrl() defaults to first image', async () => {
      const t = createInstagramPost('Bm21NK8APqG')
      const url = await t.getImageUrl()
      assert.equal(url, 'https://scontent-frt3-2.cdninstagram.com/vp/349dfafc51b311167d5c0998b60d5de2/5C20FF49/t51.2885-15/e35/39713288_1843681045686629_6737937152002228224_n.jpg')
      assert.equal(url, await t.getImageUrl(0))
    })

    it('should not throw an exception if an image does not exist', done => {
      const t = createInstagramPost('Bm21NK8APqG')
      t.getImageUrl(999).then(() => done()).catch(done)
    })

    it('should provide tweet images', async () => {
      const t = createInstagramPost('Bm21NK8APqG')
      const image = await t.getImage()
      assert.ok(Buffer.isBuffer(image.data), 'Image is a buffer')
      assert.equal(image.type, 'image/jpeg')
      assert.ok(image.data.length > 100, 'Image is > 100 bytes')
    })

    it('should not throw an exception if an image does not exist', done => {
      const t = createInstagramPost('Bm21NK8APqG')
      t.getImage(999).then(() => done()).catch(done)
    })
  })
})
