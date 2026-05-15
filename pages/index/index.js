const app = getApp()

Page({
  data: {},

  selectDifficulty(e) {
    const difficulty = e.currentTarget.dataset.level
    app.globalData.difficulty = difficulty
    wx.navigateTo({
      url: `/pages/battle/battle?difficulty=${difficulty}&level=1`
    })
  },

  goLeaderboard() {
    wx.navigateTo({ url: '/pages/leaderboard/leaderboard' })
  }
})
