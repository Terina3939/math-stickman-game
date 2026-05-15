const app = getApp()

Page({
  data: {
    activeTab: 'easy',
    list: []
  },

  onLoad(options) {
    const tab = options.difficulty || 'easy'
    this.setData({ activeTab: tab })
    this.loadList(tab)
  },

  onShow() {
    this.loadList(this.data.activeTab)
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
    this.loadList(tab)
  },

  loadList(difficulty) {
    const list = app.getLeaderboard(difficulty)
    this.setData({ list })
  },

  goBack() {
    wx.navigateBack()
  }
})
