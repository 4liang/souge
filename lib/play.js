const Player = require('player')

module.exports = (url) => {
  return new Promise((resolve, reject) => {
    const player = new Player(url)
    player.play()
  
    player.on('playing', function (item) {
      console.log('播放中!')
      resolve(player)
    })

    player.on('error', function (err) {
      // when error occurs
      console.log('播放出错!')
      reject(err)
    })
  })
}