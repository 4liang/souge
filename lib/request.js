const https = require('https')

module.exports = (url) => new Promise((resolve, reject) => {
  // https://api.imjad.cn/cloudmusic.md
  https.get(url, (req, res) => {
    let data = []

    req.on('data', chunk => {
      data.push(chunk)
    })

    req.on('end', () => {
      let body

      try {
        body = JSON.parse(data.join(''))
      } catch (err) {
        console.log('<== api.imjad.cn API 服务器可能挂了，稍后重试！==>')
      }

      resolve(body)
    })
  })
})