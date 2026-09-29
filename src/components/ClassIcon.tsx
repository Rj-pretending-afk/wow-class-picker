import type { CSSProperties } from 'react'

const classKeys: Record<string, string> = {
  '死亡骑士': 'dk', '恶魔猎手': 'dh', '德鲁伊': 'druid', '唤魔师': 'evoker', '猎人': 'hunter', '法师': 'mage', '武僧': 'monk',
  '圣骑士': 'paladin', '牧师': 'priest', '潜行者': 'rogue', '萨满祭司': 'shaman', '术士': 'warlock', '战士': 'warrior',
}

interface ClassIconProps {
  className: string
  color: string
  specId?: string
  size?: number
  round?: boolean
  label?: string
}

// 图标来自 Wowhead 图标库，外框使用职业色。
export function ClassIcon({ className, color, specId, size = 48, round = false, label = '' }: ClassIconProps) {
  const src = `${import.meta.env.BASE_URL}icons/${specId ?? `class-${classKeys[className]}`}.jpg`
  return (
    <span className={round ? 'wow-icon round' : 'wow-icon'} style={{ '--icon-color': color, '--icon-size': `${size}px` } as CSSProperties}>
      <img src={src} alt={label} loading="lazy" />
    </span>
  )
}
