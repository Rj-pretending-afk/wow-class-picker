import { classProfiles } from '../data/classes'
import { specs } from '../data/specs'
import type { Answers, IndifferenceSummary, MetricKey, Question, RadarMetricKey, RankedClass, RankedSpec, SpecProfile } from '../types'

const roleLabels = { tank:'坦克', healer:'治疗', melee:'近战输出', ranged:'远程输出', support:'辅助输出' }
const rangeLabels = { melee:'贴身近战', ranged:'远程作战', mid:'灵活中距离' }
const metricLabels: Record<MetricKey, string> = { difficulty:'上手难度', ceiling:'操作上限', pace:'操作节奏', mobility:'机动能力', survivability:'生存容错', utility:'团队功能', burst:'爆发反馈', sustained:'持续作战' }
const INDIFFERENCE_CLASS_THRESHOLD = .4

export const getRoleLabel = (role: SpecProfile['role']) => roleLabels[role]
export const getRangeLabel = (range: SpecProfile['range']) => rangeLabels[range]

export function getClassRadar(className: string): Record<RadarMetricKey, number> {
  const ownSpecs = specs.filter((spec) => spec.className === className)
  const keys: RadarMetricKey[] = ['difficulty', 'ceiling', 'pace', 'mobility', 'survivability', 'utility']
  return Object.fromEntries(keys.map((key) => [key, Number((ownSpecs.reduce((sum, spec) => sum + spec.metrics[key], 0) / ownSpecs.length).toFixed(1))])) as Record<RadarMetricKey, number>
}

export function getIndifferenceSummary(answers: Answers, activeQuestions: Question[]): IndifferenceSummary {
  const count = activeQuestions.filter((question) => answers[question.id]?.includes('any')).length
  const total = activeQuestions.length
  const ratio = total ? count / total : 0
  return { count, total, ratio, isHigh: ratio >= INDIFFERENCE_CLASS_THRESHOLD }
}

function questionFit(spec: SpecProfile, question: Question, optionIds: string[]) {
  const concrete = optionIds.filter((optionId) => optionId !== 'any')
  if (!concrete.length) return { fit: 0, reasons: [] as string[], ignored: true }
  const results = concrete.map((optionId) => optionFit(spec, question, optionId)).filter((result) => !result.ignored)
  if (!results.length) return { fit: 0, reasons: [] as string[], ignored: true }
  // 点击顺序就是偏好顺序：每后一项权重衰减到前一项的 62%，再归一化。
  // 两项约为 62% / 38%，三项约为 50% / 31% / 19%，既表达优先级，也不让次选失去意义。
  const weighted = results.map((result, index) => ({ ...result, weight:Math.pow(.62, index) }))
  const totalWeight = weighted.reduce((sum, result) => sum + result.weight, 0)
  const fit = weighted.reduce((sum, result) => sum + result.fit * result.weight, 0) / totalWeight
  const reasons = weighted
    .filter((result) => result.fit >= .72 && result.reason)
    .sort((a, b) => b.fit * b.weight - a.fit * a.weight)
    .map((result) => result.reason)
  return { fit, reasons, ignored: false }
}

function optionFit(spec: SpecProfile, question: Question, optionId: string) {
  if (optionId === 'any') return { fit: 0, reason: '', ignored: true }
  const option = question.options.find((item) => item.id === optionId)
  if (!option) return { fit: 0, reason: '', ignored: true }
  const { effect } = option
  const signals: number[] = []
  let reason = ''

  if (effect.roles?.length) {
    const matches = effect.roles.includes(spec.role)
    signals.push(matches ? 1 : 0)
    if (matches) reason = `符合你想承担的「${getRoleLabel(spec.role)}」职责`
  }
  if (effect.ranges?.length) {
    const matches = effect.ranges.includes(spec.range)
    signals.push(matches ? 1 : .08)
    if (matches) reason = `${getRangeLabel(spec.range)}正合你的站位偏好`
  }
  if (effect.tags?.length) {
    const matched = effect.tags.filter((tag) => spec.tags.includes(tag)).length
    signals.push(matched ? Math.min(1, .72 + matched * .12) : .12)
    if (matched) reason = `专精主题与你选择的「${option.label}」相近`
  }
  Object.entries(effect.metrics ?? {}).forEach(([key, target]) => {
    const metric = key as MetricKey
    const distance = Math.abs(spec.metrics[metric] - Number(target))
    signals.push(Math.max(.1, 1 - distance * .11))
    if (distance <= 2.1) reason = `${metricLabels[metric]}与你期待的程度相符`
  })

  if (!signals.length) return { fit: .66, reason: '', ignored: false }
  return { fit: signals.reduce((sum, value) => sum + value, 0) / signals.length, reason, ignored: false }
}

function categoryFit(spec: SpecProfile, answers: Answers, category: Question['category'], activeQuestions: Question[]) {
  const relevant = activeQuestions.filter((question) => question.category === category && answers[question.id]?.some((id) => id !== 'any'))
  if (!relevant.length) return 50
  const fits = relevant.map((question) => ({ fit: questionFit(spec, question, answers[question.id]).fit, weight: question.id === 'role' ? 1.35 : 1 }))
  const totalWeight = fits.reduce((sum, item) => sum + item.weight, 0)
  return Math.round((fits.reduce((sum, item) => sum + item.fit * item.weight, 0) / totalWeight) * 100)
}

export function rankSpecs(answers: Answers, activeQuestions: Question[]): RankedSpec[] {
  return specs.map((spec) => {
    const looksMatch = categoryFit(spec, answers, 'looks', activeQuestions)
    const feelMatch = categoryFit(spec, answers, 'feel', activeQuestions)
    const match = Math.round((looksMatch + feelMatch) / 2)
    const reasons = activeQuestions
      .filter((question) => answers[question.id]?.some((id) => id !== 'any'))
      .map((question) => questionFit(spec, question, answers[question.id]))
      .sort((a, b) => b.fit - a.fit)
      .flatMap((result) => result.reasons)
    const uniqueReasons = [...new Set(reasons)].slice(0, 3)
    if (uniqueReasons.length < 2) uniqueReasons.push(spec.summary)
    return { ...spec, score: looksMatch + feelMatch, match, looksMatch, feelMatch, reasons: uniqueReasons.slice(0, 3) }
  }).sort((a, b) => b.score - a.score || b.feelMatch - a.feelMatch)
}

export function rankClasses(answers: Answers, activeQuestions: Question[]): RankedClass[] {
  const rankedSpecs = rankSpecs(answers, activeQuestions)
  const indifference = getIndifferenceSummary(answers, activeQuestions)

  return classProfiles.map((profile) => {
    const ownSpecs = rankedSpecs.filter((spec) => spec.className === profile.name).sort((a, b) => b.match - a.match)
    const topMatches = ownSpecs.slice(0, Math.min(3, ownSpecs.length))
    const average = topMatches.reduce((sum, spec) => sum + spec.match, 0) / topMatches.length
    const specFit = ownSpecs[0].match * .65 + average * .35
    const versatilityFit = profile.versatility * 20
    const match = Math.round(indifference.isHigh ? specFit * .55 + versatilityFit * .45 : specFit * .9 + versatilityFit * .1)
    const roles = [...new Set(specs.filter((spec) => spec.className === profile.name).map((spec) => getRoleLabel(spec.role)))]
    const reason = indifference.isHigh
      ? `${profile.name}能覆盖 ${roles.join('、')}，适合先体验再决定长期方向。`
      : `你的答案与${profile.name}最合适的专精方向较为接近，同时保留 ${roles.length} 类玩法选择。`
    return { ...profile, match, roles, recommendedSpecs: ownSpecs.slice(0, 2).map((spec) => spec.specName), reason }
  }).sort((a, b) => b.match - a.match || b.versatility - a.versatility)
}

export function getSpecRecommendations(answers: Answers, activeQuestions: Question[], limit = 6): RankedSpec[] {
  return rankSpecs(answers, activeQuestions).slice(0, limit)
}
