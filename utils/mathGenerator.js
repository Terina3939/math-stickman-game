// utils/mathGenerator.js
// 根据难度生成数学题和干扰选项

function generateQuestion(difficulty) {
  let question = ''
  let answer = 0

  if (difficulty === 'easy') {
    // 初级：加减法，数字范围1-20
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
    // 中级：乘除法，乘法表范围
    const type = Math.random() < 0.5 ? 'mul' : 'div'
    if (type === 'mul') {
      const a = Math.floor(Math.random() * 9) + 2
      const b = Math.floor(Math.random() * 9) + 2
      question = `${a} × ${b} = ?`
      answer = a * b
    } else {
      const b = Math.floor(Math.random() * 8) + 2
      const answer0 = Math.floor(Math.random() * 9) + 2
      const a = b * answer0
      question = `${a} ÷ ${b} = ?`
      answer = answer0
    }

  } else {
    // 高级：两步混合运算
    const type = Math.floor(Math.random() * 3)
    if (type === 0) {
      // (a + b) × c
      const a = Math.floor(Math.random() * 8) + 2
      const b = Math.floor(Math.random() * 8) + 2
      const c = Math.floor(Math.random() * 5) + 2
      question = `(${a} + ${b}) × ${c} = ?`
      answer = (a + b) * c
    } else if (type === 1) {
      // a × b - c
      const a = Math.floor(Math.random() * 7) + 2
      const b = Math.floor(Math.random() * 7) + 2
      const c = Math.floor(Math.random() * 10) + 1
      answer = a * b - c
      if (answer > 0) {
        question = `${a} × ${b} - ${c} = ?`
      } else {
        question = `${a} × ${b} + ${c} = ?`
        answer = a * b + c
      }
    } else {
      // a × b + c × d 简化版
      const a = Math.floor(Math.random() * 6) + 2
      const b = Math.floor(Math.random() * 6) + 2
      const c = Math.floor(Math.random() * 5) + 1
      question = `${a} × ${b} + ${c} = ?`
      answer = a * b + c
    }
  }

  const options = generateOptions(answer)
  return { question, answer, options }
}

function generateOptions(answer) {
  const wrong = new Set()
  const offsets = [1, 2, 3, 5, 10]

  while (wrong.size < 2) {
    const offset = offsets[Math.floor(Math.random() * offsets.length)]
    const sign = Math.random() < 0.5 ? 1 : -1
    const val = answer + sign * offset
    if (val > 0 && val !== answer) {
      wrong.add(val)
    }
  }

  const options = [answer, ...wrong]
  // 随机打乱顺序
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  return options
}

module.exports = { generateQuestion }
