import type { Question } from '../types'

const questionBank: Question[] = [
  { id:'cosmic-force', category:'looks', group:'power', eyebrow:'颜值 · 宇宙力量', title:'哪一种宇宙力量最让你心动？', description:'它们是魔兽宇宙的六大原力；元素与龙族魔法会在后面单独询问。可多选。', options:[
    { id:'light', label:'圣光', hint:'信念、治愈与炽金审判', accent:'#ffe9a6', effect:{ tags:['light','radiant'] } },
    { id:'void', label:'虚空 / 暗影', hint:'低语、触须与不可知的紫黑深渊', accent:'#8d5bd8', effect:{ tags:['void','shadow','dark'] } },
    { id:'order', label:'秩序 / 奥术', hint:'符文、几何法阵与可计算的魔法', accent:'#65c7ff', effect:{ tags:['arcane','order'] } },
    { id:'disorder', label:'混乱 / 邪能', hint:'以生命为燃料的翠绿毁灭能量', accent:'#61ff3e', effect:{ tags:['fel','dark'] } },
    { id:'life', label:'生命 / 自然', hint:'生长、荒野、翡翠梦境与轮回', accent:'#62d26f', effect:{ tags:['life','nature'] } },
    { id:'death', label:'死亡', hint:'灵魂、亡灵、鲜血、凋零与冥界', accent:'#a9bed1', effect:{ tags:['death','plague','dark'] } },
  ]},
  { id:'elements', category:'looks', group:'power', eyebrow:'颜值 · 元素之力', title:'如果元素回应你，你想先听见谁？', description:'水、火、土、风是实体世界的基础元素；它们不等同于“自然”或“奥术”。', options:[
    { id:'water', label:'水', hint:'治疗、潮汐、冰霜与适应', accent:'#54bfff', effect:{ tags:['water','frost','elemental'] } },
    { id:'fire', label:'火', hint:'毁灭、热情与迅猛爆发', accent:'#ff6a3d', effect:{ tags:['fire','elemental','explosive'] } },
    { id:'earth', label:'土', hint:'岩石、护盾、耐久与稳重', accent:'#b68a4f', effect:{ tags:['earth','elemental','shield'] } },
    { id:'air', label:'风', hint:'闪电、速度、自由与变化', accent:'#d9f6ff', effect:{ tags:['air','storm','elemental','agile'] } },
  ]},
  { id:'dragonflight', category:'looks', group:'power', eyebrow:'颜值 · 龙族传承', title:'五色巨龙里，哪一种传承最对胃口？', description:'红龙掌生命，蓝龙掌奥术，绿龙连接梦境，青铜龙守时间，黑龙守大地。', options:[
    { id:'red', label:'红龙 · 生命与烈焰', hint:'炽热龙火既能带来生命，也能带来毁灭', accent:'#d94a42', effect:{ tags:['dragon-red','life','fire','dragon'] } },
    { id:'blue', label:'蓝龙 · 奥术', hint:'聚焦、压倒性的秩序魔法', accent:'#4b8ee8', effect:{ tags:['dragon-blue','arcane','order','dragon'] } },
    { id:'green', label:'绿龙 · 梦境与自然', hint:'滋养生命、翡翠梦境与自然之力', accent:'#4bb463', effect:{ tags:['dragon-green','life','nature','dragon'] } },
    { id:'bronze', label:'青铜龙 · 时间', hint:'预见、回溯与改变时间线', accent:'#d0a54d', effect:{ tags:['dragon-bronze','time','dragon','support'] } },
    { id:'black', label:'黑龙 · 大地', hint:'岩土、护甲与强化盟友', accent:'#77716e', effect:{ tags:['dragon-black','earth','dragon','support'] } },
  ]},
  { id:'silhouette', category:'looks', group:'body', eyebrow:'颜值 · 战斗轮廓', title:'你想以什么姿态站在战场上？', description:'不用知道职业名，选你愿意长时间看着的角色轮廓。', options:[
    { id:'plate', label:'重甲骑士', hint:'厚重板甲、正面压迫感', effect:{ tags:['plate'] } },
    { id:'robe', label:'长袍施法者', hint:'经典法系轮廓，让法术成为主角', effect:{ tags:['robe','staff'] } },
    { id:'agile', label:'轻甲游侠', hint:'紧凑、敏捷、动作幅度大', effect:{ tags:['agile'] } },
    { id:'shape', label:'变身形态', hint:'巨熊、猎豹、恶魔或龙人', effect:{ tags:['shape','transform'] } },
    { id:'pet', label:'伙伴成群', hint:'野兽、亡灵或恶魔陪你作战', effect:{ tags:['pet'] } },
  ]},
  { id:'weapon', category:'looks', group:'gear', eyebrow:'颜值 · 武器偏好', title:'你最想围绕什么武器收集幻化？', description:'可同时选几种；结果会寻找能覆盖这些武器幻想的专精。', options:[
    { id:'twohand', label:'双手大武器', hint:'大剑、战斧、长柄', effect:{ tags:['twohand'] } },
    { id:'dual', label:'双持武器', hint:'高速、对称、有攻击性', effect:{ tags:['dual'] } },
    { id:'shield', label:'盾牌', hint:'守护者的完整轮廓', effect:{ tags:['shield'] } },
    { id:'rangedweapon', label:'弓或枪', hint:'纯粹猎手与远程武器反馈', effect:{ tags:['rangedweapon'] } },
    { id:'staff', label:'法杖与法器', hint:'让施法动作与魔法特效成为主角', effect:{ tags:['staff','robe'] } },
  ]},
  { id:'spell-palette', category:'looks', group:'effects', eyebrow:'颜值 · 技能色盘', title:'哪些技能配色让你最不容易看腻？', description:'颜色旁边有文字说明，不需要先认识法术图标。', options:[
    { id:'sun', label:'金白圣辉', hint:'圣光、祝福与神圣法阵', swatches:[{label:'金',color:'#ffd76a'},{label:'白',color:'#fff5d5'}], effect:{ tags:['light','radiant'] } },
    { id:'astral', label:'蓝紫星界', hint:'奥术、星辰、时间与虚空边缘', swatches:[{label:'蓝',color:'#55b9ff'},{label:'紫',color:'#a671ff'}], effect:{ tags:['arcane','order','time','void'] } },
    { id:'wild', label:'翠绿生命', hint:'叶片、梦境、自然与治疗', swatches:[{label:'翠',color:'#66d06f'},{label:'青',color:'#54d8b1'}], effect:{ tags:['life','nature'] } },
    { id:'infernal', label:'猩红与邪绿', hint:'烈焰、鲜血、邪能与强烈爆炸', swatches:[{label:'红',color:'#ef574a'},{label:'邪绿',color:'#69f04b'}], effect:{ tags:['fire','fel','blood','explosive'] } },
    { id:'gloom', label:'黑紫幽影', hint:'暗影、死亡、诅咒与虚空侵蚀', swatches:[{label:'黑',color:'#44375a'},{label:'紫',color:'#8255c9'}], effect:{ tags:['dark','shadow','void','death'] } },
    { id:'steel', label:'钢铁与火花', hint:'武器动作清晰，不依赖满屏法术', swatches:[{label:'钢',color:'#aeb5bf'},{label:'火花',color:'#f2bb65'}], effect:{ tags:['martial','subtle'] } },
  ]},
  { id:'identity', category:'looks', group:'body', eyebrow:'颜值 · 角色呈现', title:'战斗时，你想把视觉焦点放在哪里？', description:'变形与召唤物会弱化角色本体的幻化存在感。', options:[
    { id:'self', label:'角色与幻化必须清楚', hint:'护甲和武器始终是画面主角', effect:{ tags:['plate','robe','martial'] } },
    { id:'transform', label:'形态变化才够酷', hint:'接受外形覆盖常规幻化', effect:{ tags:['shape','transform'] } },
    { id:'pet', label:'伙伴撑起画面', hint:'喜欢宠物、亡灵或恶魔围绕自己', effect:{ tags:['pet'] } },
  ]},
  { id:'combat-motion', category:'looks', group:'effects', eyebrow:'颜值 · 动作语言', title:'哪类动作反馈最有“这就是我”的感觉？', description:'选动作，不用先知道技能名字。', options:[
    { id:'heavy', label:'沉重蓄力与砸击', hint:'每一下都强调重量和命中', effect:{ tags:['twohand','plate','explosive'], metrics:{ pace:3.2, burst:9 } } },
    { id:'combo', label:'高速连段与位移', hint:'翻滚、突进、双持与连续命中', effect:{ tags:['dual','agile'], metrics:{ pace:9, mobility:9 } } },
    { id:'casting', label:'站定引导大法术', hint:'读条、法阵和完整施法动作', effect:{ tags:['staff','robe'], metrics:{ pace:3.2, burst:9 } } },
    { id:'flow', label:'边走边打的流动感', hint:'移动不会轻易打断战斗节奏', effect:{ tags:['agile'], metrics:{ mobility:9, pace:7.1 } } },
  ]},
  { id:'fantasy-tone', category:'looks', group:'fantasy', eyebrow:'颜值 · 人设气质', title:'你希望别人第一眼把你认成什么？', description:'它只决定幻想倾向，不评价阵营或善恶。', options:[
    { id:'guardian', label:'可靠的守护者', hint:'盾牌、祝福、治疗或坚韧身躯', effect:{ tags:['shield','light','support','selfheal'] } },
    { id:'scholar', label:'精密的学者', hint:'掌握规则、时间、奥术与复杂知识', effect:{ tags:['arcane','order','time','staff'] } },
    { id:'outcast', label:'危险的禁忌者', hint:'借用邪能、虚空、死亡或诅咒', effect:{ tags:['fel','void','death','dark'] } },
    { id:'wild', label:'荒野的同行者', hint:'野兽、自然、元素与形态变化', effect:{ tags:['life','nature','elemental','pet','shape'] } },
    { id:'champion', label:'只靠武技的冠军', hint:'钢铁、拳脚、弓枪与潜行技巧', effect:{ tags:['martial','subtle'] } },
  ]},
  { id:'sound-impact', category:'looks', group:'effects', eyebrow:'颜值 · 声音反馈', title:'你更想听见哪种战斗声音？', description:'技能音效也是长期手感的一部分。', options:[
    { id:'clang', label:'盾击、刀刃与金属撞击', hint:'清晰、直接、有物理重量', effect:{ tags:['martial','plate','shield'] } },
    { id:'boom', label:'雷鸣、爆炸与龙吼', hint:'每轮爆发都很有存在感', effect:{ tags:['storm','fire','dragon','explosive'] } },
    { id:'whisper', label:'低语、灵魂与暗影回响', hint:'压抑、神秘、持续侵蚀', effect:{ tags:['void','shadow','death','dot'] } },
    { id:'chime', label:'圣歌、法术脉冲与自然回声', hint:'明亮、清脆、富有魔法感', effect:{ tags:['light','arcane','life','radiant'] } },
  ]},

  { id:'role', category:'feel', group:'role', required:true, eyebrow:'手感 · 团队职责', title:'你愿意在队伍里承担哪些职责？', description:'这是玩法匹配中最重要的问题；如果有多个方向，直接多选。', options:[
    { id:'tank', label:'保护队友', hint:'引导敌人、规划减伤与站位', effect:{ roles:['tank'] } },
    { id:'healer', label:'治疗队友', hint:'预判伤害、处理危机', effect:{ roles:['healer'] } },
    { id:'damage', label:'专注输出', hint:'近战或远程都可以', effect:{ roles:['melee','ranged'] } },
    { id:'support', label:'强化团队', hint:'放大队友表现，并在关键时刻补位', effect:{ roles:['support'], tags:['support'] } },
  ]},
  { id:'difficulty', category:'feel', group:'learning', required:true, eyebrow:'手感 · 上手难度', title:'你希望多快进入“会玩”的状态？', description:'这里说的是 12.x 核心循环的入门门槛，不是职业强度。', options:[
    { id:'easy', label:'十分钟就能开打', hint:'规则直观，失误后容易修正', effect:{ metrics:{ difficulty:1.8 } } },
    { id:'learn', label:'愿意练一两个晚上', hint:'先学优先级，再逐步理解细节', effect:{ metrics:{ difficulty:5.0 } } },
    { id:'hard', label:'难一点才有成就感', hint:'接受更高起步门槛与同时决策', effect:{ metrics:{ difficulty:8.2 } } },
  ]},
  { id:'ceiling', category:'feel', group:'learning', required:true, eyebrow:'手感 · 操作上限', title:'玩久以后，你想留下多少钻研空间？', description:'上限高表示熟练后仍能靠规划、反应或团队判断继续进步。', options:[
    { id:'relaxed', label:'稳定发挥就满足', hint:'不追求大量隐藏优化', effect:{ metrics:{ ceiling:3.0 } } },
    { id:'room', label:'有一些进阶空间', hint:'主循环清楚，也能继续打磨', effect:{ metrics:{ ceiling:6.2 } } },
    { id:'mastery', label:'越能钻研越好', hint:'喜欢长期练习与极限优化', effect:{ metrics:{ ceiling:8.7 } } },
  ]},
  { id:'range', category:'feel', group:'position', eyebrow:'手感 · 作战距离', title:'你愿意在哪些距离战斗？', description:'想象自己在首领战里的默认站位，可多选。', options:[
    { id:'melee', label:'贴身近战', hint:'追着目标，命中反馈直接', effect:{ ranges:['melee'] } },
    { id:'ranged', label:'远程作战', hint:'观察全场，保持距离', effect:{ ranges:['ranged'] } },
    { id:'mid', label:'灵活中距离', hint:'靠近与拉开都很常见', effect:{ ranges:['mid'] } },
  ]},
  { id:'pace', category:'feel', group:'tempo', eyebrow:'手感 · 操作节奏', title:'你能长期接受哪些按键节奏？', description:'没有高低之分，选择你觉得舒服的所有速度。', options:[
    { id:'fast', label:'高速连按', hint:'几乎不想停手', effect:{ metrics:{ pace:8.8 } } },
    { id:'steady', label:'稳定循环', hint:'持续有事做，但不慌乱', effect:{ metrics:{ pace:5.7 } } },
    { id:'heavy', label:'少而有力', hint:'更重视单次技能反馈', effect:{ metrics:{ pace:3.0 } } },
  ]},
  { id:'tracking', category:'feel', group:'learning', eyebrow:'手感 · 信息密度', title:'你愿意同时关注多少信息？', description:'资源、触发、持续效果和冷却窗口都会占用注意力。', options:[
    { id:'simple', label:'越少越好', hint:'专心看战场，不想盯很多监控', effect:{ metrics:{ difficulty:2.0, ceiling:3.8 } } },
    { id:'medium', label:'适量管理', hint:'一套清晰优先级刚刚好', effect:{ metrics:{ difficulty:5.2, ceiling:6.5 } } },
    { id:'deep', label:'越多越有趣', hint:'享受规划与多线管理', effect:{ metrics:{ difficulty:8.2, ceiling:8.8 } } },
  ]},
  { id:'mobility', category:'feel', group:'position', eyebrow:'手感 · 移动需求', title:'你有多在意机动性？', description:'位移强更容易修正站位；厚重职业可能把预算花在别处。', options:[
    { id:'high', label:'必须非常灵活', hint:'冲锋、闪现、边走边打', effect:{ metrics:{ mobility:8.8 } } },
    { id:'medium', label:'够用就好', hint:'一两个可靠位移即可', effect:{ metrics:{ mobility:5.4 } } },
    { id:'low', label:'站得住就行', hint:'可以用机动换厚重、射程或工具', effect:{ metrics:{ mobility:2.4 } } },
  ]},
  { id:'damage', category:'feel', group:'tempo', eyebrow:'手感 · 战斗反馈', title:'哪些获胜方式最让你满足？', description:'可多选；系统会寻找同时覆盖这些反馈的专精。', options:[
    { id:'burst', label:'抓住时机爆发', hint:'短时间打出明显高峰', effect:{ metrics:{ burst:8.8, sustained:3.2 }, tags:['explosive'] } },
    { id:'sustain', label:'稳定持续压制', hint:'整场保持顺滑输出', effect:{ metrics:{ burst:3.2, sustained:8.8 } } },
    { id:'dot', label:'经营持续效果', hint:'铺场、流血、疾病或召唤', effect:{ tags:['dot','pet'], metrics:{ sustained:8.5 } } },
    { id:'support', label:'帮助全队变强', hint:'增益、控制、打断与救场同样重要', effect:{ tags:['support'], metrics:{ utility:8.8 } } },
  ]},
  { id:'planning', category:'feel', group:'decision', eyebrow:'手感 · 决策方式', title:'你喜欢怎么做出正确操作？', description:'有些专精重时间轴，有些更重即时反应。', options:[
    { id:'plan', label:'提前规划', hint:'记住事件，预留资源和技能', effect:{ metrics:{ difficulty:7.2, ceiling:8.4 }, tags:['dot','support'] } },
    { id:'react', label:'临场反应', hint:'看到触发、血线或危险立刻行动', effect:{ metrics:{ pace:8.0, ceiling:7.8 } } },
    { id:'routine', label:'稳定执行', hint:'把可靠循环做得又稳又准', effect:{ metrics:{ difficulty:3.5, ceiling:6.0 } } },
  ]},
  { id:'forgiveness', category:'feel', group:'learning', eyebrow:'手感 · 失误容错', title:'按错一个关键技能时，你希望后果多严重？', description:'这会同时影响生存和循环恢复感。', options:[
    { id:'safe', label:'最好很快补救', hint:'不想一次手滑毁掉整轮循环', effect:{ metrics:{ survivability:7.6, difficulty:3.2 } } },
    { id:'fair', label:'有代价但能追回', hint:'失误需要处理，但不至于崩盘', effect:{ metrics:{ survivability:5.8, difficulty:5.5 } } },
    { id:'sharp', label:'高风险才刺激', hint:'愿意为精确执行承担明显损失', effect:{ metrics:{ survivability:3.8, ceiling:8.6 } } },
  ]},
  { id:'pet-management', category:'feel', group:'control', eyebrow:'手感 · 伙伴管理', title:'你愿意让宠物或召唤物参与多少？', description:'“喜欢伙伴”与“喜欢管理伙伴”不是一回事。', options:[
    { id:'many', label:'越多越热闹', hint:'喜欢召唤、指挥和收集伙伴', effect:{ tags:['pet'] } },
    { id:'one', label:'一位固定搭档', hint:'接受简单的宠物控制', effect:{ tags:['pet','nature'] } },
    { id:'none', label:'我想完全亲自战斗', hint:'不想担心宠物路径或召唤窗口', effect:{ tags:['martial','subtle'] } },
  ]},
  { id:'resource', category:'feel', group:'control', eyebrow:'手感 · 资源循环', title:'哪些资源玩法会让你觉得顺手？', description:'用日常语言描述，不需要认识职业资源名称。', options:[
    { id:'build-spend', label:'积攒后一次花掉', hint:'目标明确、爆发节点清楚', effect:{ metrics:{ burst:8.0 } } },
    { id:'steady-flow', label:'边获得边持续使用', hint:'循环连贯，很少长时间等待', effect:{ metrics:{ pace:7.8, sustained:8.0 } } },
    { id:'charges', label:'管理几组独立充能', hint:'喜欢规划冷却、层数与窗口', effect:{ metrics:{ difficulty:7.0, ceiling:8.2 } } },
  ]},
  { id:'target-count', category:'feel', group:'control', eyebrow:'手感 · 目标处理', title:'敌人一多起来，你更喜欢怎么处理？', description:'选择所有听起来舒服的方式。', options:[
    { id:'cleave', label:'主目标顺带打周围', hint:'不用频繁切换，动作干净', effect:{ tags:['explosive'], metrics:{ difficulty:3.5 } } },
    { id:'spread', label:'给很多目标分别铺效果', hint:'享受多线经营与覆盖', effect:{ tags:['dot'], metrics:{ difficulty:7.8, ceiling:8.2 } } },
    { id:'burst-aoe', label:'聚在一起瞬间清场', hint:'等待窗口，再一次爆开', effect:{ metrics:{ burst:8.8 } } },
  ]},
  { id:'team-tools', category:'feel', group:'role', eyebrow:'手感 · 团队工具', title:'除了本职工作，你愿意替队伍操多少心？', description:'打断、驱散、控制、减伤和救援都属于团队功能。', options:[
    { id:'toolbox', label:'工具越多越好', hint:'愿意记住并主动使用冷门按钮', effect:{ metrics:{ utility:8.8, ceiling:8.0 }, tags:['support'] } },
    { id:'some', label:'留几张关键底牌', hint:'常用工具清楚可靠就好', effect:{ metrics:{ utility:6.0 } } },
    { id:'focus', label:'先把核心循环做好', hint:'不想承担太多额外职责', effect:{ metrics:{ utility:3.0 } } },
  ]},
  { id:'content', category:'feel', group:'context', eyebrow:'手感 · 常玩内容', title:'你更可能把时间花在哪里？', description:'它不按版本强度推荐，只用来理解你偏爱的战斗环境。', options:[
    { id:'raid', label:'大型团本', hint:'长时间轴、固定机制与团队配合', effect:{ metrics:{ ceiling:8.0, utility:7.5 } } },
    { id:'dungeon', label:'地下城 / 大秘境', hint:'频繁小战斗、打断、控制与路线变化', effect:{ metrics:{ mobility:7.3, utility:8.3 } } },
    { id:'pvp', label:'PvP', hint:'对手不可预测，控制和生存很重要', effect:{ metrics:{ survivability:8.0, utility:8.5, ceiling:8.7 } } },
    { id:'world', label:'任务、探索与单人内容', hint:'自给自足、移动方便、随时开打', effect:{ metrics:{ survivability:7.8, mobility:7.5 } } },
  ]},
]

const indifferentOption = { id:'any', label:'我无所谓', hint:'与其他选项互斥；本题不限制专精，并计入职业探索倾向', effect:{} }

export const questions: Question[] = questionBank.map((question) => ({ ...question, options:[...question.options.filter((option) => option.id !== 'any'), indifferentOption] }))

const shuffle = <T,>(items: T[]) => {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }
  return next
}

const onePerGroup = (items: Question[]) => shuffle([...new Set(items.map((item) => item.group))]).map((group) => shuffle(items.filter((item) => item.group === group))[0])

export function createQuestionSet(): Question[] {
  const required = questions.filter((question) => question.required)
  const looks = onePerGroup(questions.filter((question) => question.category === 'looks')).slice(0, 5)
  const feel = onePerGroup(questions.filter((question) => question.category === 'feel' && !question.required && !['role','learning'].includes(question.group))).slice(0, 5)
  const left = shuffle(looks)
  const right = shuffle([...required, ...feel])
  const session: Question[] = []
  while (left.length || right.length) {
    if (left.length) session.push(left.shift()!)
    if (right.length) session.push(right.shift()!)
  }
  return session
}
