import type { ClassProfile } from '../types'

export const classProfiles: ClassProfile[] = [
  { name:'死亡骑士', color:'#c41e3a', armor:'板甲', versatility:3, intro:'死亡骑士是驾驭符文、疾病与亡灵力量的重甲英雄。', identity:'可在鲜血坦克、冰霜爆发与邪恶召唤之间切换，整体偏厚重、黑暗与持续压迫。' },
  { name:'恶魔猎手', color:'#a330c9', armor:'皮甲', versatility:4, intro:'恶魔猎手以极强机动性、变身与战刃构成鲜明身份。', identity:'可选择近战浩劫、坦克复仇或中距离噬灭，三种专精都强调移动与形态变化。' },
  { name:'德鲁伊', color:'#ff7c0a', armor:'皮甲', versatility:5, intro:'德鲁伊是正式服中玩法跨度最大的职业，以多种变形适应不同场景。', identity:'一个职业即可体验坦克、治疗、近战和远程输出；当你没有明确偏好时，它是最安全的探索入口。' },
  { name:'唤魔师', color:'#33937f', armor:'锁甲', versatility:4, intro:'唤魔师以龙族形态、蓄力施法和中距离机动为核心。', identity:'拥有远程输出、治疗与辅助输出三种方向，适合重视新机制和团队联动的玩家。' },
  { name:'猎人', color:'#aad372', armor:'锁甲', versatility:3, intro:'猎人擅长远程武器、宠物与野外行动，是移动体验最自由的职业之一。', identity:'既能带宠远程射击，也能精准狙击或携宠近战，适合喜欢独自探索的玩家。' },
  { name:'法师', color:'#3fc7eb', armor:'布甲', versatility:2, intro:'法师是专注远程法术输出的经典职业，拥有奥术、火焰和冰霜三种体系。', identity:'三系都围绕施法与爆发展开，但在资源规划、速度和控制感上差异明显。' },
  { name:'武僧', color:'#00ff98', armor:'皮甲', versatility:5, intro:'武僧用拳脚、真气与酒雾在三种团队职责间自由切换。', identity:'可担任坦克、治疗和近战输出，三系都保留高机动与鲜明的动作感。' },
  { name:'圣骑士', color:'#f48cba', armor:'板甲', versatility:5, intro:'圣骑士以板甲、圣光与团队保护能力闻名。', identity:'神圣、防护和惩戒覆盖治疗、坦克与近战输出，是偏好重甲又想保留多职责选择的职业。' },
  { name:'牧师', color:'#ffffff', armor:'布甲', versatility:4, intro:'牧师在圣光、戒律与虚空之间切换，是治疗方向最丰富的职业。', identity:'拥有两种差异明显的治疗专精和一套暗影输出，适合喜欢照看团队或光影主题的玩家。' },
  { name:'潜行者', color:'#fff468', armor:'皮甲', versatility:2, intro:'潜行者以潜行、控制与精密近战连段掌握战斗节奏。', identity:'三系都专注近战输出，但分别偏向毒伤经营、快速乱战与爆发窗口。' },
  { name:'萨满祭司', color:'#0070dd', armor:'锁甲', versatility:4, intro:'萨满祭司召唤元素、图腾与先祖力量，职业工具非常全面。', identity:'可以远程施法、双持近战或担任治疗，适合想在元素主题下体验多种站位的玩家。' },
  { name:'术士', color:'#8788ee', armor:'布甲', versatility:2, intro:'术士通过诅咒、恶魔和混乱魔法进行远程输出。', identity:'三系分别强调持续伤害、召唤军团与重型法术，生存强但机动通常偏低。' },
  { name:'战士', color:'#c69b6d', armor:'板甲', versatility:3, intro:'战士用武器、盾牌、怒气与冲锋呈现最纯粹的武技幻想。', identity:'可在坦克与两种近战输出之间切换，适合喜欢直接反馈和重甲武器的玩家。' },
]

export const classProfileMap = new Map(classProfiles.map((profile) => [profile.name, profile]))
