import { questions } from '../data/questions'
import { specs } from '../data/specs'
import type { Answers, MetricKey, Question, RankedSpec, SpecProfile } from '../types'

const roleLabels = { tank:'坦克', healer:'治疗', melee:'近战输出', ranged:'远程输出', support:'辅助输出' }
const rangeLabels = { melee:'贴身近战', ranged:'远程作战', mid:'灵活中距离' }
const metricLabels: Record<MetricKey, string> = { pace:'操作节奏', complexity:'学习深度', mobility:'机动能力', survivability:'生存容错', burst:'爆发反馈', sustained:'持续作战' }

export const getRoleLabel = (role: SpecProfile['role']) => roleLabels[role]
export const getRangeLabel = (range: SpecProfile['range']) => rangeLabels[range]

function optionFit(spec: SpecProfile, question: Question, optionId: string) {
  const option = question.options.find((item) => item.id === optionId)
  if (!option) return { fit: 0, reason: '' }
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
    if (matched) reason = `职业主题与你选择的「${option.label}」相近`
  }
  Object.entries(effect.metrics ?? {}).forEach(([key, target]) => {
    const metric = key as MetricKey
    const distance = Math.abs(spec.metrics[metric] - Number(target))
    signals.push(Math.max(.1, 1 - distance * .22))
    if (distance <= 1) reason = `${metricLabels[metric]}与你期待的程度相符`
  })

  if (!signals.length) return { fit: .66, reason: '' }
  return { fit: signals.reduce((sum, value) => sum + value, 0) / signals.length, reason }
}

function categoryFit(spec: SpecProfile, answers: Answers, category: Question['category']) {
  const relevant = questions.filter((question) => question.category === category && answers[question.id])
  if (!relevant.length) return 0
  const fits = relevant.map((question) => optionFit(spec, question, answers[question.id]).fit)
  return Math.round((fits.reduce((sum, value) => sum + value, 0) / fits.length) * 100)
}

export function rankSpecs(answers: Answers): RankedSpec[] {
  return specs.map((spec) => {
    const looksMatch = categoryFit(spec, answers, 'looks')
    const feelMatch = categoryFit(spec, answers, 'feel')
    const match = Math.round((looksMatch + feelMatch) / 2)
    const reasons = questions
      .filter((question) => answers[question.id])
      .map((question) => optionFit(spec, question, answers[question.id]))
      .filter((result) => result.fit >= .72 && result.reason)
      .sort((a, b) => b.fit - a.fit)
      .map((result) => result.reason)
    const uniqueReasons = [...new Set(reasons)].slice(0, 3)
    if (uniqueReasons.length < 2) uniqueReasons.push(spec.summary)
    return { ...spec, score: looksMatch + feelMatch, match, looksMatch, feelMatch, reasons: uniqueReasons.slice(0, 3) }
  }).sort((a, b) => b.score - a.score || b.feelMatch - a.feelMatch)
}
