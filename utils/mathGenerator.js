// utils/mathGenerator.js

function getOptionCount(level) {
  return level >= 6 ? 4 : 3
}

// 返回固定class档位（s1-s5）和对应毫秒数（用于setTimeout）
function getFallInfo(level) {
  if (level <= 3)  return { cls: 's1', ms: 4000 }
  if (level <= 6)  return { cls: 's2', ms: 3000 }
  if (level <= 10) return { cls: 's3', ms: 2200 }
  if (level <= 15) return { cls: 's4', ms: 1600 }
  return               { cls: 's5', ms: 1200 }
}

function getStageName(level) {
  if (level <= 3)  return '轻松'
  if (level <= 6)  return '加速'
  if (level <= 10) return '紧绷'
  if (level <= 15) return '极限'
  return '地狱'
}

function generateQuestion(difficulty) {
  let question = '', answer = 0

  if (difficulty === 'easy') {
    const type = Math.random() < 0.5 ? 'add' : 'sub'
    if (type === 'add') {
      const a = Math.floor(Math.random() * 19) + 1
      const b = Math.floor(Math.random() * (20 - a)) + 1
      question = `${a} + ${b} = ?`
      answer = a + b
    } else {
      const a = Math.floor(Math.random() * 18) + 2
      const b = Math.floor(Math.random() * (a - 1)) + 1
      question = `${a} - ${b} = ?`
      answer = a - b
    }
  } else if (difficulty === 'medium') {
    const type = Math.random() < 0.5 ? 'mul' : 'div'
    if (type === 'mul') {
      const a = Math.floor(Math.random() * 9) + 2
      const b = Math.floor(Math.random() * 9) + 2
      question = `${a} × ${b} = ?`
      answer = a * b
    } else {
      const b = Math.floor(Math.random() * 8) + 2
      const ans = Math.floor(Math.random() * 9) + 2
      question = `${b * ans} ÷ ${b} = ?`
      answer = ans
    }
  } else {
    const type = Math.floor(Math.random() * 3)
    if (type === 0) {
      const a = Math.floor(Math.random() * 8) + 2
      const b = Math.floor(Math.random() * 8) + 2
      const c = Math.floor(Math.random() * 5) + 2
      question = `(${a} + ${b}) × ${c} = ?`
      answer = (a + b) * c
    } else if (type === 1) {
      const a = Math.floor(Math.random() * 7) + 2
      const b = Math.floor(Math.random() * 7) + 2
      const c = Math.floor(Math.random() * 10) + 1
      const res = a * b - c
      if (res > 0) {
        question = `${a} × ${b} - ${c} = ?`
        answer = res
      } else {
        question = `${a} × ${b} + ${c} = ?`
        answer = a * b + c
      }
    } else {
      const a = Math.floor(Math.random() * 6) + 2
      const b = Math.floor(Math.random() * 6) + 2
      const c = Math.floor(Math.random() * 5) + 1
      question = `${a} × ${b} + ${c} = ?`
      answer = a * b + c
    }
  }
  return { question, answer }
}

function generateOptions(answer, count) {
  const wrong = new Set()
  const offsets = [1, 2, 3, 5, 8, 10]
  let attempts = 0
  while (wrong.size < count - 1 && attempts < 50) {
    attempts++
    const offset = offsets[Math.floor(Math.random() * offsets.length)]
    const sign = Math.random() < 0.5 ? 1 : -1
    const val = answer + sign * offset
    if (val > 0 && val !== answer) wrong.add(val)
  }
  const options = [answer, ...wrong]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  return options
}

module.exports = { generateQuestion, generateOptions, getOptionCount, getFallInfo, getStageName }
