import type { Question } from '../types'

const questionBank: Question[] = [
  { id:'cosmic-force', category:'looks', slot:1, group:'力量幻想', eyebrow:'颜值 · 宇宙力量', title:'哪一种宇宙力量最让你心动？', description:'它们是魔兽宇宙的六大原力；元素与龙族魔法会在后面单独询问。可多选。', options:[
    { id:'light', label:'圣光', hint:'信念、治愈与炽金审判', accent:'#ffe9a6', effect:{ tags:['light','radiant'] } },
    { id:'void', label:'虚空 / 暗影', hint:'低语、触须与不可知的紫黑深渊', accent:'#8d5bd8', effect:{ tags:['void','shadow','dark'] } },
    { id:'order', label:'秩序 / 奥术', hint:'符文、几何法阵与可计算的魔法', accent:'#65c7ff', effect:{ tags:['arcane','order'] } },
    { id:'disorder', label:'混乱 / 邪能', hint:'以生命为燃料的翠绿毁灭能量', accent:'#61ff3e', effect:{ tags:['fel','dark'] } },
    { id:'life', label:'生命 / 自然', hint:'生长、荒野、翡翠梦境与轮回', accent:'#62d26f', effect:{ tags:['life','nature'] } },
    { id:'death', label:'死亡', hint:'灵魂、亡灵、鲜血、凋零与冥界', accent:'#a9bed1', effect:{ tags:['death','plague','dark'] } },
  ]},
  { id:'elements', category:'looks', slot:1, group:'力量幻想', eyebrow:'颜值 · 元素之力', title:'如果元素回应你，你想先听见谁？', description:'水、火、土、风是实体世界的基础元素；它们不等同于“自然”或“奥术”。', options:[
    { id:'water', label:'水', hint:'治疗、潮汐、冰霜与适应', accent:'#54bfff', effect:{ tags:['water','frost','elemental'] } },
    { id:'fire', label:'火', hint:'毁灭、热情与迅猛爆发', accent:'#ff6a3d', effect:{ tags:['fire','elemental','explosive'] } },
    { id:'earth', label:'土', hint:'岩石、护盾、耐久与稳重', accent:'#b68a4f', effect:{ tags:['earth','elemental','shield'] } },
    { id:'air', label:'风', hint:'闪电、速度、自由与变化', accent:'#d9f6ff', effect:{ tags:['air','storm','elemental','agile'] } },
  ]},
  { id:'dragonflight', category:'looks', slot:1, group:'力量幻想', eyebrow:'颜值 · 龙族传承', title:'五色巨龙里，哪一种传承最对胃口？', description:'红龙掌生命，蓝龙掌奥术，绿龙连接梦境，青铜龙守时间，黑龙守大地。', options:[
    { id:'red', label:'红龙 · 生命与烈焰', hint:'炽热龙火既能带来生命，也能带来毁灭', accent:'#d94a42', effect:{ tags:['dragon-red','life','fire','dragon'] } },
    { id:'blue', label:'蓝龙 · 奥术', hint:'聚焦、压倒性的秩序魔法', accent:'#4b8ee8', effect:{ tags:['dragon-blue','arcane','order','dragon'] } },
    { id:'green', label:'绿龙 · 梦境与自然', hint:'滋养生命、翡翠梦境与自然之力', accent:'#4bb463', effect:{ tags:['dragon-green','life','nature','dragon'] } },
    { id:'bronze', label:'青铜龙 · 时间', hint:'预见、回溯与改变时间线', accent:'#d0a54d', effect:{ tags:['dragon-bronze','time','dragon','support'] } },
    { id:'black', label:'黑龙 · 大地', hint:'岩土、护甲与强化盟友', accent:'#77716e', effect:{ tags:['dragon-black','earth','dragon','support'] } },
  ]},
  { id:'silhouette', category:'looks', slot:3, group:'角色轮廓', eyebrow:'颜值 · 战斗轮廓', title:'你想以什么姿态站在战场上？', description:'不用知道职业名，选你愿意长时间看着的角色轮廓。', options:[
    { id:'plate', label:'重甲骑士', hint:'厚重板甲、正面压迫感', effect:{ tags:['plate'] } },
    { id:'robe', label:'长袍施法者', hint:'经典法系轮廓，让法术成为主角', effect:{ tags:['robe','staff'] } },
    { id:'agile', label:'轻甲游侠', hint:'紧凑、敏捷、动作幅度大', effect:{ tags:['agile'] } },
    { id:'shape', label:'变身形态', hint:'巨熊、猎豹、恶魔或龙人', effect:{ tags:['shape','transform'] } },
    { id:'pet', label:'伙伴成群', hint:'野兽、亡灵或恶魔陪你作战', effect:{ tags:['pet'] } },
  ]},
  { id:'weapon', category:'looks', slot:5, group:'装备幻想', eyebrow:'颜值 · 武器偏好', title:'你最想围绕什么武器收集幻化？', description:'可同时选几种；结果会寻找能覆盖这些武器幻想的专精。', options:[
    { id:'twohand', label:'双手大武器', hint:'大剑、战斧、长柄', effect:{ tags:['twohand'] } },
    { id:'dual', label:'双持武器', hint:'高速、对称、有攻击性', effect:{ tags:['dual'] } },
    { id:'shield', label:'盾牌', hint:'守护者的完整轮廓', effect:{ tags:['shield'] } },
    { id:'rangedweapon', label:'弓或枪', hint:'纯粹猎手与远程武器反馈', effect:{ tags:['rangedweapon'] } },
    { id:'staff', label:'法杖与法器', hint:'让施法动作与魔法特效成为主角', effect:{ tags:['staff','robe'] } },
  ]},
  { id:'spell-palette', category:'looks', slot:7, group:'视听特效', eyebrow:'颜值 · 技能色盘', title:'哪些技能配色让你最不容易看腻？', description:'颜色旁边有文字说明，不需要先认识法术图标。', options:[
    { id:'sun', label:'金白圣辉', hint:'圣光、祝福与神圣法阵', swatches:[{label:'金',color:'#ffd76a'},{label:'白',color:'#fff5d5'}], effect:{ tags:['light','radiant'] } },
    { id:'astral', label:'蓝紫星界', hint:'奥术、星辰、时间与虚空边缘', swatches:[{label:'蓝',color:'#55b9ff'},{label:'紫',color:'#a671ff'}], effect:{ tags:['arcane','order','time','void'] } },
    { id:'wild', label:'翠绿生命', hint:'叶片、梦境、自然与治疗', swatches:[{label:'翠',color:'#66d06f'},{label:'青',color:'#54d8b1'}], effect:{ tags:['life','nature'] } },
    { id:'infernal', label:'猩红与邪绿', hint:'烈焰、鲜血、邪能与强烈爆炸', swatches:[{label:'红',color:'#ef574a'},{label:'邪绿',color:'#69f04b'}], effect:{ tags:['fire','fel','blood','explosive'] } },
    { id:'gloom', label:'黑紫幽影', hint:'暗影、死亡、诅咒与虚空侵蚀', swatches:[{label:'黑',color:'#44375a'},{label:'紫',color:'#8255c9'}], effect:{ tags:['dark','shadow','void','death'] } },
    { id:'steel', label:'钢铁与火花', hint:'武器动作清晰，不依赖满屏法术', swatches:[{label:'钢',color:'#aeb5bf'},{label:'火花',color:'#f2bb65'}], effect:{ tags:['martial','subtle'] } },
  ]},
  { id:'identity', category:'looks', slot:3, group:'角色轮廓', eyebrow:'颜值 · 角色呈现', title:'战斗时，你想把视觉焦点放在哪里？', description:'变形与召唤物会弱化角色本体的幻化存在感。', options:[
    { id:'self', label:'角色与幻化必须清楚', hint:'护甲和武器始终是画面主角', effect:{ tags:['plate','robe','martial'] } },
    { id:'transform', label:'形态变化才够酷', hint:'接受外形覆盖常规幻化', effect:{ tags:['shape','transform'] } },
    { id:'pet', label:'伙伴撑起画面', hint:'喜欢宠物、亡灵或恶魔围绕自己', effect:{ tags:['pet'] } },
  ]},
  { id:'combat-motion', category:'looks', slot:7, group:'视听特效', eyebrow:'颜值 · 动作语言', title:'哪类动作反馈最有“这就是我”的感觉？', description:'选动作，不用先知道技能名字。', options:[
    { id:'heavy', label:'沉重蓄力与砸击', hint:'每一下都强调重量和命中', effect:{ tags:['twohand','plate','explosive'], metrics:{ pace:3.2, burst:9 } } },
    { id:'combo', label:'高速连段与位移', hint:'翻滚、突进、双持与连续命中', effect:{ tags:['dual','agile'], metrics:{ pace:9, mobility:9 } } },
    { id:'casting', label:'站定引导大法术', hint:'读条、法阵和完整施法动作', effect:{ tags:['staff','robe'], metrics:{ pace:3.2, burst:9 } } },
    { id:'flow', label:'边走边打的流动感', hint:'移动不会轻易打断战斗节奏', effect:{ tags:['agile'], metrics:{ mobility:9, pace:7.1 } } },
  ]},
  { id:'fantasy-tone', category:'looks', slot:13, group:'角色气质', eyebrow:'颜值 · 人设气质', title:'你希望别人第一眼把你认成什么？', description:'它只决定幻想倾向，不评价阵营或善恶。', options:[
    { id:'guardian', label:'可靠的守护者', hint:'盾牌、祝福、治疗或坚韧身躯', effect:{ tags:['shield','light','support','selfheal'] } },
    { id:'scholar', label:'精密的学者', hint:'掌握规则、时间、奥术与复杂知识', effect:{ tags:['arcane','order','time','staff'] } },
    { id:'outcast', label:'危险的禁忌者', hint:'借用邪能、虚空、死亡或诅咒', effect:{ tags:['fel','void','death','dark'] } },
    { id:'wild', label:'荒野的同行者', hint:'野兽、自然、元素与形态变化', effect:{ tags:['life','nature','elemental','pet','shape'] } },
    { id:'champion', label:'只靠武技的冠军', hint:'钢铁、拳脚、弓枪与潜行技巧', effect:{ tags:['martial','subtle'] } },
  ]},
  { id:'sound-impact', category:'looks', slot:7, group:'视听特效', eyebrow:'颜值 · 声音反馈', title:'你更想听见哪种战斗声音？', description:'技能音效也是长期手感的一部分。', options:[
    { id:'clang', label:'盾击、刀刃与金属撞击', hint:'清晰、直接、有物理重量', effect:{ tags:['martial','plate','shield'] } },
    { id:'boom', label:'雷鸣、爆炸与龙吼', hint:'每轮爆发都很有存在感', effect:{ tags:['storm','fire','dragon','explosive'] } },
    { id:'whisper', label:'低语、灵魂与暗影回响', hint:'压抑、神秘、持续侵蚀', effect:{ tags:['void','shadow','death','dot'] } },
    { id:'chime', label:'圣歌、法术脉冲与自然回声', hint:'明亮、清脆、富有魔法感', effect:{ tags:['light','arcane','life','radiant'] } },
  ]},

  { id:'role', category:'feel', slot:2, group:'团队定位', required:true, eyebrow:'手感 · 团队职责', title:'你愿意在队伍里承担哪些职责？', description:'这是玩法匹配中最重要的问题；如果有多个方向，直接多选。', options:[
    { id:'tank', label:'保护队友', hint:'引导敌人、规划减伤与站位', effect:{ roles:['tank'] } },
    { id:'healer', label:'治疗队友', hint:'预判伤害、处理危机', effect:{ roles:['healer'] } },
    { id:'damage', label:'专注输出', hint:'近战或远程都可以', effect:{ roles:['melee','ranged'] } },
    { id:'support', label:'强化团队', hint:'放大队友表现，并在关键时刻补位', effect:{ roles:['support'], tags:['support'] } },
  ]},
  { id:'difficulty', category:'feel', slot:9, group:'上手门槛', required:true, eyebrow:'手感 · 上手难度', title:'你希望多快进入“会玩”的状态？', description:'这里说的是 12.x 核心循环的入门门槛，不是职业强度。', options:[
    { id:'easy', label:'十分钟就能开打', hint:'规则直观，失误后容易修正', effect:{ metrics:{ difficulty:1.8 } } },
    { id:'learn', label:'愿意练一两个晚上', hint:'先学优先级，再逐步理解细节', effect:{ metrics:{ difficulty:5.0 } } },
    { id:'hard', label:'难一点才有成就感', hint:'接受更高起步门槛与同时决策', effect:{ metrics:{ difficulty:8.2 } } },
  ]},
  { id:'ceiling', category:'feel', slot:10, group:'操作上限', required:true, eyebrow:'手感 · 操作上限', title:'玩久以后，你想留下多少钻研空间？', description:'上限高表示熟练后仍能靠规划、反应或团队判断继续进步。', options:[
    { id:'relaxed', label:'稳定发挥就满足', hint:'不追求大量隐藏优化', effect:{ metrics:{ ceiling:3.0 } } },
    { id:'room', label:'有一些进阶空间', hint:'主循环清楚，也能继续打磨', effect:{ metrics:{ ceiling:6.2 } } },
    { id:'mastery', label:'越能钻研越好', hint:'喜欢长期练习与极限优化', effect:{ metrics:{ ceiling:8.7 } } },
  ]},
  { id:'range', category:'feel', slot:4, group:'战斗距离', eyebrow:'手感 · 作战距离', title:'你愿意在哪些距离战斗？', description:'想象自己在首领战里的默认站位，可多选。', options:[
    { id:'melee', label:'贴身近战', hint:'追着目标，命中反馈直接', effect:{ ranges:['melee'] } },
    { id:'ranged', label:'远程作战', hint:'观察全场，保持距离', effect:{ ranges:['ranged'] } },
    { id:'mid', label:'灵活中距离', hint:'靠近与拉开都很常见', effect:{ ranges:['mid'] } },
  ]},
  { id:'pace', category:'feel', slot:6, group:'操作节奏', eyebrow:'手感 · 操作节奏', title:'你能长期接受哪些按键节奏？', description:'没有高低之分，选择你觉得舒服的所有速度。', options:[
    { id:'fast', label:'高速连按', hint:'几乎不想停手', effect:{ metrics:{ pace:8.8 } } },
    { id:'steady', label:'稳定循环', hint:'持续有事做，但不慌乱', effect:{ metrics:{ pace:5.7 } } },
    { id:'heavy', label:'少而有力', hint:'更重视单次技能反馈', effect:{ metrics:{ pace:3.0 } } },
  ]},
  { id:'tracking', category:'feel', slot:8, group:'管理密度', eyebrow:'手感 · 信息密度', title:'你愿意同时关注多少信息？', description:'资源、触发、持续效果和冷却窗口都会占用注意力。', options:[
    { id:'simple', label:'越少越好', hint:'专心看战场，不想盯很多监控', effect:{ metrics:{ difficulty:2.0, ceiling:3.8 } } },
    { id:'medium', label:'适量管理', hint:'一套清晰优先级刚刚好', effect:{ metrics:{ difficulty:5.2, ceiling:6.5 } } },
    { id:'deep', label:'越多越有趣', hint:'享受规划与多线管理', effect:{ metrics:{ difficulty:8.2, ceiling:8.8 } } },
  ]},
  { id:'mobility', category:'feel', slot:12, group:'机动容错', eyebrow:'手感 · 移动需求', title:'你有多在意机动性？', description:'位移强更容易修正站位；厚重职业可能把预算花在别处。', options:[
    { id:'high', label:'必须非常灵活', hint:'冲锋、闪现、边走边打', effect:{ metrics:{ mobility:8.8 } } },
    { id:'medium', label:'够用就好', hint:'一两个可靠位移即可', effect:{ metrics:{ mobility:5.4 } } },
    { id:'low', label:'站得住就行', hint:'可以用机动换厚重、射程或工具', effect:{ metrics:{ mobility:2.4 } } },
  ]},
  { id:'damage', category:'feel', slot:11, group:'循环偏好', eyebrow:'手感 · 战斗反馈', title:'哪些获胜方式最让你满足？', description:'可多选；系统会寻找同时覆盖这些反馈的专精。', options:[
    { id:'burst', label:'抓住时机爆发', hint:'短时间打出明显高峰', effect:{ metrics:{ burst:8.8, sustained:3.2 }, tags:['explosive'] } },
    { id:'sustain', label:'稳定持续压制', hint:'整场保持顺滑输出', effect:{ metrics:{ burst:3.2, sustained:8.8 } } },
    { id:'dot', label:'经营持续效果', hint:'铺场、流血、疾病或召唤', effect:{ tags:['dot','pet'], metrics:{ sustained:8.5 } } },
    { id:'support', label:'帮助全队变强', hint:'增益、控制、打断与救场同样重要', effect:{ tags:['support'], metrics:{ utility:8.8 } } },
  ]},
  { id:'planning', category:'feel', slot:11, group:'循环偏好', eyebrow:'手感 · 决策方式', title:'你喜欢怎么做出正确操作？', description:'有些专精重时间轴，有些更重即时反应。', options:[
    { id:'plan', label:'提前规划', hint:'记住事件，预留资源和技能', effect:{ metrics:{ difficulty:7.2, ceiling:8.4 }, tags:['dot','support'] } },
    { id:'react', label:'临场反应', hint:'看到触发、血线或危险立刻行动', effect:{ metrics:{ pace:8.0, ceiling:7.8 } } },
    { id:'routine', label:'稳定执行', hint:'把可靠循环做得又稳又准', effect:{ metrics:{ difficulty:3.5, ceiling:6.0 } } },
  ]},
  { id:'forgiveness', category:'feel', slot:12, group:'机动容错', eyebrow:'手感 · 失误容错', title:'按错一个关键技能时，你希望后果多严重？', description:'这会同时影响生存和循环恢复感。', options:[
    { id:'safe', label:'最好很快补救', hint:'不想一次手滑毁掉整轮循环', effect:{ metrics:{ survivability:7.6, difficulty:3.2 } } },
    { id:'fair', label:'有代价但能追回', hint:'失误需要处理，但不至于崩盘', effect:{ metrics:{ survivability:5.8, difficulty:5.5 } } },
    { id:'sharp', label:'高风险才刺激', hint:'愿意为精确执行承担明显损失', effect:{ metrics:{ survivability:3.8, ceiling:8.6 } } },
  ]},
  { id:'pet-management', category:'feel', slot:8, group:'管理密度', eyebrow:'手感 · 伙伴管理', title:'你愿意让宠物或召唤物参与多少？', description:'“喜欢伙伴”与“喜欢管理伙伴”不是一回事。', options:[
    { id:'many', label:'越多越热闹', hint:'喜欢围绕一批召唤物安排窗口', effect:{ tags:['pet-army'] } },
    { id:'one', label:'一位固定搭档', hint:'接受简单的宠物控制与路径问题', effect:{ tags:['pet-partner'] } },
    { id:'none', label:'我想完全亲自战斗', hint:'不想担心宠物路径或召唤窗口', effect:{ tags:['no-pet'] } },
  ]},
  { id:'resource', category:'feel', slot:11, group:'循环偏好', eyebrow:'手感 · 资源循环', title:'哪些资源玩法会让你觉得顺手？', description:'用日常语言描述，不需要认识职业资源名称。', options:[
    { id:'build-spend', label:'积攒后一次花掉', hint:'目标明确、爆发节点清楚', effect:{ metrics:{ burst:8.0 } } },
    { id:'steady-flow', label:'边获得边持续使用', hint:'循环连贯，很少长时间等待', effect:{ metrics:{ pace:7.8, sustained:8.0 } } },
    { id:'charges', label:'管理几组独立充能', hint:'喜欢规划冷却、层数与窗口', effect:{ metrics:{ difficulty:7.0, ceiling:8.2 } } },
  ]},
  { id:'target-count', category:'feel', slot:8, group:'管理密度', eyebrow:'手感 · 目标处理', title:'敌人一多起来，你更喜欢怎么处理？', description:'选择所有听起来舒服的方式。', options:[
    { id:'cleave', label:'主目标顺带打周围', hint:'不用频繁切换，动作干净', effect:{ tags:['explosive'], metrics:{ difficulty:3.5 } } },
    { id:'spread', label:'给很多目标分别铺效果', hint:'享受多线经营与覆盖', effect:{ tags:['dot'], metrics:{ difficulty:7.8, ceiling:8.2 } } },
    { id:'burst-aoe', label:'聚在一起瞬间清场', hint:'等待窗口，再一次爆开', effect:{ metrics:{ burst:8.8 } } },
  ]},
  { id:'team-tools', category:'feel', slot:2, group:'团队定位', eyebrow:'手感 · 危机职责', title:'队伍突然出问题时，你最想做什么？', description:'用第一反应确认实际职责偏好；可以按顺序多选。', options:[
    { id:'hold', label:'接住敌人，替队友承压', hint:'掌握站位、减伤与仇恨节奏', effect:{ roles:['tank'] } },
    { id:'save', label:'把危险血线重新抬起来', hint:'观察全队并处理突发伤害', effect:{ roles:['healer'] } },
    { id:'finish', label:'尽快解决造成危险的目标', hint:'专注近战或远程输出', effect:{ roles:['melee','ranged'] } },
    { id:'enable', label:'控制场面并强化队友', hint:'让整队更安全、更高效', effect:{ roles:['support'], tags:['support'], metrics:{ utility:8.7 } } },
  ]},
  { id:'content', category:'feel', slot:2, group:'团队定位', eyebrow:'手感 · 成就反馈', title:'哪一种团队高光最让你开心？', description:'不要考虑排队速度，只选你真正愿意重复承担的工作。', options:[
    { id:'tank', label:'稳稳接住首领和整群敌人', hint:'队友可以放心在你身后行动', effect:{ roles:['tank'] } },
    { id:'healer', label:'在团灭边缘救回全队', hint:'用治疗、驱散与减伤扭转局面', effect:{ roles:['healer'] } },
    { id:'damage', label:'把循环与爆发打得漂亮', hint:'输出本身就是主要成就感', effect:{ roles:['melee','ranged'] } },
    { id:'support', label:'让队友的高光因你而发生', hint:'强化、控制、救援与协同', effect:{ roles:['support'], tags:['support'] } },
  ]},
  { id:'armor-presence', category:'looks', slot:3, group:'角色轮廓', eyebrow:'颜值 · 护甲存在感', title:'哪一种护甲气质最像你的角色？', description:'这里只看长期视觉偏好，不代表护甲强度。', options:[
    { id:'fortress', label:'像移动堡垒一样厚重', hint:'板甲、盾牌与宽阔轮廓', effect:{ tags:['plate','shield'] } },
    { id:'adventurer', label:'轻便的冒险者', hint:'皮甲、锁甲与方便行动的装备', effect:{ tags:['agile','martial'] } },
    { id:'mystic', label:'法袍与仪式感', hint:'布料、兜帽、法杖与魔法饰件', effect:{ tags:['robe','staff'] } },
    { id:'form', label:'护甲让位给特殊形态', hint:'更在意熊、豹、恶魔或龙人的轮廓', effect:{ tags:['shape','transform'] } },
  ]},
  { id:'position-pressure', category:'feel', slot:4, group:'战斗距离', eyebrow:'手感 · 站位压力', title:'首领逼你不断换位置时，哪种体验更舒服？', description:'以实际副本中的移动和射程压力来想象。', options:[
    { id:'close', label:'贴着目标一起移动', hint:'接受追怪、绕背和近战范围', effect:{ ranges:['melee'], metrics:{ mobility:7.2 } } },
    { id:'flex', label:'近可攻，退也能继续做事', hint:'喜欢中距离与短暂离开目标仍有按钮', effect:{ ranges:['mid'], metrics:{ mobility:7.8 } } },
    { id:'overview', label:'远处观察全场', hint:'用射程换取更多判断空间', effect:{ ranges:['ranged'], metrics:{ mobility:5.5 } } },
  ]},
  { id:'cast-movement', category:'feel', slot:4, group:'战斗距离', eyebrow:'手感 · 移动施法', title:'移动机制来了，你能接受哪种处理方式？', description:'不同远程专精对读条、瞬发与预留移动技能的依赖不同。', options:[
    { id:'mobile', label:'移动时也要持续行动', hint:'瞬发多、可边走边打或位移丰富', effect:{ metrics:{ mobility:8.8, pace:7.5 }, tags:['agile'] } },
    { id:'planned', label:'提前规划移动窗口', hint:'愿意预留瞬发、充能或短位移', effect:{ metrics:{ mobility:6.0, ceiling:7.8 } } },
    { id:'turret', label:'找好位置站定施法', hint:'接受移动损失，换取大法术反馈', effect:{ ranges:['ranged'], metrics:{ mobility:3.2, burst:8.2 } } },
  ]},
  { id:'weapon-feedback', category:'looks', slot:5, group:'装备幻想', eyebrow:'颜值 · 命中质感', title:'武器命中时，你想看到什么？', description:'从动作和反馈选择，而不是从装备数值选择。', options:[
    { id:'crush', label:'巨型武器砸出重量', hint:'斩击、震地与清楚的停顿感', effect:{ tags:['twohand','explosive'] } },
    { id:'flurry', label:'双持连续切开目标', hint:'快速、多段、左右手交替', effect:{ tags:['dual','agile'] } },
    { id:'block', label:'攻防一体的盾牌', hint:'格挡、盾击与正面承压', effect:{ tags:['shield','plate'] } },
    { id:'shot', label:'弓枪的瞄准与弹道', hint:'远距离命中和弹药感', effect:{ tags:['rangedweapon','martial'] } },
  ]},
  { id:'focus-object', category:'looks', slot:5, group:'装备幻想', eyebrow:'颜值 · 施法媒介', title:'如果不靠普通武器，你想怎样施法？', description:'法系同样会展示武器，但技能视觉的焦点不同。', options:[
    { id:'staff', label:'以法杖或法器引导', hint:'完整施法姿态与传统法师感', effect:{ tags:['staff','robe'] } },
    { id:'hands', label:'力量直接从双手迸发', hint:'武器淡出，让能量与动作成为主角', effect:{ tags:['radiant','elemental','arcane'] } },
    { id:'body', label:'身体本身就是武器', hint:'拳脚、利爪、龙息或恶魔形态', effect:{ tags:['martial','shape','transform','dragon'] } },
    { id:'companions', label:'由伙伴完成攻击', hint:'宠物、亡灵和恶魔构成主要画面', effect:{ tags:['pet'] } },
  ]},
  { id:'input-density', category:'feel', slot:6, group:'操作节奏', eyebrow:'手感 · 按键密度', title:'连续打两分钟，你希望手指是什么状态？', description:'以持续战斗的实际体感来选，不把按键多等同于更强。', options:[
    { id:'rest', label:'有呼吸和观察时间', hint:'允许少量空拍或较长读条', effect:{ metrics:{ pace:3.3 } } },
    { id:'flow', label:'稳定不断档', hint:'大多数公共冷却都有清楚选择', effect:{ metrics:{ pace:6.1 } } },
    { id:'busy', label:'持续高速输入', hint:'资源、触发与短冷却接连出现', effect:{ metrics:{ pace:8.8, difficulty:7.2 } } },
  ]},
  { id:'tempo-shape', category:'feel', slot:6, group:'操作节奏', eyebrow:'手感 · 节奏形状', title:'你偏爱哪种一场战斗的节奏曲线？', description:'这是循环体感，不是当前版本伤害排名。', options:[
    { id:'waves', label:'爆发与休整一波一波', hint:'高峰明显，低谷用于准备下一轮', effect:{ metrics:{ burst:8.7, pace:5.2 } } },
    { id:'constant', label:'从头到尾稳定忙碌', hint:'持续压制、较少明显停顿', effect:{ metrics:{ sustained:8.7, pace:7.8 } } },
    { id:'adaptive', label:'根据触发临场变速', hint:'平时稳定，亮灯时迅速加速', effect:{ metrics:{ pace:7.3, ceiling:7.6 } } },
  ]},
  { id:'first-night', category:'feel', slot:9, group:'上手门槛', eyebrow:'手感 · 第一晚体验', title:'换到一个新专精的第一晚，你期待什么？', description:'按 12.x 当前技能与循环理解成本判断。', options:[
    { id:'immediate', label:'不看攻略也能打得像样', hint:'核心技能关系一眼能懂', effect:{ metrics:{ difficulty:2.0 } } },
    { id:'guide', label:'看一篇指南就能建立循环', hint:'允许少量资源和窗口规则', effect:{ metrics:{ difficulty:5.0 } } },
    { id:'study', label:'愿意查表、练木桩再进本', hint:'复杂规则本身就是乐趣', effect:{ metrics:{ difficulty:8.2 } } },
  ]},
  { id:'entry-friction', category:'feel', slot:9, group:'上手门槛', eyebrow:'手感 · 入门阻力', title:'多少个“必须先记住”的规则不会劝退你？', description:'只衡量开始玩顺的门槛，不衡量高手上限。', options:[
    { id:'few', label:'一两个核心规则', hint:'快速进入战斗，把注意力留给机制', effect:{ metrics:{ difficulty:2.2 } } },
    { id:'several', label:'几条优先级和一个资源循环', hint:'学习量适中，能逐步消化', effect:{ metrics:{ difficulty:5.3 } } },
    { id:'many', label:'多个资源、窗口与例外', hint:'接受一开始频繁查资料', effect:{ metrics:{ difficulty:8.4 } } },
  ]},
  { id:'mastery-reward', category:'feel', slot:10, group:'操作上限', eyebrow:'手感 · 熟练回报', title:'熟练之后，什么进步最让你有成就感？', description:'不同专精的上限可能来自输出、路线、时间轴或团队救场。', options:[
    { id:'execution', label:'把循环执行到近乎无误', hint:'细节、连段和窗口越来越精准', effect:{ metrics:{ ceiling:8.6, pace:7.4 } } },
    { id:'planning', label:'读懂战斗时间轴', hint:'提前安排资源、爆发、治疗或减伤', effect:{ metrics:{ ceiling:8.8, utility:7.4 } } },
    { id:'steady', label:'稳定发挥就已经足够', hint:'不需要太多隐藏技巧仍能完整体验', effect:{ metrics:{ ceiling:3.5 } } },
  ]},
  { id:'optimization-appetite', category:'feel', slot:10, group:'操作上限', eyebrow:'手感 · 优化欲望', title:'攻略写完基础循环后，你还想挖多深？', description:'高上限不一定更难入门，但会留下更多长期优化空间。', options:[
    { id:'baseline', label:'基础循环完整就好', hint:'不追求复杂的边角收益', effect:{ metrics:{ ceiling:3.2 } } },
    { id:'choices', label:'希望天赋和场景有变化', hint:'同一框架下继续调整细节', effect:{ metrics:{ ceiling:6.3 } } },
    { id:'limits', label:'愿意研究到每个机制窗口', hint:'想持续发现更优决策', effect:{ metrics:{ ceiling:8.8 } } },
  ]},
  { id:'danger-response', category:'feel', slot:12, group:'机动容错', eyebrow:'手感 · 危险处理', title:'地上突然出现致命圈时，你最信任什么？', description:'这题同时看移动方式与错误恢复空间。', options:[
    { id:'dash', label:'立刻位移出去', hint:'多段冲刺、闪现或快速移动', effect:{ metrics:{ mobility:8.8 } } },
    { id:'tank', label:'开减伤扛过去', hint:'靠护盾、自疗或防御技能兜底', effect:{ metrics:{ survivability:8.6 } } },
    { id:'position', label:'提前站对位置', hint:'接受机动较弱，以预判减少临时处理', effect:{ metrics:{ mobility:3.5, ceiling:7.8 } } },
  ]},
  { id:'companion-aesthetic', category:'looks', slot:13, group:'角色气质', eyebrow:'颜值 · 同行者', title:'你的角色幻想里需要同行者吗？', description:'宠物、召唤物会明显改变战斗画面的重心。', options:[
    { id:'beast', label:'一位长期野兽伙伴', hint:'一起探索、收集并肩作战', effect:{ tags:['pet','nature','life'] } },
    { id:'army', label:'一支短暂召来的军团', hint:'亡灵、恶魔或大量召唤物压场', effect:{ tags:['pet','death','fel','dark'] } },
    { id:'spirit', label:'图腾、元素或灵体回应', hint:'不是固定宠物，而是力量短暂现身', effect:{ tags:['elemental','spirit','radiant'] } },
    { id:'solo', label:'画面只聚焦我自己', hint:'武器、动作与角色本体最重要', effect:{ tags:['martial','subtle'] } },
  ]},
  { id:'hero-archetype', category:'looks', slot:13, group:'角色气质', eyebrow:'颜值 · 英雄原型', title:'你最想活成哪一种艾泽拉斯角色？', description:'选的是长期人设，而不是善恶阵营。', options:[
    { id:'protector', label:'守住队伍的保护者', hint:'重甲、治疗、祝福与可靠感', effect:{ tags:['shield','light','support','selfheal'] } },
    { id:'hunter', label:'自由行动的猎手', hint:'机动、追踪、武器与野外生存', effect:{ tags:['agile','rangedweapon','pet','nature'] } },
    { id:'mage', label:'掌握规则的施法大师', hint:'知识、法阵、时间与精密控制', effect:{ tags:['staff','robe','arcane','time'] } },
    { id:'forbidden', label:'驾驭禁忌力量的异类', hint:'虚空、邪能、死亡与变形', effect:{ tags:['void','fel','death','transform','dark'] } },
    { id:'fighter', label:'磨炼武技的战斗专家', hint:'不靠宏大宇宙力量也能取胜', effect:{ tags:['martial','subtle','dual','twohand'] } },
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

export function createQuestionSet(): Question[] {
  return Array.from({ length:13 }, (_, index) => {
    const slot = index + 1
    return shuffle(questions.filter((question) => question.slot === slot))[0]
  })
}
