import type { Range, Role, SpecProfile } from '../types'

const classes = {
  '死亡骑士': ['板甲', '#c41e3a'], '恶魔猎手': ['皮甲', '#a330c9'], '德鲁伊': ['皮甲', '#ff7c0a'],
  '唤魔师': ['锁甲', '#33937f'], '猎人': ['锁甲', '#aad372'], '法师': ['布甲', '#3fc7eb'],
  '武僧': ['皮甲', '#00ff98'], '圣骑士': ['板甲', '#f48cba'], '牧师': ['布甲', '#ffffff'],
  '潜行者': ['皮甲', '#fff468'], '萨满祭司': ['锁甲', '#0070dd'], '术士': ['布甲', '#8788ee'],
  '战士': ['板甲', '#c69b6d'],
} as const

type RawSpec = [string, keyof typeof classes, string, Role, Range, [number, number, number, number, number, number], string, string, string, string]

const raw: RawSpec[] = [
  ['blood-dk','死亡骑士','鲜血','tank','melee',[3,4,1,5,3,4],'dark plate twohand transform selfheal','鲜血与符文维持不死之躯的重甲领主。','主动回血能力极强，能把危险血线重新拉回安全区。','机动性偏弱，需要熟悉符文与符能节奏。'],
  ['frost-dk','死亡骑士','冰霜','melee','melee',[4,3,1,4,5,3],'dark frost plate dual twohand explosive','以符文武器与凛冬寒气碾碎敌人。','爆发窗口清晰，冰霜特效与近战打击都很厚重。','腿短，爆发期外的节奏相对平缓。'],
  ['unholy-dk','死亡骑士','邪恶','melee','melee',[4,4,1,4,4,5],'dark plague plate twohand pet dot','散播瘟疫并指挥亡灵军团的黑暗统帅。','宠物、疾病与召唤物层层叠加，持续压迫感很强。','需要同时照看疾病、资源和召唤窗口。'],
  ['havoc-dh','恶魔猎手','浩劫','melee','melee',[5,3,5,3,5,4],'fel dark agile dual transform explosive','以战刃、邪能与恶魔变形撕开战场。','位移丰富、节奏迅疾，技能视觉冲击力很强。','高速位移也容易把自己送进危险位置。'],
  ['vengeance-dh','恶魔猎手','复仇','tank','melee',[4,3,5,4,4,4],'fel dark agile dual transform selfheal','化身邪能壁垒，以灵魂碎片修复创伤。','坦克中非常灵活，聚怪、跳跃和自疗体验鲜明。','防御依赖技能覆盖，空档期需要提前规划。'],
  ['devourer-dh','恶魔猎手','噬灭','ranged','mid',[4,3,5,3,5,4],'void dark agile dual transform explosive','驾驭虚空、收割灵魂的中距离施法者。','保留恶魔猎手机动性，以虚空光束和灵魂循环输出。','中距离站位与近战派生玩法需要适应。'],
  ['balance-druid','德鲁伊','平衡','ranged','ranged',[3,4,4,3,4,5],'nature arcane shape staff dot radiant','借日月星辰之力施放自然与奥术法术。','远程多目标能力突出，星界法术辨识度极高。','常驻形态会遮挡部分角色幻化。'],
  ['feral-druid','德鲁伊','野性','melee','melee',[5,5,5,3,3,5],'nature agile shape dot subtle','化身猎豹，以流血与撕咬猎杀目标。','潜行、机动与持续流血组成独特的猫德节奏。','资源和流血监控较多，战斗时看不到常规幻化。'],
  ['guardian-druid','德鲁伊','守护','tank','melee',[3,2,4,5,2,5],'nature shape selfheal subtle','化身巨熊，以自然韧性守住阵线。','直观耐打，适合第一次尝试坦克。','熊形态覆盖幻化，核心循环变化相对少。'],
  ['restoration-druid','德鲁伊','恢复','healer','ranged',[4,5,5,3,2,5],'nature shape staff dot radiant','让生命之花提前在队友身上绽放。','移动施法与持续治疗优秀，擅长预判伤害。','需要提前铺设治疗，临时救急较考验判断。'],
  ['devastation-evoker','唤魔师','湮灭','ranged','mid',[4,3,5,3,5,3],'dragon elemental shape staff explosive radiant','汇聚红蓝龙焰，以蓄力法术扫过战场。','蓄力施法和龙族位移带来短促有力的节奏。','射程比多数远程短，战斗形态固定。'],
  ['preservation-evoker','唤魔师','恩护','healer','mid',[4,5,5,3,4,4],'dragon nature arcane shape staff radiant','用生命与时间魔法逆转队友的伤势。','机动、爆发治疗和回溯机制都很有创造性。','短射程和站位方向要求较高。'],
  ['augmentation-evoker','唤魔师','增辉','support','mid',[3,5,5,3,3,5],'dragon arcane shape staff support radiant','以黑铜龙之力放大队友的高光时刻。','独特辅助输出，价值来自强化队友与协调窗口。','个人伤害反馈较弱，表现依赖团队节奏。'],
  ['beast-mastery-hunter','猎人','兽王','ranged','ranged',[4,2,5,4,3,5],'nature rangedweapon pet agile subtle','与野兽伙伴并肩狩猎，边移动边射击。','移动自由、上手直观，宠物收藏也是核心乐趣。','不喜欢宠物管理时会明显减分。'],
  ['marksmanship-hunter','猎人','射击','ranged','ranged',[3,3,3,3,5,3],'martial rangedweapon agile explosive','以精准瞄准和远程齐射掌控战场。','大数字、长射程和弓枪幻化构成纯粹射手体验。','关键读条期间不适合频繁移动。'],
  ['survival-hunter','猎人','生存','melee','melee',[5,3,5,4,4,4],'nature martial twohand pet agile explosive','携宠冲锋，用长柄武器、炸弹和陷阱近身作战。','近战与短暂远程穿插，机动而有野外猎手味道。','玩法身份较混合，不是传统弓箭手。'],
  ['arcane-mage','法师','奥术','ranged','ranged',[3,5,4,2,5,3],'arcane robe staff radiant explosive','将奥术能量压缩进精密的爆发计划。','资源规划与爆发窗口严谨，成功执行时回报极高。','对循环和战斗时间轴的理解要求较高。'],
  ['fire-mage','法师','火焰','ranged','ranged',[5,4,5,2,5,3],'fire robe staff radiant explosive','在高速连击中引爆整片战场。','瞬发、位移与连续暴击带来流畅的爆发体验。','爆发窗口按错时损失明显，身板偏脆。'],
  ['frost-mage','法师','冰霜','ranged','ranged',[4,3,4,3,4,4],'frost robe staff radiant subtle','以寒冰控制节奏，让碎裂法术接连命中。','控制感强、循环稳定，容易建立法师手感。','触发较密集，需要及时判断技能优先级。'],
  ['brewmaster-monk','武僧','酒仙','tank','melee',[5,5,5,4,3,5],'martial nature agile staff subtle','以醉拳和佳酿化解本应致命的攻击。','技能多、节奏快，延后伤害机制非常独特。','按键和决策密度高，新手学习量较大。'],
  ['mistweaver-monk','武僧','织雾','healer','mid',[5,5,5,3,3,4],'martial nature agile staff radiant','用青龙之雾疗愈，也可贴身拳脚回春。','可在近战输出中治疗，动作感在治疗里格外突出。','近战站位与治疗决策需要同时处理。'],
  ['windwalker-monk','武僧','踏风','melee','melee',[5,4,5,3,5,4],'martial nature agile dual subtle','以不重复招式的连段打出武术节奏。','机动性顶尖，连招规则让每次出手都有武术感。','技能数量较多，需要记住连击与资源节奏。'],
  ['holy-paladin','圣骑士','神圣','healer','mid',[4,4,3,5,4,4],'light plate shield radiant selfheal','身披板甲，在前线用圣光挽救盟友。','硬朗、近战感强，爆发治疗与团队保护可靠。','需要靠近战场核心，站位比传统远程治疗紧张。'],
  ['protection-paladin','圣骑士','防护','tank','melee',[4,4,3,5,4,5],'light plate shield radiant selfheal support','举盾立于圣光之中，用祝福保护整支队伍。','打断、辅助和自疗工具丰富，盾牌反馈鲜明。','工具很多，需要知道何时把祝福交给队友。'],
  ['retribution-paladin','圣骑士','惩戒','melee','melee',[3,2,3,5,5,4],'light plate twohand radiant explosive','挥动双手武器，以圣光裁决敌人。','上手直接、爆发清楚，技能光效与重甲都很醒目。','机动性一般，远离目标时输出手段有限。'],
  ['discipline-priest','牧师','戒律','healer','ranged',[4,5,3,2,5,4],'light shadow robe staff radiant support','平衡光影，通过伤害为队友提供救赎。','预铺减伤后边输出边治疗，掌控时间轴时成就感极强。','非常依赖预判，错过准备窗口会较被动。'],
  ['holy-priest','牧师','神圣','healer','ranged',[3,2,2,2,4,4],'light robe staff radiant','最纯粹的圣光治疗者，用神圣法术回应危机。','治疗工具直观全面，适合从传统治疗逻辑入门。','机动和个人减伤偏弱，需要提前选好位置。'],
  ['shadow-priest','牧师','暗影','ranged','ranged',[4,5,3,3,4,5],'void shadow robe staff dot dark','让虚空低语与持续折磨侵蚀敌人。','暗影视觉浓烈，多目标持续伤害与资源管理很有层次。','需要管理持续效果，移动时的输出规划较重要。'],
  ['assassination-rogue','潜行者','奇袭','melee','melee',[4,4,5,3,4,5],'martial dark agile dual dot subtle','以毒药和流血让目标悄无声息地倒下。','持续伤害有条理，潜行开场和毒刃主题统一。','需要维护多个持续效果，转火成本较明显。'],
  ['outlaw-rogue','潜行者','狂徒','melee','melee',[5,4,5,3,4,5],'martial agile dual rangedweapon explosive','像海盗决斗家一样用双刃、手枪和运气作战。','按键飞快、冷却刷新频繁，临场反应感强。','高频操作和随机增益可能令人疲惫。'],
  ['subtlety-rogue','潜行者','敏锐','melee','melee',[5,5,5,3,5,2],'shadow dark agile dual subtle','在暗影间闪烁，于短暂窗口发动致命连击。','爆发连段精密，暗影舞让潜行贯穿战斗。','窗口执行要求高，失误后的落差较明显。'],
  ['elemental-shaman','萨满祭司','元素','ranged','ranged',[4,3,3,3,5,4],'elemental nature shield radiant explosive','召唤雷霆、熔岩和大地回应战斗。','法术反馈直接，熔岩爆裂与闪电链辨识度极高。','部分构筑需要频繁响应触发与资源变化。'],
  ['enhancement-shaman','萨满祭司','增强','melee','melee',[5,5,4,3,5,5],'elemental nature dual radiant explosive','将风火雷霆灌入双持武器的元素战士。','触发密集、元素爆炸不断，是最热闹的近战之一。','优先级变化快，按键与视觉信息都很多。'],
  ['restoration-shaman','萨满祭司','恢复','healer','ranged',[3,3,3,4,4,5],'nature elemental shield radiant support','借流水、先祖与图腾维系团队生命。','工具完整、群体治疗稳定，并拥有标志性团队辅助。','团队分散时部分群疗手段会打折扣。'],
  ['affliction-warlock','术士','痛苦','ranged','ranged',[3,5,2,5,2,5],'shadow dark robe staff pet dot','以诅咒和灵魂腐蚀拖垮成群敌人。','持续伤害层层累积，多目标经营感很强。','目标切换和持续效果管理需要耐心。'],
  ['demonology-warlock','术士','恶魔学识','ranged','ranged',[4,4,2,5,5,4],'fel dark robe staff pet explosive','召来一支恶魔军团，再让它们同时扑向目标。','召唤物数量与爆发场面非常有满足感。','读条和宠物路径会限制即时移动。'],
  ['destruction-warlock','术士','毁灭','ranged','ranged',[2,2,2,5,5,3],'fire fel dark robe staff explosive','积攒灵魂碎片，投出沉重的混乱之箭。','节奏稳、单发反馈重，是大法术爱好者的经典选择。','读条较多，频繁移动会打断输出节奏。'],
  ['arms-warrior','战士','武器','melee','melee',[3,3,4,4,5,3],'martial plate twohand explosive subtle','以精准、沉重的双手武器打击结束战斗。','每一下都很有重量，爆发与斩杀阶段反馈鲜明。','资源低谷时会出现短暂等待。'],
  ['fury-warrior','战士','狂怒','melee','melee',[5,2,4,4,4,5],'martial plate dual explosive','双持巨型武器，以永不停歇的攻击宣泄怒气。','简单直接、速度极快，持续砍击几乎没有空拍。','按键频率很高，长期游玩可能较累。'],
  ['protection-warrior','战士','防护','tank','melee',[4,4,4,5,3,5],'martial plate shield explosive','以盾牌、冲锋和怒吼正面接管战场。','物理防御扎实，冲锋与盾击带来强烈坦克反馈。','自我治疗较少，需要主动维持减伤。'],
]

// 12.x 六维人工校准：[上手难度, 操作上限, 操作节奏, 机动, 生存, 团队功能]。
// 综合官方重做目标、当前指南与玩家实战讨论，保留一位小数并主动拉开分布；它描述体验而非版本强度。
const sixAxisRatings: Record<string, [number, number, number, number, number, number]> = {
  'blood-dk':[6.6,8.3,6.2,2.4,8.6,7.7], 'frost-dk':[4.4,7.0,7.1,2.3,7.3,4.8], 'unholy-dk':[6.8,8.0,6.8,2.5,7.2,5.4],
  'havoc-dh':[5.8,8.1,8.4,9.0,6.0,5.2], 'vengeance-dh':[6.0,8.2,7.4,8.8,7.8,7.5], 'devourer-dh':[7.2,8.7,7.1,8.5,6.6,5.7],
  'balance-druid':[5.7,7.7,5.8,7.0,5.8,7.3], 'feral-druid':[7.1,8.5,8.1,8.5,5.7,5.2], 'guardian-druid':[4.5,6.8,5.8,6.7,8.1,6.2], 'restoration-druid':[7.0,8.8,7.5,8.7,5.9,8.5],
  'devastation-evoker':[4.6,7.2,6.8,8.4,5.8,5.9], 'preservation-evoker':[7.4,8.9,7.5,8.5,5.9,8.7], 'augmentation-evoker':[6.3,8.5,6.0,8.2,6.0,9.0],
  'beast-mastery-hunter':[2.3,5.7,6.9,9.0,6.6,6.5], 'marksmanship-hunter':[4.0,6.6,5.4,5.0,5.4,5.9], 'survival-hunter':[3.8,6.8,7.5,8.6,6.4,7.0],
  'arcane-mage':[7.3,8.8,5.6,6.8,4.9,7.1], 'fire-mage':[6.0,8.5,8.3,8.7,4.7,6.8], 'frost-mage':[4.5,7.2,6.7,7.8,5.5,7.4],
  'brewmaster-monk':[3.9,7.4,7.2,8.3,8.4,8.3], 'mistweaver-monk':[7.2,8.8,8.0,8.5,5.8,8.4], 'windwalker-monk':[5.9,8.0,8.2,8.8,5.8,6.0],
  'holy-paladin':[6.2,8.6,6.8,5.5,8.0,8.8], 'protection-paladin':[5.8,8.4,7.1,5.3,8.5,9.0], 'retribution-paladin':[2.9,6.6,5.8,5.1,7.8,7.5],
  'discipline-priest':[8.0,9.0,7.2,5.6,4.8,8.8], 'holy-priest':[4.1,7.1,5.2,3.8,4.4,8.1], 'shadow-priest':[7.8,8.7,6.8,5.4,5.2,7.5],
  'assassination-rogue':[4.3,7.2,6.5,8.0,5.9,7.4], 'outlaw-rogue':[5.2,7.8,8.7,8.5,5.8,7.6], 'subtlety-rogue':[7.2,8.7,8.2,8.5,5.8,7.5],
  'elemental-shaman':[4.3,7.3,6.1,5.9,6.0,8.0], 'enhancement-shaman':[8.2,8.9,9.0,7.4,5.9,8.0], 'restoration-shaman':[5.8,8.2,5.9,5.5,6.7,9.0],
  'affliction-warlock':[4.5,7.2,5.8,4.0,8.3,7.5], 'demonology-warlock':[3.8,6.8,6.2,4.1,8.4,7.1], 'destruction-warlock':[3.5,6.8,4.1,3.8,8.2,7.3],
  'arms-warrior':[4.8,7.5,5.7,6.8,6.8,6.2], 'fury-warrior':[2.8,6.1,8.9,7.2,6.9,5.7], 'protection-warrior':[6.1,8.5,7.2,7.5,7.8,8.0],
}

const loreTags: Record<string, string[]> = {
  'blood-dk':['death','blood'], 'frost-dk':['death','water'], 'unholy-dk':['death'],
  'havoc-dh':['fel'], 'vengeance-dh':['fel'], 'devourer-dh':['void'],
  'balance-druid':['life','order'], 'feral-druid':['life'], 'guardian-druid':['life','earth'], 'restoration-druid':['life','water'],
  'devastation-evoker':['dragon-red','dragon-blue','fire','arcane'], 'preservation-evoker':['dragon-green','dragon-bronze','life','time'], 'augmentation-evoker':['dragon-black','dragon-bronze','earth','time'],
  'beast-mastery-hunter':['life'], 'survival-hunter':['life','fire'],
  'arcane-mage':['order'], 'fire-mage':['fire'], 'frost-mage':['water'],
  'brewmaster-monk':['spirit'], 'mistweaver-monk':['spirit','life'], 'windwalker-monk':['spirit','air'],
  'holy-paladin':['light'], 'protection-paladin':['light'], 'retribution-paladin':['light'],
  'discipline-priest':['light','void'], 'holy-priest':['light'], 'shadow-priest':['void'],
  'assassination-rogue':['shadow'], 'subtlety-rogue':['shadow'],
  'elemental-shaman':['fire','water','earth','air','storm'], 'enhancement-shaman':['fire','earth','air','storm'], 'restoration-shaman':['water','spirit'],
  'affliction-warlock':['shadow'], 'demonology-warlock':['fel'], 'destruction-warlock':['fel','fire'],
}

const gameplayTags: Record<string, string[]> = {
  'unholy-dk':['pet-army'], 'demonology-warlock':['pet-army'],
  'beast-mastery-hunter':['pet-partner'], 'survival-hunter':['pet-partner'],
}

const ninePointAnchors = [0, 1.5, 3.2, 5, 7.1, 9]
const toNinePoint = (value: number) => {
  const lower = Math.max(0, Math.min(5, Math.floor(value)))
  const upper = Math.max(0, Math.min(5, Math.ceil(value)))
  if (lower === upper) return ninePointAnchors[lower]
  const interpolated = ninePointAnchors[lower] + (ninePointAnchors[upper] - ninePointAnchors[lower]) * (value - lower)
  return Number(interpolated.toFixed(1))
}

export const specs: SpecProfile[] = raw.map(([id, className, specName, role, range, values, tagString, fantasy, summary, caution]) => {
  const [armor, color] = classes[className]
  const [pace, legacyComplexity, mobility, survivability, burst, sustained] = values
  const [difficulty, ceiling, calibratedPace, calibratedMobility, calibratedSurvivability, utility] = sixAxisRatings[id] ?? [toNinePoint(legacyComplexity), toNinePoint(Math.min(5, legacyComplexity + 1)), toNinePoint(pace), toNinePoint(mobility), toNinePoint(survivability), 5]
  return {
    id, className, specName, role, range, armor, color,
    metrics: {
      pace: calibratedPace, difficulty, ceiling,
      mobility: calibratedMobility, survivability: calibratedSurvivability, utility,
      burst: toNinePoint(burst), sustained: toNinePoint(sustained),
    },
    tags: [...new Set([...tagString.split(' '), ...(loreTags[id] ?? []), ...(gameplayTags[id] ?? []), ...(tagString.includes('pet') ? [] : ['no-pet'])])], fantasy, summary, caution,
  }
})
