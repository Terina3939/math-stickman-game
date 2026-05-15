// pages/levels/levels.js
const app = getApp()

Page({
  data: {
    difficulty: 'easy',
    difficultyName: '初级',
    levels: []
  },

  onLoad(options) {
    const difficulty = options.difficulty || 'easy'
    const totalLevels = app.globalData.totalLevels[difficulty]
    const nameMap = { easy: '初级', medium: '中级', hard: '高级' }

    const levels = []
    for (let i = 1; i <= totalLevels; i++) {
      levels.push({ num: i, unlocked: i === 1 })
    }

    this.setData({
      difficulty,
      difficultyName: nameMap[difficulty],
      levels
    })
  },

  startLevel(e) {
    const level = e.currentTarget.dataset.level
    const { difficulty } = this.data
    wx.navigateTo({
      url: `/pages/battle/battle?difficulty=${difficulty}&level=${level}`
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
