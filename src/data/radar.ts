import type { RadarMetricKey } from '../types'

export const radarMetrics: { key: RadarMetricKey; label: string }[] = [
  { key: 'difficulty', label: '上手难度' },
  { key: 'ceiling', label: '操作上限' },
  { key: 'pace', label: '操作节奏' },
  { key: 'mobility', label: '机动能力' },
  { key: 'survivability', label: '生存容错' },
  { key: 'utility', label: '团队功能' },
]
