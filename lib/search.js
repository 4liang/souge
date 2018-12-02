const request = require('./request')

module.exports = (name) => {
  const url = 'https://api.imjad.cn/cloudmusic/?type=search&search_type=1&s=' + name

  return request(url)
}
