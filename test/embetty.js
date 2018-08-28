const {start, restore} = require('@heise/request-promise-native-record')
const assert = require('assert')
const path = require('path')
const Tweets = require('./tweets.json')

start({folder: path.join(__dirname, 'fixtures')})

const Embetty = require('../lib/embetty')

after(restore)
afterEach(() => { delete process.env.EMBETTY_CACHE })

describe('Embetty', () => {
  it('uses LRU as default cache engine', () => {
    process.env.EMBETTY_CACHE = ''
    const embetty = new Embetty()
    assert.equal(embetty.cache.constructor.name, 'LRU')
  })

  it('should load embeds', async () => {
    const embetty = new Embetty()
    const embed = await embetty.loadEmbed(Embetty.Tweet, Tweets.text)
    assert.ok(embed instanceof Embetty.Tweet)
    assert.ok(embed._retrieved)
    assert.equal(typeof embed.data, 'object')
  })

  it('should load a tweet', async () => {
    const embetty = new Embetty()
    const t = await embetty.loadTweet(Tweets.text)
    assert.ok(t instanceof Embetty.Tweet)
    assert.equal(t.data.id_str, Tweets.text)
  })

  it('should load a instagram post', async () => {
    const embetty = new Embetty()
    const i = await embetty.loadInstagramPost('Bm21NK8APqG')
    assert.ok(i instanceof Embetty.InstagramPost)
    assert.equal(i.data.author_id, '8097972913')
  })

  it('should load a youtube video', async () => {
    const embetty = new Embetty()
    const v = await embetty.loadYoutubeVideo('m6UOo2YGbIE')
    assert.ok(v instanceof Embetty.YoutubeVideo)
    assert.equal(v.posterImageUrl, 'https://img.youtube.com/vi/m6UOo2YGbIE/hqdefault.jpg')
  })

  it('should load a vimeo video', async () => {
    const embetty = new Embetty()
    const v = await embetty.loadVimeoVideo('223099532')
    assert.ok(v instanceof Embetty.VimeoVideo)
    assert.equal(v.posterImageUrl, 'https://i.vimeocdn.com/video/642067351_640.jpg')
  })

  it('should load a facebook video', async () => {
    const embetty = new Embetty()
    const v = await embetty.loadFacebookVideo('10156049485672318')
    assert.ok(v instanceof Embetty.FacebookVideo)
    assert.equal(v.canonicalUrl, 'https://www.facebook.com/heiseonline/videos/10156049485672318/')
    assert.equal(v.posterImageUrl, 'https://graph.facebook.com/10156049485672318/picture')
  })

  it('should be possible to select a cache engine by providing an env var', async () => {
    process.env.EMBETTY_CACHE = 'lru://'
    const embetty = new Embetty()
    assert.equal(embetty.cache.constructor.name, 'LRU')
    embetty.close()
  })

  it('should throw an exception if invalid settings are detected', () => {
    process.env.EMBETTY_CACHE = 'invalid://'
    assert.throws(() => new Embetty(), /invalid/)
  })
})
