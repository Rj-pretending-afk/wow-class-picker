import type { CSSProperties } from 'react'
import { classProfiles } from '../data/classes'
import { ClassIcon } from './ClassIcon'

const ringRadius = 38.1
const nodeSize = 12.2

export function Compass() {
  return (
    <div className="compass" role="img" aria-label="十三职业罗盘">
      <div className="compass-glow" aria-hidden="true"><i /><i /></div>
      <svg className="compass-needle" viewBox="0 0 640 640" aria-hidden="true">
        <defs>
          <linearGradient id="needleGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3dca6" /><stop offset="1" stopColor="#d2a857" /></linearGradient>
          <linearGradient id="needleVoid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a72e6" /><stop offset="1" stopColor="#5a44b0" stopOpacity="0.85" /></linearGradient>
        </defs>
        <g opacity="0.82">
          <path d="M320 172L330 320H310Z" fill="url(#needleGold)" />
          <path d="M310 320H330L320 468Z" fill="url(#needleVoid)" />
          <path d="M320 184V306" stroke="#fff6de" strokeOpacity="0.45" strokeWidth="0.9" />
        </g>
        <circle cx="320" cy="320" r="11" fill="#0b0912" stroke="#e8b75c" strokeWidth="1.25" />
        <circle cx="320" cy="320" r="3.5" fill="#e8b75c" />
      </svg>
      {classProfiles.map((profile, index) => {
        const angle = (-90 + index * 360 / classProfiles.length) * Math.PI / 180
        const style = {
          left: `${50 + ringRadius * Math.cos(angle) - nodeSize / 2}%`,
          top: `${50 + ringRadius * Math.sin(angle) - nodeSize / 2}%`,
        } as CSSProperties
        return (
          <span className="compass-node" style={style} title={profile.name} key={profile.name}>
            <ClassIcon className={profile.name} color={profile.color} size={60} round />
          </span>
        )
      })}
    </div>
  )
}
