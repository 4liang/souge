const names = require('./lib/names')
const EventEmitter = require('events')

class Emitter extends EventEmitter {}

const emitter = new Emitter()

;[
  'search',
  'choose',
  'find',
  'play'
].forEach(key => {
  const fn = require(`./lib/${key}`)
  emitter.on(key, async function (...args) {
    const res = await fn(...args)
    this.emit('handler', key, res, ...args)
  })
})

emitter.on('afterSearch', function (data, q) {
  if (!data || !data.result || !data.result.songs) {
    console.log(`没搜索到 ${q} 的相关结果`)
    return process.exit(1)
  }
  const songs = data.result.songs
  this.emit('choose', songs)
})

emitter.on('afterChoose', function (answers, songs) {
  const arr = songs.filter((song, i) => (
    names(song, i) === answers.song
  ))

  if (arr[0] && arr[0].id) {
    this.emit('find', arr[0].id)
  }
})

emitter.on('afterFind', function (songs) {
  if (songs[0] && songs[0].url) {
    this.emit('play', songs[0].url)
  }
})

emitter.on('playing', function (player) {
  // setTimeout(() => {
  //   console.log('手动停止!')
  //   player.stop()
  //   this.emit('playEnd')
  // }, 2000)
  player.on('playend', (item) => {
    this.emit('playEnd')
  })
})

emitter.on('playEnd', function (player) {
  console.log('播放结束!')
  process.exit()
})

emitter.on('handler', function (key, res, ...args) {
  switch (key) {
    case 'search':
      return this.emit('afterSearch', res, args[0])
    case 'choose':
      return this.emit('afterChoose', res, args[0])
    case 'find':
      return this.emit('afterFind', res)
    case 'play':
      return this.emit('playing', res)
  }
})

module.exports = emitter
