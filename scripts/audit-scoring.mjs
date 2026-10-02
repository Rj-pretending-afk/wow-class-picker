import { createServer } from 'vite'

const RUNS = 20000
const EXPECTED_WEAPONS = [
  'weapon-heavy', 'weapon-polearm', 'weapon-dual', 'weapon-dagger', 'weapon-unarmed',
  'weapon-glaive', 'weapon-shield', 'weapon-ranged', 'weapon-caster', 'weapon-body',
]

let seed = 0x12_01_20_26
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
const { questions } = await server.ssrLoadModule('/src/data/questions.ts')
const { specs } = await server.ssrLoadModule('/src/data/specs.ts')
const { rankSpecs } = await server.ssrLoadModule('/src/engine/scoring.ts')

const failures = []
const label = (id) => {
  const spec = specs.find((item) => item.id === id)
  return `${spec.className}${spec.specName}`
}

const createQuestionSet = () => Array.from({ length:13 }, (_, index) => pick(questions.filter((question) => question.slot === index + 1)))

function simulate(mode) {
  const top1 = new Map()
  const top10 = new Map()
  for (let run = 0; run < RUNS; run += 1) {
    const activeQuestions = createQuestionSet()
    const answers = {}
    activeQuestions.forEach((question) => {
      const options = shuffle(question.options.filter((option) => option.id !== 'any'))
      const count = mode === 'single' ? 1 : 1 + Math.floor(random() * Math.min(3, options.length))
      answers[question.id] = options.slice(0, count).map((option) => option.id)
    })
    const ranked = rankSpecs(answers, activeQuestions)
    top1.set(ranked[0].id, (top1.get(ranked[0].id) ?? 0) + 1)
    ranked.slice(0, 10).forEach((spec) => top10.set(spec.id, (top10.get(spec.id) ?? 0) + 1))
  }
  const rows = specs.map((spec) => ({
    id:spec.id,
    top1:(top1.get(spec.id) ?? 0) / RUNS,
    top10:(top10.get(spec.id) ?? 0) / RUNS,
  })).sort((a, b) => b.top1 - a.top1)
  const leader = rows[0]
  const survival = rows.find((row) => row.id === 'survival-hunter')
  console.log(`\n${mode === 'single' ? '随机单选' : '随机顺序多选'} · ${RUNS} 份`)
  rows.slice(0, 8).forEach((row) => console.log(`${label(row.id).padEnd(10)} 首选 ${(row.top1 * 100).toFixed(2)}% · 前十 ${(row.top10 * 100).toFixed(2)}%`))
  console.log(`生存猎人基线：首选 ${(survival.top1 * 100).toFixed(2)}% · 前十 ${(survival.top10 * 100).toFixed(2)}%`)
  if (leader.top1 > .075) failures.push(`${mode} 首选最高占比过高：${label(leader.id)} ${(leader.top1 * 100).toFixed(2)}%`)
  if (Math.max(...rows.map((row) => row.top10)) > .38) failures.push(`${mode} 前十最高占比超过 38%`)
  if (survival.top1 > .06) failures.push(`${mode} 生存猎人首选占比超过 6%`)
  const unreachable = rows.filter((row) => row.top1 === 0 || row.top10 === 0)
  if (unreachable.length) failures.push(`${mode} 存在无法进入结果的专精：${unreachable.map((row) => label(row.id)).join('、')}`)
}

const weaponQuestions = questions.filter((question) => question.slot === 5)
if (weaponQuestions.length !== 3) failures.push(`装备幻想题应为 3 道，当前 ${weaponQuestions.length} 道`)
weaponQuestions.forEach((question) => {
  const tags = question.options.flatMap((option) => option.effect.tags ?? []).filter((tag) => tag.startsWith('weapon-'))
  const missing = EXPECTED_WEAPONS.filter((tag) => !tags.includes(tag))
  const duplicated = EXPECTED_WEAPONS.filter((tag) => tags.filter((item) => item === tag).length !== 1)
  if (missing.length || duplicated.length) failures.push(`${question.id} 的武器体系不完整：缺少 ${missing.join(',') || '无'}；非唯一 ${duplicated.join(',') || '无'}`)
  const ranged = question.options.find((option) => option.effect.tags?.includes('weapon-ranged'))
  if (ranged) {
    const survivalRank = rankSpecs({ [question.id]:[ranged.id] }, [question]).findIndex((spec) => spec.id === 'survival-hunter') + 1
    if (survivalRank <= 10) failures.push(`${question.id} 选择弓枪时生存猎人仍进入前十（第 ${survivalRank}）`)
  }
})

simulate('single')
simulate('multi')
await server.close()

if (failures.length) {
  console.error(`\n评分审计失败：\n- ${failures.join('\n- ')}`)
  process.exitCode = 1
} else {
  console.log('\n评分审计通过：武器覆盖完整，随机基线与生存猎人占比均在阈值内。')
}
