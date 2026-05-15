const { generateQuestion, generateOptions, getOptionCount, getFallDuration, getStageName } = require('../../utils/mathGenerator')
const app = getApp()

const MONSTER_HP_MAP = { easy: 5, medium: 8, hard: 10 }
const MONSTER_EMOJI = ['👹', '👺', '🧟', '👾', '🤖', '👻', '🦹', '🧌']

Page({
  data: {
    difficulty: 'easy',
    level: 1,
    stageName: '轻松',
    fallDuration: 4000,
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
    const fallDuration = getFallDuration(level)
    const stageName = getStageName(level)

    this.setData({
      difficulty,
      level,
      stageName,
      fallDuration,
      monsterHp: monsterMaxHp,
      monsterMaxHp,
      monsterHpPercent: 100,
      monsterEmoji,
      playerHp: this.data.playerHp,
      heartList: this.data.heartList,
      showNextBtn: false,
      feedbackMsg: ''
    })

    setTimeout(() => this.nextQuestion(), 600)
  },

  nextQuestion() {
    this.clearFallTimer()
    const { difficulty, level } = this.data
    const { question, answer } = generateQuestion(difficulty)
    const count = getOptionCount(level)
    const optionValues = generateOptions(answer, count)
    const fallDuration = getFallDuration(level)

    // 均匀分布选项位置
    const spacing = Math.floor(80 / count)
    const optionObjs = optionValues.map((v, i) => ({
      value: v,
      left: 8 + i * spacing
    }))

    this.setData({
      currentQuestion: question,
      currentAnswer: answer,
      options: optionObjs,
      questionVisible: true,
      canAnswer: true,
      feedbackMsg: '',
      fallDuration
    })

    // 掉落计时：时间到扣血
    this.fallTimer = setTimeout(() => {
      if (this.data.canAnswer) {
        this.setData({ canAnswer: false, questionVisible: false, options: [] })
        this.onTimeout()
      }
    }, fallDuration)
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

    this.setData({ canAnswer: false, questionVisible: false, options: [] })

    if (selected === currentAnswer) {
      this.onCorrect()
    } else {
      this.onWrong()
    }
  },

  onTimeout() {
    // 超时未答，怪物攻击
    this.setData({
      feedbackMsg: '⏰ 超时！',
      feedbackType: 'wrong',
      monsterAttacking: true
    })
    setTimeout(() => {
      this.deductPlayerHp()
    }, 500)
  },

  onCorrect() {
    this.setData({
      playerAttacking: true,
      showWave: true,
      feedbackMsg: '✅ 正确！',
      feedbackType: 'correct'
    })
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
          setTimeout(() => this.nextQuestion(), 400)
        }
      }, 400)
    }, 500)
  },

  onWrong() {
    this.setData({
      feedbackMsg: '❌ 错误！',
      feedbackType: 'wrong',
      monsterAttacking: true
    })
    setTimeout(() => {
      this.deductPlayerHp()
    }, 500)
  },

  deductPlayerHp() {
    let { playerHp } = this.data
    playerHp = Math.max(0, playerHp - 1)
    const heartList = Array.from({ length: 5 }, (_, i) => i < playerHp)
    this.setData({ playerHp, heartList, monsterAttacking: false })

    if (playerHp <= 0) {
      this.onGameOver()
    } else {
      setTimeout(() => this.nextQuestion(), 600)
    }
  },

  onVictory() {
    // 每5关给结算选项，其他关直接显示下一关按钮
    setTimeout(() => {
      this.setData({ showNextBtn: true })
    }, 400)
  },

  goNextLevel() {
    const { difficulty, level } = this.data
    const nextLevel = level + 1
    this.initLevel(difficulty, nextLevel)
  },

  goSettle() {
    const { difficulty, level } = this.data
    wx.navigateTo({
      url: `/pages/result/result?result=settle&difficulty=${difficulty}&level=${level}`
    })
  },

  onGameOver() {
    setTimeout(() => {
      const { difficulty, level } = this.data
      wx.navigateTo({
        url: `/pages/result/result?result=lose&difficulty=${difficulty}&level=${level}`
      })
    }, 600)
  }
})
