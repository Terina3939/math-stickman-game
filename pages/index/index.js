// pages/index/index.js
const app = getApp()

Page({
  data: {},

  selectDifficulty(e) {
    const level = e.currentTarget.dataset.level
    app.globalData.difficulty = level
    app.globalData.currentLevel = 1

    wx.navigateTo({
      url: `/pages/levels/levels?difficulty=${level}`
    })
  }
})
