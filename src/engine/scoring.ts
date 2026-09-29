import { classProfiles } from '../data/classes'
import { questions } from '../data/questions'
import { specs } from '../data/specs'
import type { Answers, IndifferenceSummary, MetricKey, Question, RankedClass, RankedSpec, SpecProfile } from '../types'

const roleLabels = { tank:'坦克', healer:'治疗', melee:'近战输出', ranged:'远程输出', support:'辅助输出' }
const rangeLabels = { melee:'贴身近战', ranged:'远程作战', mid:'灵活中距离' }
const metricLabels: Record<MetricKey, string> = { pace:'操作节奏', complexity:'学习深度', mobility:'机动能力', survivability:'生存容错', burst:'爆发反馈', sustained:'持续作战' }
const INDIFFERENCE_CLASS_THRESHOLD = .4

export const getRoleLabel = (role: SpecProfile['role']) => roleLabels[role]
export const getRangeLabel = (range: SpecProfile['range']) => rangeLabels[range]

export function getIndifferenceSummary(answers: Answers): IndifferenceSummary {
  const count = questions.filter((question) => answers[question.id] === 'any').length
  const total = questions.length
  const ratio = total ? count / total : 0
  return { count, total, ratio, isHigh: ratio >= INDIFFERENCE_CLASS_THRESHOLD }
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
    signals.push(Math.max(.1, 1 - distance * .22))
    if (distance <= 1) reason = `${metricLabels[metric]}与你期待的程度相符`
  })

  if (!signals.length) return { fit: .66, reason: '', ignored: false }
  return { fit: signals.reduce((sum, value) => sum + value, 0) / signals.length, reason, ignored: false }
}

function categoryFit(spec: SpecProfile, answers: Answers, category: Question['category']) {
  const relevant = questions.filter((question) => question.category === category && answers[question.id] && answers[question.id] !== 'any')
  if (!relevant.length) return 50
  const fits = relevant.map((question) => optionFit(spec, question, answers[question.id]).fit)
  return Math.round((fits.reduce((sum, value) => sum + value, 0) / fits.length) * 100)
}

export function rankSpecs(answers: Answers): RankedSpec[] {
  return specs.map((spec) => {
    const looksMatch = categoryFit(spec, answers, 'looks')
    const feelMatch = categoryFit(spec, answers, 'feel')
    const match = Math.round((looksMatch + feelMatch) / 2)
    const reasons = questions
      .filter((question) => answers[question.id] && answers[question.id] !== 'any')
      .map((question) => optionFit(spec, question, answers[question.id]))
      .filter((result) => result.fit >= .72 && result.reason)
      .sort((a, b) => b.fit - a.fit)
      .map((result) => result.reason)
    const uniqueReasons = [...new Set(reasons)].slice(0, 3)
    if (uniqueReasons.length < 2) uniqueReasons.push(spec.summary)
    return { ...spec, score: looksMatch + feelMatch, match, looksMatch, feelMatch, reasons: uniqueReasons.slice(0, 3) }
  }).sort((a, b) => b.score - a.score || b.feelMatch - a.feelMatch)
}

export function rankClasses(answers: Answers): RankedClass[] {
  const rankedSpecs = rankSpecs(answers)
  const indifference = getIndifferenceSummary(answers)

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

export function getSpecRecommendations(answers: Answers, limit = 6): RankedSpec[] {
  return rankSpecs(answers).slice(0, limit)
}
