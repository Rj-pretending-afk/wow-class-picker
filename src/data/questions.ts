import type { Question } from '../types'

const baseQuestions: Question[] = [
  { id:'power', category:'looks', eyebrow:'颜值 01 · 力量主题', title:'哪一种力量最能让你心动？', description:'先选角色幻想，不考虑版本强弱。', options:[
    { id:'light', label:'圣光与秩序', hint:'金色、守护、审判', effect:{ tags:['light','radiant'] } },
    { id:'nature', label:'自然与元素', hint:'星辰、风暴、野兽与生命', effect:{ tags:['nature','elemental'] } },
    { id:'arcane', label:'奥术与龙族', hint:'时间、魔法与星界能量', effect:{ tags:['arcane','dragon'] } },
    { id:'dark', label:'暗影与禁忌', hint:'死亡、邪能、虚空与诅咒', effect:{ tags:['dark','shadow','void','fel'] } },
    { id:'martial', label:'纯粹武技', hint:'钢铁、拳脚、弓枪与潜行', effect:{ tags:['martial'] } },
  ]},
  { id:'role', category:'feel', eyebrow:'手感 01 · 团队职责', title:'你最想在队伍里做什么？', description:'这是玩法匹配里权重最高的一题。', options:[
    { id:'tank', label:'保护队友', hint:'引导敌人、规划减伤', effect:{ roles:['tank'] } },
    { id:'healer', label:'治疗队友', hint:'预判伤害、处理危机', effect:{ roles:['healer'] } },
    { id:'damage', label:'专注输出', hint:'近战或远程都可以', effect:{ roles:['melee','ranged'] } },
    { id:'support', label:'强化团队', hint:'喜欢放大队友的表现', effect:{ roles:['support','healer'] } },
    { id:'any', label:'还没决定', hint:'让其他答案来决定', effect:{} },
  ]},
  { id:'silhouette', category:'looks', eyebrow:'颜值 02 · 战斗轮廓', title:'你想以什么姿态站在战场上？', description:'这会明显影响幻化与角色辨识度。', options:[
    { id:'plate', label:'重甲骑士', hint:'厚重板甲与正面压迫感', effect:{ tags:['plate'] } },
    { id:'robe', label:'长袍施法者', hint:'远程法术与经典法系轮廓', effect:{ tags:['robe','staff'] } },
    { id:'agile', label:'灵活游侠', hint:'轻甲、速度与敏捷动作', effect:{ tags:['agile'] } },
    { id:'shape', label:'变身形态', hint:'巨熊、猎豹、恶魔或龙族', effect:{ tags:['shape','transform'] } },
    { id:'pet', label:'伙伴成群', hint:'野兽、亡灵或恶魔陪你作战', effect:{ tags:['pet'] } },
  ]},
  { id:'range', category:'feel', eyebrow:'手感 02 · 作战距离', title:'你更喜欢在哪里战斗？', description:'想象自己在首领战里的默认站位。', options:[
    { id:'melee', label:'贴身近战', hint:'追着目标，反馈直接', effect:{ ranges:['melee'] } },
    { id:'ranged', label:'远程作战', hint:'观察全场，保持距离', effect:{ ranges:['ranged'] } },
    { id:'mid', label:'灵活中距离', hint:'能靠近，也能拉开', effect:{ ranges:['mid'] } },
    { id:'any', label:'都可以', hint:'距离不影响选择', effect:{} },
  ]},
  { id:'weapon', category:'looks', eyebrow:'颜值 03 · 武器偏好', title:'角色手里最该拿着什么？', description:'选择你最想围绕它收集幻化的武器。', options:[
    { id:'twohand', label:'双手大武器', hint:'大剑、战斧、长柄', effect:{ tags:['twohand'] } },
    { id:'dual', label:'双持武器', hint:'高速、对称、有攻击性', effect:{ tags:['dual'] } },
    { id:'shield', label:'盾牌', hint:'守护者的完整轮廓', effect:{ tags:['shield'] } },
    { id:'rangedweapon', label:'弓或枪', hint:'保持距离的猎手感', effect:{ tags:['rangedweapon'] } },
    { id:'staff', label:'法杖与法器', hint:'让法术成为主角', effect:{ tags:['staff'] } },
  ]},
  { id:'pace', category:'feel', eyebrow:'手感 03 · 操作节奏', title:'你希望双手有多忙？', description:'没有高低之分，只看长期是否舒服。', options:[
    { id:'fast', label:'高速连按', hint:'几乎不想停手', effect:{ metrics:{ pace:5 } } },
    { id:'steady', label:'稳定循环', hint:'持续有事做，但不慌乱', effect:{ metrics:{ pace:3 } } },
    { id:'heavy', label:'少而有力', hint:'更重视单次技能反馈', effect:{ metrics:{ pace:2 } } },
  ]},
  { id:'effects', category:'looks', eyebrow:'颜值 04 · 技能特效', title:'哪种画面让你更愿意一直玩？', description:'选择你最不容易看腻的视觉节奏。', options:[
    { id:'radiant', label:'明亮华丽', hint:'圣光、星光与醒目法阵', effect:{ tags:['radiant'] } },
    { id:'dark', label:'黑暗压迫', hint:'暗影、鲜血与虚空侵蚀', effect:{ tags:['dark','shadow','void'] } },
    { id:'natural', label:'自然灵动', hint:'流水、叶片、雷霆与野性', effect:{ tags:['nature','elemental'] } },
    { id:'explosive', label:'爆炸感强', hint:'大数字与强烈命中特效', effect:{ tags:['explosive'], metrics:{ burst:5 } } },
    { id:'subtle', label:'干净克制', hint:'武器动作清晰，不满屏闪光', effect:{ tags:['subtle','martial'] } },
  ]},
  { id:'complexity', category:'feel', eyebrow:'手感 04 · 学习成本', title:'你愿意同时关注多少信息？', description:'包括资源、触发、持续效果和冷却窗口。', options:[
    { id:'simple', label:'越直观越好', hint:'快速上手，少看监控', effect:{ metrics:{ complexity:2 } } },
    { id:'medium', label:'适量管理', hint:'愿意学习一套清晰优先级', effect:{ metrics:{ complexity:3 } } },
    { id:'deep', label:'越有深度越好', hint:'享受规划与多线管理', effect:{ metrics:{ complexity:5 } } },
  ]},
  { id:'identity', category:'looks', eyebrow:'颜值 05 · 角色呈现', title:'战斗时需要看见自己的幻化吗？', description:'有些职业的核心乐趣正是变形或伙伴。', options:[
    { id:'face', label:'必须看见角色', hint:'幻化与武器始终是主角', effect:{ tags:['plate','robe','martial'] } },
    { id:'transform', label:'变身才够酷', hint:'接受形态覆盖角色外观', effect:{ tags:['shape','transform'] } },
    { id:'pet', label:'伙伴更重要', hint:'让宠物或召唤物撑起画面', effect:{ tags:['pet'] } },
    { id:'any', label:'都可以', hint:'只要整体主题够统一', effect:{} },
  ]},
  { id:'mobility', category:'feel', eyebrow:'手感 05 · 移动需求', title:'你有多在意机动性？', description:'位移越强，通常越容易修正站位。', options:[
    { id:'high', label:'必须非常灵活', hint:'冲锋、闪现、边走边打', effect:{ metrics:{ mobility:5 } } },
    { id:'medium', label:'够用就好', hint:'有一两个可靠位移', effect:{ metrics:{ mobility:3 } } },
    { id:'low', label:'站得住就行', hint:'可以用机动换厚重或射程', effect:{ metrics:{ mobility:1 } } },
  ]},
  { id:'damage', category:'feel', eyebrow:'手感 06 · 战斗反馈', title:'哪种获胜方式最让你满足？', description:'它会决定循环最有乐趣的部分。', options:[
    { id:'burst', label:'抓住时机爆发', hint:'短时间打出高峰', effect:{ metrics:{ burst:5, sustained:2 }, tags:['explosive'] } },
    { id:'sustain', label:'稳定持续压制', hint:'整场保持顺滑输出', effect:{ metrics:{ burst:2, sustained:5 } } },
    { id:'dot', label:'经营持续效果', hint:'铺场、流血、疾病或召唤', effect:{ tags:['dot','pet'], metrics:{ complexity:5, sustained:5 } } },
    { id:'support', label:'帮助全队变强', hint:'工具、增益与救场同样重要', effect:{ tags:['support'], roles:['support','healer','tank'] } },
  ]},
]

const indifferentOption = {
  id: 'any',
  label: '我无所谓',
  hint: '这一题不限制专精，并计入职业探索倾向',
  effect: {},
}

export const questions: Question[] = baseQuestions.map((question) => ({
  ...question,
  options: [...question.options.filter((option) => option.id !== 'any'), indifferentOption],
}))
