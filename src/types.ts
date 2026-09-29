export type Role = 'tank' | 'healer' | 'melee' | 'ranged' | 'support'
export type Range = 'melee' | 'ranged' | 'mid'
export type MetricKey = 'pace' | 'complexity' | 'mobility' | 'survivability' | 'burst' | 'sustained'

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
  caution: string
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
}

export interface Question {
  id: string
  category: 'looks' | 'feel'
  eyebrow: string
  title: string
  description: string
  options: QuestionOption[]
}

export type Answers = Record<string, string>

export interface RankedSpec extends SpecProfile {
  score: number
  match: number
  looksMatch: number
  feelMatch: number
  reasons: string[]
}
