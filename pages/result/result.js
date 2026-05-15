const { getStageName } = require('../../utils/mathGenerator')
const app = getApp()

Page({
  data: {
    isLose: false,
    difficulty: 'easy',
    level: 1,
    stageName: '',
    playerName: '',
    saved: false
  },

  onLoad(options) {
    const level = parseInt(options.level) || 1
    this.setData({
      isLose: options.result === 'lose',
      difficulty: options.difficulty || 'easy',
      level,
      stageName: getStageName(level)
    })
  },

  onNameInput(e) {
    this.setData({ playerName: e.detail.value })
  },

  saveScore() {
    const { playerName, difficulty, level, stageName } = this.data
    if (!playerName) return
    app.saveScore(difficulty, playerName, level, stageName)
    this.setData({ saved: true })
  },

  retry() {
    const { difficulty } = this.data
    wx.reLaunch({ url: `/pages/battle/battle?difficulty=${difficulty}&level=1` })
  },

  goLeaderboard() {
    wx.navigateTo({
      url: `/pages/leaderboard/leaderboard?difficulty=${this.data.difficulty}`
    })
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})
