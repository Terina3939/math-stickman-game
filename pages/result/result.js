// pages/result/result.js
Page({
  data: {
    isWin: false,
    difficulty: 'easy',
    level: 1
  },

  onLoad(options) {
    this.setData({
      isWin: options.result === 'win',
      difficulty: options.difficulty || 'easy',
      level: parseInt(options.level) || 1
    })
  },

  retry() {
    const { difficulty, level } = this.data
    wx.redirectTo({
      url: `/pages/battle/battle?difficulty=${difficulty}&level=${level}`
    })
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})
