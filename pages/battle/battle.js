// pages/battle/battle.js
const { generateQuestion } = require('../../utils/mathGenerator')
const app = getApp()

const MONSTER_HP_MAP = { easy: 5, medium: 8, hard: 10 }
const MONSTER_EMOJI = ['👹', '👺', '🧟', '👾', '🤖']

Page({
  data: {
    difficulty: 'easy',
    level: 1,
    // 玩家状态
    playerHp: 5,
    heartList: [true, true, true, true, true],
    // 怪物状态
    monsterHp: 5,
    monsterMaxHp: 5,
    monsterHpPercent: 100,
    monsterEmoji: '👹',
    // 题目
    currentQuestion: '',
    currentAnswer: 0,
    options: [],
    questionVisible: false,
    // 动画状态
    playerAttacking: false,
    monsterHit: false,
    monsterAttacking: false,
    showWave: false,
    // 反馈
    feedbackMsg: '',
    feedbackType: '',
    // 是否可以答题
    canAnswer: true
  },

  onLoad(options) {
    const difficulty = options.difficulty || 'easy'
    const level = parseInt(options.level) || 1
    const monsterMaxHp = MONSTER_HP_MAP[difficulty]
    const monsterEmoji = MONSTER_EMOJI[(level - 1) % MONSTER_EMOJI.length]

    this.setData({
      difficulty,
      level,
      monsterHp: monsterMaxHp,
      monsterMaxHp,
      monsterEmoji
    })

    setTimeout(() => this.nextQuestion(), 500)
  },

  nextQuestion() {
    const { difficulty } = this.data
    const { question, answer, options } = generateQuestion(difficulty)

    const optionObjs = options.map((v, i) => ({
      value: v,
      left: 15 + i * 28
    }))

    this.setData({
      currentQuestion: question,
      currentAnswer: answer,
      options: optionObjs,
      questionVisible: true,
      canAnswer: true,
      feedbackMsg: ''
    })
  },

  selectOption(e) {
    if (!this.data.canAnswer) return
    const selected = e.currentTarget.dataset.value
    const { currentAnswer } = this.data

    this.setData({ canAnswer: false, questionVisible: false })

    if (selected === currentAnswer) {
      this.onCorrect()
    } else {
      this.onWrong()
    }
  },

  onCorrect() {
    // 玩家攻击动画
    this.setData({ playerAttacking: true, showWave: true, feedbackMsg: '✅ 正确！', feedbackType: 'correct' })

    setTimeout(() => {
      let { monsterHp, monsterMaxHp } = this.data
      monsterHp = Math.max(0, monsterHp - 1)
      const monsterHpPercent = Math.round((monsterHp / monsterMaxHp) * 100)

      this.setData({
        monsterHp,
        monsterHpPercent,
        monsterHit: true,
        playerAttacking: false,
        showWave: false
      })

      setTimeout(() => {
        this.setData({ monsterHit: false })

        if (monsterHp <= 0) {
          this.onVictory()
        } else {
          setTimeout(() => this.nextQuestion(), 400)
        }
      }, 400)
    }, 600)
  },

  onWrong() {
    // 怪物攻击动画
    this.setData({ monsterAttacking: true, feedbackMsg: '❌ 错误！', feedbackType: 'wrong' })

    setTimeout(() => {
      let { playerHp } = this.data
      playerHp = Math.max(0, playerHp - 1)
      const heartList = []
      for (let i = 0; i < 5; i++) {
        heartList.push(i < playerHp)
      }

      this.setData({ playerHp, heartList, monsterAttacking: false })

      if (playerHp <= 0) {
        this.onGameOver()
      } else {
        setTimeout(() => this.nextQuestion(), 600)
      }
    }, 700)
  },

  onVictory() {
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/result/result?result=win&difficulty=${this.data.difficulty}&level=${this.data.level}`
      })
    }, 500)
  },

  onGameOver() {
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/result/result?result=lose&difficulty=${this.data.difficulty}&level=${this.data.level}`
      })
    }, 500)
  }
})
