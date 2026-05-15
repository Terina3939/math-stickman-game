App({
  globalData: {
    difficulty: 'easy'
  },

  // 获取排行榜数据
  getLeaderboard(difficulty) {
    try {
      const key = `leaderboard_${difficulty}`
      const data = wx.getStorageSync(key)
      return data || []
    } catch (e) {
      return []
    }
  },

  // 保存一条成绩
  saveScore(difficulty, name, level, stage) {
    try {
      const key = `leaderboard_${difficulty}`
      let list = this.getLeaderboard(difficulty)
      list.push({
        name,
        level,
        stage,
        time: new Date().toLocaleDateString('zh-CN')
      })
      // 按关卡数降序排序，最多保留20条
      list.sort((a, b) => b.level - a.level)
      if (list.length > 20) list = list.slice(0, 20)
      wx.setStorageSync(key, list)
    } catch (e) {
      console.error('保存成绩失败', e)
    }
  }
})
