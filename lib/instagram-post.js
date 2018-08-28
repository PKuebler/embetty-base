const {env} = require('./util')
const cheerio = require('cheerio')
const debug = require('debug')('embetty.base')
const Embed = require('./embed')

module.exports = class InstagramPost extends Embed {
  constructor(id, options) {
    if (Number.isInteger(id)) throw new TypeError()
    super(id, options)
  }

  get _requestOptions() {
    return {
      uri: `https://api.instagram.com/oembed?url=http%3A%2F%2Finstagr.am%2Fp%2F${this.id}%2F`,
      qs: {
        OMITSCRIPT: 'true',
      },
      json: true,
    }
  }

  get type() {
    return 'instagram'
  }

  async getImageUrl() {
    await this.retrieve()
    return this.data.thumbnail_url
  }

  async getImage() {
    const imageUrl = await this.getImageUrl()
    if (!imageUrl) return
    return this.embetty.getBinary(imageUrl)
  }
}
