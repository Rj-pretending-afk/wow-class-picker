import { useId, type CSSProperties } from 'react'
import { radarMetrics } from '../data/radar'
import type { RadarMetricKey } from '../types'

type RadarValues = Record<RadarMetricKey, number>

interface RadarChartProps {
  values: RadarValues
  color: string
  label: string
  compact?: boolean
}

const centerX = 160
const centerY = 140
const radius = 88

const pointAt = (index: number, value = 5) => {
  const angle = -Math.PI / 2 + index * (Math.PI * 2 / radarMetrics.length)
  const distance = radius * (value / 5)
  return [centerX + Math.cos(angle) * distance, centerY + Math.sin(angle) * distance]
}

const polygon = (values: number[]) => values.map((value, index) => pointAt(index, value).join(',')).join(' ')

export function RadarChart({ values, color, label, compact = false }: RadarChartProps) {
  const titleId = useId()
  const summary = radarMetrics.map(({ key, label: metricLabel }) => `${metricLabel} ${values[key]}/5`).join('，')
  return (
    <figure className={compact ? 'radar-chart compact' : 'radar-chart'} style={{ '--radar-color': color } as CSSProperties}>
      <svg viewBox="0 0 320 286" role="img" aria-labelledby={titleId}>
        <title id={titleId}>{label}六维评分：{summary}</title>
        {[1, 2, 3, 4, 5].map((level) => <polygon className="radar-grid" points={polygon(Array(6).fill(level))} key={level} />)}
        {radarMetrics.map((metric, index) => {
          const [x, y] = pointAt(index)
          return <line className="radar-axis" x1={centerX} y1={centerY} x2={x} y2={y} key={metric.key} />
        })}
        <polygon className="radar-shape" points={polygon(radarMetrics.map(({ key }) => values[key]))} />
        {radarMetrics.map(({ key }, index) => {
          const [x, y] = pointAt(index, values[key])
          return <circle className="radar-point" cx={x} cy={y} r="3" key={key} />
        })}
        {radarMetrics.map(({ key, label: metricLabel }, index) => {
          const angle = -Math.PI / 2 + index * (Math.PI * 2 / radarMetrics.length)
          const x = centerX + Math.cos(angle) * 125
          const y = centerY + Math.sin(angle) * 112
          const anchor = Math.cos(angle) > .25 ? 'start' : Math.cos(angle) < -.25 ? 'end' : 'middle'
          return <text className="radar-label" x={x} y={y} textAnchor={anchor} dominantBaseline="middle" key={key}>{metricLabel} {values[key]}</text>
        })}
      </svg>
    </figure>
  )
}
