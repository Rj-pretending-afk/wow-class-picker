import { createServer } from 'vite'

const RUNS = 12000
const SIN_KEYS = ['pride', 'greed', 'lust', 'envy', 'wrath', 'gluttony', 'sloth']

let seed = 0x07_12_01_26
const random = () => {
  seed ^= seed << 13
  seed ^= seed >>> 17
  seed ^= seed << 5
  return (seed >>> 0) / 4294967296
}
const pick = (items) => items[Math.floor(random() * items.length)]
const shuffle = (items) => {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }
  return next
}

const server = await createServer({ logLevel:'silent', server:{ middlewareMode:true }, appType:'custom' })
const { sinQuestions } = await server.ssrLoadModule('/src/data/sins.ts')
const { specs } = await server.ssrLoadModule('/src/data/specs.ts')
const { getSinScores, rankSinSpecs, sinScoringWeights } = await server.ssrLoadModule('/src/engine/sinScoring.ts')

const failures = []
const label = (id) => {
  const spec = specs.find((item) => item.id === id)
  return `${spec.className}${spec.specName}`
}
const createQuestionSet = () => Array.from({ length:13 }, (_, index) => pick(sinQuestions.filter((question) => question.slot === index + 1)))

if (sinQuestions.length !== 42) failures.push(`七宗罪题库应有 42 题，当前 ${sinQuestions.length} 题`)
for (let slot = 1; slot <= 13; slot += 1) {
  const count = sinQuestions.filter((question) => question.slot === slot).length
  if (count < 3 || count > 4) failures.push(`第 ${slot} 槽题数应为 3～4，当前 ${count}`)
}
sinQuestions.forEach((question) => {
  if (question.options.filter((option) => option.id === 'any').length !== 1) failures.push(`${question.id} 必须且只能有一个“我无所谓”`)
})
if (Math.round(sinScoringWeights.answers * 100) !== 70 || Math.round(sinScoringWeights.personality * 100) !== 30) failures.push('七罪推荐必须保持具体答案 70% / 人格比例 30%')

function simulate(mode) {
  const top1 = new Map()
  const top10 = new Map()
  const sinLeaders = new Map()
  for (let run = 0; run < RUNS; run += 1) {
    const activeQuestions = createQuestionSet()
    const answers = {}
    activeQuestions.forEach((question) => {
      const options = shuffle(question.options.filter((option) => option.id !== 'any'))
      const count = mode === 'single' ? 1 : 1 + Math.floor(random() * Math.min(3, options.length))
      answers[question.id] = options.slice(0, count).map((option) => option.id)
    })
    const ranked = rankSinSpecs(answers, activeQuestions)
    top1.set(ranked[0].id, (top1.get(ranked[0].id) ?? 0) + 1)
    ranked.slice(0, 10).forEach((spec) => top10.set(spec.id, (top10.get(spec.id) ?? 0) + 1))
    const sinScores = getSinScores(answers, activeQuestions)
    const highest = Math.max(...Object.values(sinScores))
    const leaders = SIN_KEYS.filter((key) => sinScores[key] === highest)
    leaders.forEach((key) => sinLeaders.set(key, (sinLeaders.get(key) ?? 0) + 1 / leaders.length))
  }

  const rows = specs.map((spec) => ({
    id:spec.id,
    top1:(top1.get(spec.id) ?? 0) / RUNS,
    top10:(top10.get(spec.id) ?? 0) / RUNS,
  })).sort((a, b) => b.top1 - a.top1)
  console.log(`\n${mode === 'single' ? '七罪随机单选' : '七罪随机顺序多选'} · ${RUNS} 份 · 具体答案 70% + 七罪人格 30%`)
  rows.forEach((row) => console.log(`${label(row.id).padEnd(11)} 首选 ${(row.top1 * 100).toFixed(2)}% · 前十 ${(row.top10 * 100).toFixed(2)}%`))
  console.log(`七罪主导占比：${SIN_KEYS.map((key) => `${key} ${(((sinLeaders.get(key) ?? 0) / RUNS) * 100).toFixed(2)}%`).join(' · ')}`)

  const maxTop1 = Math.max(...rows.map((row) => row.top1))
  const maxTop10 = Math.max(...rows.map((row) => row.top10))
  if (maxTop1 > .085) failures.push(`${mode} 首选最高占比超过 8.5%`)
  if (maxTop10 > .42) failures.push(`${mode} 前十最高占比超过 42%`)
  const unreachableTop10 = rows.filter((row) => row.top10 === 0)
  if (unreachableTop10.length) failures.push(`${mode} 存在无法进入前十的专精：${unreachableTop10.map((row) => label(row.id)).join('、')}`)
  const unreachableTop1 = rows.filter((row) => row.top1 === 0)
  if (unreachableTop1.length) failures.push(`${mode} 存在无法成为首选的专精：${unreachableTop1.map((row) => label(row.id)).join('、')}`)
}

const pureLeaders = new Set()
SIN_KEYS.forEach((key) => {
  const question = {
    id:`pure-${key}`, slot:1, group:'纯罪校准', category:'feel', context:'日常', eyebrow:'校准', title:key, description:'',
    options:[
      { id:'pick', label:key, hint:'', scores:{ [key]:1 }, effect:{} },
      { id:'any', label:'我无所谓', hint:'', scores:{}, effect:{} },
    ],
  }
  const top = rankSinSpecs({ [question.id]:['pick'] }, [question]).slice(0, 5)
  pureLeaders.add(top[0].id)
  console.log(`纯 ${key.padEnd(8)}：${top.map((spec) => label(spec.id)).join(' / ')}`)
})
if (pureLeaders.size < 5) failures.push(`七种纯罪只有 ${pureLeaders.size} 个不同首选，区分度不足`)

simulate('single')
simulate('multi')
await server.close()

if (failures.length) {
  console.error(`\n七宗罪评分审计失败：\n- ${failures.join('\n- ')}`)
  process.exitCode = 1
} else {
  console.log('\n七宗罪评分审计通过：42 题结构完整，40 个专精均可成为首选及进入前十，随机分布无异常垄断。')
}
