export type Role = 'tank' | 'healer' | 'melee' | 'ranged' | 'support'
export type Range = 'melee' | 'ranged' | 'mid'
export type RadarMetricKey = 'difficulty' | 'ceiling' | 'pace' | 'mobility' | 'survivability' | 'utility'
export type MetricKey = RadarMetricKey | 'burst' | 'sustained'

export interface SpecProfile {
  id: string
  className: string
  specName: string
  role: Role
  range: Range
  armor: '布甲' | '皮甲' | '锁甲' | '板甲'
  color: string
  metrics: Record<MetricKey, number>
  tags: string[]
  fantasy: string
  summary: string
  strengths: string
  weaknesses: string
}

export interface AnswerEffect {
  roles?: Role[]
  ranges?: Range[]
  tags?: string[]
  metrics?: Partial<Record<MetricKey, number>>
}

export interface QuestionOption {
  id: string
  label: string
  hint: string
  effect: AnswerEffect
  accent?: string
  swatches?: { label: string; color: string }[]
}

export interface ClassProfile {
  name: string
  color: string
  armor: SpecProfile['armor']
  intro: string
  identity: string
  strengths: string
  weaknesses: string
  versatility: number
}

export interface Question {
  id: string
  category: 'looks' | 'feel'
  slot: number
  group: string
  required?: boolean
  eyebrow: string
  title: string
  description: string
  options: QuestionOption[]
}

export type Answers = Record<string, string[]>

export interface RankedSpec extends SpecProfile {
  score: number
  match: number
  looksMatch: number
  feelMatch: number
  reasons: string[]
}

export interface RankedClass extends ClassProfile {
  match: number
  roles: string[]
  recommendedSpecs: string[]
  reason: string
}

export interface IndifferenceSummary {
  count: number
  total: number
  ratio: number
  isHigh: boolean
}

export type SinKey = 'pride' | 'greed' | 'lust' | 'envy' | 'wrath' | 'gluttony' | 'sloth'

// 七宗罪选项同时携带罪名分与玩法信号，推荐复用正式测试的评分引擎。
export interface SinOption extends QuestionOption {
  scores: Partial<Record<SinKey, number>>
}

export interface SinQuestion extends Question {
  context: '团本' | '地下城' | 'PvP' | '日常' | '家园' | '社交'
  options: SinOption[]
}

export interface SinProfile {
  key: SinKey
  name: string
  alias: string
  verdict: string
  playstyle: string
  confession: string
}
