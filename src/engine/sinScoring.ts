import { specs } from '../data/specs'
import type { Answers, MetricKey, RankedClass, RankedSpec, SinKey, SinQuestion, SpecProfile } from '../types'
import { getIndifferenceSummary, rankClassesFromSpecs, rankSpecs } from './scoring'

const ANSWER_WEIGHT = .7
const PERSONALITY_WEIGHT = 1 - ANSWER_WEIGHT
const SELECTION_DECAY = .62
const SIN_CONTRAST = 1.18

type SinArchetype = {
  metrics: Partial<Record<MetricKey, number>>
  roles?: SpecProfile['role'][]
  ranges?: SpecProfile['range'][]
  tags?: string[]
}

// 罪名只提供稳定的“人格先验”；题目选项里的 effect 才负责更具体的职责、距离、外观和操作选择。
// 因此人格层只占 30%，能打破相近答案的平局，但不会盖过用户对某一道题的明确选择。
const sinArchetypes: Record<SinKey, SinArchetype> = {
  pride: { metrics:{ difficulty:7.4, ceiling:8.5, utility:7.4 }, roles:['tank','support'] },
  greed: { metrics:{ sustained:8.4, burst:7.2, utility:4.8 }, tags:['dot'] },
  lust: { metrics:{ mobility:7.2, burst:7.6 }, tags:['plate','robe','radiant','explosive','no-pet'] },
  envy: { metrics:{ ceiling:8.4, burst:8.5, utility:4.6 } },
  wrath: { metrics:{ pace:8.7, mobility:8.3, burst:8.5 }, ranges:['melee','mid'] },
  gluttony: { metrics:{ survivability:8.5, sustained:8.5, utility:7.2 }, roles:['tank'], tags:['dot','pet-army','selfheal'] },
  sloth: { metrics:{ difficulty:2.7, pace:4.2, survivability:7.5 }, tags:['pet-partner','pet-army'] },
}

const sinReason: Record<SinKey, string> = {
  pride:'你的傲慢倾向偏爱高上限与掌控感',
  greed:'你的贪婪倾向重视可积累的长期回报',
  lust:'你的色欲倾向在意角色呈现与华丽反馈',
  envy:'你的嫉妒倾向追逐清晰的个人高光',
  wrath:'你的暴怒倾向偏爱快节奏与直接反馈',
  gluttony:'你的暴食倾向喜欢承载更多目标与压力',
  sloth:'你的懒惰倾向偏爱省力、稳定与高容错',
}

const closeness = (value: number, target: number) => Math.max(.08, 1 - Math.abs(value - target) / 8.5)

function rawArchetypeFit(spec: SpecProfile, archetype: SinArchetype) {
  const signals = Object.entries(archetype.metrics).map(([key, target]) => closeness(spec.metrics[key as MetricKey], Number(target)))
  if (archetype.roles?.length) signals.push(archetype.roles.includes(spec.role) ? 1 : .22)
  if (archetype.ranges?.length) signals.push(archetype.ranges.includes(spec.range) ? 1 : .22)
  if (archetype.tags?.length) signals.push(archetype.tags.some((tag) => spec.tags.includes(tag)) ? 1 : .22)
  return signals.reduce((sum, value) => sum + value, 0) / signals.length
}

// 先让每种罪名在 40 专精中拥有相同的 0.1～0.9 区分范围，再扣除每个专精横跨七罪的平均值。
// 均匀随机的七罪比例因此对所有专精都回到 50%，不会产生隐藏的“万金油税”或“万金油奖励”。
const normalizedAffinity = (() => {
  const keys = Object.keys(sinArchetypes) as SinKey[]
  const bySin = new Map<SinKey, Map<string, number>>()
  keys.forEach((key) => {
    const raw = specs.map((spec) => ({ id:spec.id, value:rawArchetypeFit(spec, sinArchetypes[key]) }))
    const min = Math.min(...raw.map((item) => item.value))
    const max = Math.max(...raw.map((item) => item.value))
    bySin.set(key, new Map(raw.map((item) => [item.id, .1 + .8 * (item.value - min) / (max - min || 1)])))
  })
  return { keys, bySin }
})()

export function getSinScores(answers: Answers, activeQuestions: SinQuestion[]) {
  const totals: Record<SinKey, number> = { pride:0, greed:0, lust:0, envy:0, wrath:0, gluttony:0, sloth:0 }
  const expected: Record<SinKey, number> = { pride:0, greed:0, lust:0, envy:0, wrath:0, gluttony:0, sloth:0 }
  activeQuestions.forEach((question) => {
    const concreteOptions = question.options.filter((option) => option.id !== 'any')
    normalizedAffinity.keys.forEach((key) => {
      expected[key] += concreteOptions.reduce((sum, option) => sum + (option.scores[key] ?? 0), 0) / concreteOptions.length
    })
    const chosen = (answers[question.id] ?? [])
      .map((id) => question.options.find((option) => option.id === id))
      .filter((option) => option && option.id !== 'any')
    const weights = chosen.map((_, index) => Math.pow(SELECTION_DECAY, index))
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0)
    if (!weightSum) return
    chosen.forEach((option, index) => Object.entries(option?.scores ?? {}).forEach(([key, value]) => {
      totals[key as SinKey] += Number(value) * weights[index] / weightSum
    }))
  })
  // 每轮抽到的题面给七种罪名的“得分机会”不完全相同。除以本轮随机选择的期望值，
  // 避免题库刚好出现更多暴怒/懒惰选项时，被误判成用户本人更偏向该罪名。
  return Object.fromEntries(normalizedAffinity.keys.map((key) => [key, expected[key] ? totals[key] / expected[key] : totals[key]])) as Record<SinKey, number>
}

export function getSinShares(scores: Record<SinKey, number>) {
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0)
  // 全部中立时，显示规则本就判为懒惰；推荐层也采用同一个兜底，避免文案与推荐彼此矛盾。
  return Object.fromEntries(normalizedAffinity.keys.map((key) => [key, total ? scores[key] / total : key === 'sloth' ? 1 : 0])) as Record<SinKey, number>
}

function personalityFit(spec: SpecProfile, shares: Record<SinKey, number>) {
  const affinities = normalizedAffinity.keys.map((key) => normalizedAffinity.bySin.get(key)?.get(spec.id) ?? .5)
  const baseline = affinities.reduce((sum, value) => sum + value, 0) / affinities.length
  const weighted = normalizedAffinity.keys.reduce((sum, key, index) => sum + shares[key] * (affinities[index] - baseline), 0)
  return Math.max(.05, Math.min(.95, .5 + weighted * SIN_CONTRAST))
}

export function rankSinSpecs(answers: Answers, activeQuestions: SinQuestion[]): RankedSpec[] {
  const direct = rankSpecs(answers, activeQuestions)
  const shares = getSinShares(getSinScores(answers, activeQuestions))
  const leadSin = normalizedAffinity.keys.reduce((best, key) => shares[key] > shares[best] ? key : best, 'pride' as SinKey)
  return direct.map((spec) => {
    const personalityMatch = personalityFit(spec, shares) * 100
    const match = Math.round(spec.match * ANSWER_WEIGHT + personalityMatch * PERSONALITY_WEIGHT)
    return {
      ...spec,
      match,
      score:match * 2,
      reasons:[sinReason[leadSin], ...spec.reasons].slice(0, 3),
    }
  }).sort((a, b) => b.score - a.score || b.feelMatch - a.feelMatch)
}

export function rankSinClasses(answers: Answers, activeQuestions: SinQuestion[]): RankedClass[] {
  return rankClassesFromSpecs(rankSinSpecs(answers, activeQuestions), getIndifferenceSummary(answers, activeQuestions))
}

export const sinScoringWeights = { answers:ANSWER_WEIGHT, personality:PERSONALITY_WEIGHT }
