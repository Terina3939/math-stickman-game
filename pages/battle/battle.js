const { generateQuestion, generateOptions, getOptionCount, getFallInfo, getStageName } = require('../../utils/mathGenerator')
const app = getApp()

const MONSTER_HP_MAP = { easy: 5, medium: 8, hard: 10 }
const MONSTER_EMOJI = ['👹', '👺', '🧟', '👾', '🤖', '👻', '🦹', '🧌']

Page({
  data: {
    difficulty: 'easy',
    level: 1,
    stageName: '轻松',
    fallClass: 's1',   // 控制动画速度的class
    timerClass: 's1',  // 控制倒计时条速度的class
    timerRunning: false,
    // 玩家
    playerHp: 5,
    heartList: [true, true, true, true, true],
    // 怪物
    monsterHp: 5,
    monsterMaxHp: 5,
    monsterHpPercent: 100,
    monsterEmoji: '👹',
    // 题目与选项
    currentQuestion: '',
    currentAnswer: 0,
    options: [],
    questionVisible: false,
    // 动画
    playerAttacking: false,
    monsterHit: false,
    monsterAttacking: false,
    showWave: false,
    // 反馈
    feedbackMsg: '',
    feedbackType: '',
    // 状态
    canAnswer: false,
    showNextBtn: false
  },

  fallTimer: null,

  onLoad(options) {
    const difficulty = options.difficulty || 'easy'
    const level = parseInt(options.level) || 1
    this.initLevel(difficulty, level)
  },

  onUnload() {
    this.clearFallTimer()
  },

  initLevel(difficulty, level) {
    const monsterMaxHp = MONSTER_HP_MAP[difficulty]
    const monsterEmoji = MONSTER_EMOJI[(level - 1) % MONSTER_EMOJI.length]
    const { cls, ms } = getFallInfo(level)
    const stageName = getStageName(level)

    this.setData({
      difficulty,
      level,
      stageName,
      fallClass: cls,
      timerClass: cls,
      monsterHp: monsterMaxHp,
      monsterMaxHp,
      monsterHpPercent: 100,
      monsterEmoji,
      showNextBtn: false,
      feedbackMsg: '',
      timerRunning: false,
      options: []
    })

    // 保留玩家血量，不重置
    setTimeout(() => this.nextQuestion(), 600)
  },

  nextQuestion() {
    this.clearFallTimer()
    const { difficulty, level } = this.data
    const { question, answer } = generateQuestion(difficulty)
    const count = getOptionCount(level)
    const optionValues = generateOptions(answer, count)
    const { cls, ms } = getFallInfo(level)

    const spacing = Math.floor(80 / count)
    const optionObjs = optionValues.map((v, i) => ({
      value: v,
      left: 8 + i * spacing
    }))

    // 先清空选项，下一帧再渲染，避免动画不重播
    this.setData({ options: [], timerRunning: false }, () => {
      setTimeout(() => {
        this.setData({
          currentQuestion: question,
          currentAnswer: answer,
          options: optionObjs,
          fallClass: cls,
          timerClass: cls,
          questionVisible: true,
          timerRunning: true,
          canAnswer: true,
          feedbackMsg: ''
        })

        // 超时扣血
        this.fallTimer = setTimeout(() => {
          if (this.data.canAnswer) {
            this.setData({ canAnswer: false, questionVisible: false, options: [], timerRunning: false })
            this.onTimeout()
          }
        }, ms)
      }, 50)
    })
  },

  clearFallTimer() {
    if (this.fallTimer) {
      clearTimeout(this.fallTimer)
      this.fallTimer = null
    }
  },

  selectOption(e) {
    if (!this.data.canAnswer) return
    this.clearFallTimer()
    const selected = parseInt(e.currentTarget.dataset.value)
    const { currentAnswer } = this.data
    this.setData({ canAnswer: false, questionVisible: false, options: [], timerRunning: false })

    if (selected === currentAnswer) {
      this.onCorrect()
    } else {
      this.onWrong()
    }
  },

  onTimeout() {
    this.setData({ feedbackMsg: '⏰ 超时！', feedbackType: 'wrong', monsterAttacking: true })
    setTimeout(() => this.deductPlayerHp(), 500)
  },

  onCorrect() {
    this.setData({ playerAttacking: true, showWave: true, feedbackMsg: '✅ 正确！', feedbackType: 'correct' })
    setTimeout(() => {
      let { monsterHp, monsterMaxHp } = this.data
      monsterHp = Math.max(0, monsterHp - 1)
      const monsterHpPercent = Math.round((monsterHp / monsterMaxHp) * 100)
      this.setData({ monsterHp, monsterHpPercent, monsterHit: true, playerAttacking: false, showWave: false })
      setTimeout(() => {
        this.setData({ monsterHit: false })
        if (monsterHp <= 0) {
          this.onVictory()
        } else {
          setTimeout(() => this.nextQuestion(), 300)
        }
      }, 400)
    }, 500)
  },

  onWrong() {
    this.setData({ feedbackMsg: '❌ 错误！', feedbackType: 'wrong', monsterAttacking: true })
    setTimeout(() => this.deductPlayerHp(), 500)
  },

  deductPlayerHp() {
    let { playerHp } = this.data
    playerHp = Math.max(0, playerHp - 1)
    const heartList = Array.from({ length: 5 }, (_, i) => i < playerHp)
    this.setData({ playerHp, heartList, monsterAttacking: false })
    if (playerHp <= 0) {
      this.onGameOver()
    } else {
      setTimeout(() => this.nextQuestion(), 500)
    }
  },

  onVictory() {
    setTimeout(() => {
      this.setData({ showNextBtn: true })
    }, 300)
  },

  goNextLevel() {
    const { difficulty, level } = this.data
    this.initLevel(difficulty, level + 1)
  },

  goSettle() {
    const { difficulty, level } = this.data
    wx.navigateTo({ url: `/pages/result/result?result=settle&difficulty=${difficulty}&level=${level}` })
  },

  onGameOver() {
    setTimeout(() => {
      const { difficulty, level } = this.data
      wx.navigateTo({ url: `/pages/result/result?result=lose&difficulty=${difficulty}&level=${level}` })
    }, 600)
  }
})
