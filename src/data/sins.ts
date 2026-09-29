import type { AnswerEffect, SinKey, SinOption, SinProfile, SinQuestion } from '../types'

// 七宗罪测试：13 个固定方向，每个方向 3～4 道同类题，每轮每个方向抽 1 题。
// 每个选项同时记录罪名倾向（scores）与由此推断的玩法信号（effect），推荐结果复用正式测试的评分引擎。
// 推理依据：急躁 → 快节奏爆发；懒惰 → 低门槛、慢节奏、高容错；傲慢 → 高上限与掌控；贪婪 → 积累型持续收益；
// 嫉妒 → 爆发与上限、少顾团队；色欲 → 看得见的外观与华丽特效；暴食 → 大范围持续作战与高生存。

type Scores = Partial<Record<SinKey, number>>
const o = (id: string, label: string, hint: string, scores: Scores, effect: AnswerEffect): SinOption => ({ id, label, hint, scores, effect })
const neutral: SinOption = { id:'any', label:'我无所谓', hint:'本题不计入罪证，也不影响推荐', scores:{}, effect:{} }
const q = (question: Omit<SinQuestion, 'options'> & { options: SinOption[] }): SinQuestion => ({ ...question, options:[...question.options, neutral] })

export const sinQuestions: SinQuestion[] = [
  // 1 · 等待耐心：能不能忍受读条与冷却
  q({ id:'wait-cast', slot:1, group:'等待耐心', category:'feel', context:'团本', eyebrow:'读条', title:'一个法术要读 2.5 秒，首领马上转阶段。', description:'那一刻你心里的真实感受是？', options:[
    o('instant', '读条？我这辈子最恨这两个字', '宁可按瞬发按到键盘冒烟', { wrath:2 }, { metrics:{ pace:8.5, burst:8 } }),
    o('commit', '稳稳读完，这一发必须值回票价', '投入的每一秒都要连本带利收回来', { greed:2 }, { metrics:{ pace:5.5, sustained:8 } }),
    o('handoff', '读什么读，让奶妈顺手打一下', '队友的时间也是我的时间', { sloth:2 }, { metrics:{ pace:4.5, difficulty:3.5 } }),
    o('pose', '读条时顺便欣赏自己的腰线', '这个抬手角度我对着镜子练过', { lust:1, pride:1 }, { tags:['robe','staff'], metrics:{ pace:5.5 } }),
  ]}),
  q({ id:'queue-wait', slot:1, group:'等待耐心', category:'feel', context:'地下城', eyebrow:'排队', title:'排了二十分钟，还没进本。', description:'这段时间你在做什么？', options:[
    o('requeue', '狂点排队，顺手在世界频道骂设计师', '二十分钟够我骂完三个策划', { wrath:2, envy:1 }, { metrics:{ pace:8.5, mobility:8 } }),
    o('stock', '去拍卖行把药水食物扫空', '先喂饱自己，再喂饱背包', { gluttony:2, greed:1 }, { metrics:{ sustained:8, survivability:7.5 } }),
    o('idle', '挂着去刷短视频，进本了再说', '反正进本了也是跟着走', { sloth:2 }, { metrics:{ difficulty:3.5, pace:5 } }),
    o('barber', '去理发店第八次改发型', '进本前必须是最帅的那个版本', { lust:1, greed:1 }, { tags:['plate','robe','no-pet'] }),
  ]}),
  q({ id:'cooldown-gap', slot:1, group:'等待耐心', category:'feel', context:'PvP', eyebrow:'冷却', title:'你的大招还有 40 秒冷却。', description:'这 40 秒你会怎么过？', options:[
    o('press-all', '所有键全按一遍，包括上坐骑', '手一停下来我就焦虑', { wrath:2 }, { metrics:{ pace:9, burst:7.5 } }),
    o('setup', '铺好所有伤害，等大招一起收割', '利息滚起来才叫理财', { greed:2 }, { tags:['dot'], metrics:{ sustained:8.5, ceiling:8.3 } }),
    o('coast', '普攻就好，大招转好再说', '输出不够还有别人', { sloth:2 }, { metrics:{ pace:4.5, difficulty:3 } }),
  ]}),

  // 2 · 团队担当：愿意为队伍承担什么
  q({ id:'lead-silence', slot:2, group:'团队担当', category:'feel', context:'团本', eyebrow:'指挥', title:'开荒没人指挥，全团沉默了五秒。', description:'你会？', options:[
    o('lead', '我来，都给我闭嘴听指挥', '民主是灭团的开始', { pride:2 }, { roles:['tank'] }),
    o('guard', '我盯着血线，谁死了算我的', '然后在心里记下每一个踩圈的人', {}, { roles:['healer'] }),
    o('damage', '我只管打伤害，死了别找我', '机制是坦克和治疗的事', { greed:2 }, { roles:['melee','ranged'] }),
    o('follow', '等有人喊了再动，喊了也不一定动', '我是来被带的', { sloth:2 }, { metrics:{ difficulty:3.5 } }),
    o('voice', '开麦——主要让大家听听我的声线', '指挥是借口，撩人是目的', { lust:1, pride:1 }, { roles:['tank'] }),
  ]}),
  q({ id:'role-swap', slot:2, group:'团队担当', category:'feel', context:'地下城', eyebrow:'补位', title:'队伍缺人，队长问你能不能换职责。', description:'你的回答是？', options:[
    o('fill', '缺什么补什么，全职业小号都练了', '小号比公会人数还多', { greed:1, gluttony:1 }, { roles:['healer','support'] }),
    o('dps', '不换，我是来刷数据的', '奶人？那是另一种人生', { greed:1, envy:1 }, { roles:['melee','ranged'] }),
    o('tank', '我去坦，但拉多快我说了算', '跟不上的自己想办法', { wrath:1, gluttony:1 }, { roles:['tank'] }),
    o('crush-heal', '如果坦克是那位漂亮的血精灵，我马上转奶', '专属治疗，其他人自求多福', { lust:2 }, { roles:['healer'] }),
  ]}),
  q({ id:'team-buff', slot:2, group:'团队担当', category:'feel', context:'社交', eyebrow:'取舍', title:'一个技能能让全队变强，但你的个人数字会变小。', description:'你会用吗？', options:[
    o('use', '当然用，团队赢了算我一份', '顺便在频道里提醒大家是谁给的', {}, { roles:['support','healer'], metrics:{ utility:8.8 } }),
    o('skip', '不用，我的统计比你们的命重要', '你们变强关我什么事', { envy:2, greed:1 }, { metrics:{ utility:5.5, burst:8.5 } }),
    o('forget', '想起来就按，想不起来就算了', '反正没人会检查', { sloth:2 }, { metrics:{ difficulty:3.5, utility:6.5 } }),
  ]}),

  // 3 · 镜中自我：在意别人看见什么样的自己
  q({ id:'screen-focus', slot:3, group:'镜中自我', category:'looks', context:'日常', eyebrow:'视觉焦点', title:'战斗时屏幕上最显眼的应该是？', description:'想象你在看自己的录像。', options:[
    o('outfit', '我刷了三个月的那套幻化', '谁挡住我的背影谁就是敌人', { lust:2 }, { tags:['plate','robe','no-pet'] }),
    o('form', '变身之后的我才是真正的我', '人形态只是个过场', { lust:1, pride:1 }, { tags:['shape','transform'] }),
    o('spells', '看不见我没关系，技能要糊满全屏', '队友的光污染投诉我不接受', { wrath:1, gluttony:1 }, { tags:['explosive','radiant'] }),
  ]}),
  q({ id:'group-photo', slot:3, group:'镜中自我', category:'looks', context:'家园', eyebrow:'合照', title:'公会要在你家拍一张合照。', description:'你会怎么准备？', options:[
    o('center', '抢 C 位，换最骚的那一套', '合照就是我的个人写真', { lust:1, pride:1 }, { tags:['plate','shield','light'] }),
    o('mounts', '把所有稀有坐骑都召出来', '让他们知道什么叫收藏家', { greed:2 }, { tags:['pet','pet-partner'] }),
    o('as-is', '随便站，反正我戴着头盔', '别人拍照，我挂机', { sloth:2 }, { tags:['martial','agile'] }),
  ]}),
  q({ id:'aura', slot:3, group:'镜中自我', category:'looks', context:'社交', eyebrow:'气场', title:'你觉得最有气场的角色外观是？', description:'只选你愿意天天看的那种。', options:[
    o('heavy', '厚重板甲，一站就是一堵墙', '靠近我需要预约', { pride:2 }, { tags:['plate','shield','twohand'] }),
    o('light', '紧身皮甲，动作利落', '身材好就该穿少一点', { wrath:1, envy:1 }, { tags:['agile','dual','martial'] }),
    o('robe', '长袍法杖，仙气飘飘', '风一吹，裙摆就是特效', { lust:2 }, { tags:['robe','staff','radiant'] }),
  ]}),

  q({ id:'character-creator', slot:3, group:'镜中自我', category:'looks', context:'社交', eyebrow:'捏脸', title:'建新角色时，你在捏脸界面停留了多久？', description:'包括反复切换种族的时间。', options:[
    o('hour', '一个小时起步，腰围耳朵都要调到完美', '反正要看一辈子', { lust:2 }, { tags:['robe','staff','radiant'] }),
    o('muscle', '选最壮的牛头人，肌肉就是正义', '胸肌大到挡住半个屏幕', { lust:1, gluttony:1 }, { tags:['plate','twohand','nature'] }),
    o('random', '随机一张脸，先玩再说', '丑了就戴头盔', { sloth:1, wrath:1 }, { tags:['martial'] }),
  ]}),

  // 4 · 钻研态度：愿意花多少力气学
  q({ id:'guide', slot:4, group:'钻研态度', category:'feel', context:'日常', eyebrow:'攻略', title:'换了一个新专精。', description:'你会先看攻略吗？', options:[
    o('study', '读完攻略，再去木桩练一小时', '顺便记下所有人的错误，以后用得上', { pride:2 }, { metrics:{ difficulty:7, ceiling:8.8 } }),
    o('skim', '看一分钟视频就上', '剩下的在别人的钥匙里学', { wrath:1 }, { metrics:{ difficulty:4.5, ceiling:7.2 } }),
    o('none', '不看，哪个键亮按哪个', '攻略是给在乎菜不菜的人看的', { sloth:2 }, { metrics:{ difficulty:2.8, ceiling:6 } }),
    o('model', '先看这专精的模型性不性感', '玩法能学，身材改不了', { lust:1, sloth:1 }, { tags:['radiant'], metrics:{ difficulty:4.5 } }),
  ]}),
  q({ id:'patch-notes', slot:4, group:'钻研态度', category:'feel', context:'社交', eyebrow:'改动', title:'版本更新，职业改动写了三页。', description:'你的处理方式？', options:[
    o('analyze', '逐条研究，重点看谁被削了', '别人职业被砍我就开心', { pride:1, envy:2 }, { metrics:{ ceiling:8.8, difficulty:6.5 } }),
    o('copy', '等大佬写完攻略直接抄', '原创能力全用在抄作业上', { envy:2 }, { metrics:{ ceiling:7.6, difficulty:5 } }),
    o('ignore', '改就改，反正我一直垫底', '垫底也是一种稳定', { sloth:2 }, { metrics:{ difficulty:3, ceiling:6.2 } }),
  ]}),
  q({ id:'rotation-size', slot:4, group:'钻研态度', category:'feel', context:'团本', eyebrow:'按键数', title:'一个专精的完整循环要记 12 个键。', description:'你觉得？', options:[
    o('more', '越多越好，最好把键盘按满', '简单的专精配不上我', { pride:2 }, { metrics:{ difficulty:7.8, pace:8 } }),
    o('some', '五个左右刚好', '有变化但别太累', {}, { metrics:{ difficulty:4.8 } }),
    o('few', '三个键能解决最好，一个更好', '另一只手要拿零食', { sloth:2 }, { metrics:{ difficulty:2.6, pace:5 } }),
  ]}),

  // 5 · 冲锋本能：先冲还是先看
  q({ id:'pull-distance', slot:5, group:'冲锋本能', category:'feel', context:'地下城', eyebrow:'开怪', title:'坦克还在拉怪，怪离你还有 20 码。', description:'你的第一反应？', options:[
    o('charge', '直接冲，坦克在哪无所谓', '我就是第二个坦克，也是第一个死的', { wrath:2 }, { ranges:['melee'], metrics:{ mobility:8.5 } }),
    o('wait', '站远点，等怪聚好一发全收', '队友的血量就是我的计时器', { greed:2 }, { ranges:['ranged'], metrics:{ burst:8 } }),
    o('middle', '站在中间，哪里需要去哪里', '保持灵活', {}, { ranges:['mid'], metrics:{ mobility:7.5 } }),
    o('peek', '站在治疗旁边，方便偷看对面的幻化', '打本也要逛街', { lust:1, envy:1 }, { ranges:['mid'], tags:['radiant'] }),
  ]}),
  q({ id:'gate-open', slot:5, group:'冲锋本能', category:'feel', context:'PvP', eyebrow:'开门', title:'战场开门了。', description:'你会？', options:[
    o('first', '第一个冲到敌人脸上', '死了再说，墓地也是起点', { wrath:2 }, { ranges:['melee'], metrics:{ mobility:9 } }),
    o('high', '找高处架位，专挑残血收人头', '击杀榜第一就是我', { envy:2 }, { ranges:['ranged'] }),
    o('pack', '跟着大部队混，别人打我摸', '荣誉值一分不少拿', { sloth:1, gluttony:2 }, { metrics:{ survivability:8, mobility:5 } }),
  ]}),
  q({ id:'dodge', slot:5, group:'冲锋本能', category:'feel', context:'团本', eyebrow:'躲技能', title:'地上突然出现一个大圈。', description:'你怎么出去？', options:[
    o('dash', '位移出去，顺便再位移回来', '反正技能多，不用白不用', { wrath:2 }, { metrics:{ mobility:9 } }),
    o('walk-cast', '边走边读条，一步都不浪费', '走位也是炫技', { pride:2 }, { ranges:['ranged','mid'], metrics:{ mobility:7, ceiling:8.5 } }),
    o('tank-it', '站着硬吃，我血多', '治疗接不住是他的错', { gluttony:2 }, { metrics:{ survivability:8.5, mobility:4 } }),
  ]}),

  // 6 · 比较之心：多在意别人的表现
  q({ id:'after-fight', slot:6, group:'比较之心', category:'feel', context:'团本', eyebrow:'统计', title:'战斗结束，你第一件事做什么？', description:'说实话。', options:[
    o('meter', '立刻看伤害统计，截图发群', '不发群等于没打', { envy:2 }, { metrics:{ burst:8.5, ceiling:8.5 } }),
    o('deaths', '看看谁死了，默默记在小本本上', '秋后算账', {}, { metrics:{ utility:8.5 } }),
    o('next', '直接下一个，统计与我无关', '反正我也不在前十', { sloth:2 }, { metrics:{ difficulty:3.5 } }),
    o('inspect', '观察刚才那位队友的装备……和身材', '统计哪有人好看', { lust:1, envy:2 }, { metrics:{ utility:7 } }),
  ]}),
  q({ id:'rival', slot:6, group:'比较之心', category:'feel', context:'社交', eyebrow:'对手', title:'同职业的朋友，数字总比你高一点。', description:'你会？', options:[
    o('study', '研究他的每个按键，下次踩在他头上', '差距就是我的燃料', { envy:2 }, { metrics:{ ceiling:8.8, difficulty:6.5 } }),
    o('switch', '换个他没玩的专精，重新比', '不在一条赛道就不算输', { envy:2 }, { metrics:{ burst:9 }, tags:['explosive'] }),
    o('fine', '他高他的，我玩我的', '心态好也是一种天赋', {}, { metrics:{ survivability:7.5, difficulty:4 } }),
  ]}),
  q({ id:'remembered', slot:6, group:'比较之心', category:'feel', context:'地下城', eyebrow:'被记住', title:'你最希望队友记住你的是？', description:'一场好的地下城之后。', options:[
    o('burst', '那一波爆发把怪直接蒸发', '高光时刻必须是我', { envy:1, wrath:1 }, { metrics:{ burst:9 }, tags:['explosive'] }),
    o('save', '关键时刻的一个控制或救人', '最好全团都看见', { pride:1 }, { metrics:{ utility:9 } }),
    o('clean', '从头到尾一次都没出错', '然后提醒每一个出错的人', { pride:1 }, { metrics:{ survivability:7.5, sustained:8 } }),
  ]}),

  // 7 · 收藏执念：想拥有什么
  q({ id:'rare-pet', slot:7, group:'收藏执念', category:'looks', context:'日常', eyebrow:'稀有', title:'一只稀有野兽刚刚刷新。', description:'你的心动程度？', options:[
    o('tame', '今天必须抓到，挡路的都是敌人', '抢怪也在所不惜', { greed:2 }, { tags:['pet','pet-partner'] }),
    o('weapon', '比起宠物，更想要它掉的武器', '能卖钱的才叫收藏', { greed:2 }, { tags:['rangedweapon','dual','twohand'] }),
    o('pass', '让别人去抢吧', '收藏太累了', { sloth:1 }, { tags:['no-pet'] }),
  ]}),
  q({ id:'arsenal', slot:7, group:'收藏执念', category:'looks', context:'家园', eyebrow:'收藏柜', title:'你家收藏柜里最多的是？', description:'摆满墙的那种。', options:[
    o('big', '各种大剑大斧', '尺寸很重要', { greed:1, wrath:1 }, { tags:['twohand','plate'] }),
    o('pairs', '成对的匕首和拳刃', '两把总比一把好', { greed:2 }, { tags:['dual','agile'] }),
    o('staves', '法杖和副手法器', '每根都有故事，也都有价钱', { lust:1, greed:1 }, { tags:['staff','robe'] }),
  ]}),
  q({ id:'favorite-mount', slot:7, group:'收藏执念', category:'looks', context:'社交', eyebrow:'坐骑', title:'你最常骑出来的坐骑是？', description:'主城里最常见到你骑的那只。', options:[
    o('dragon', '稀有巨龙，专门停在银行门口', '就是要让穷人看见', { greed:2, envy:1 }, { tags:['dragon','fire'] }),
    o('beast', '陪了你很多年的野兽', '感情比稀有度重要', {}, { tags:['pet','nature','life'] }),
    o('dark', '恶魔战马或亡灵坐骑', '黑暗的东西更迷人', { envy:1, greed:1 }, { tags:['fel','death','dark'] }),
  ]}),

  // 8 · 失误处理：出错后怎么反应
  q({ id:'stood-in-fire', slot:8, group:'失误处理', category:'feel', context:'地下城', eyebrow:'踩圈', title:'你踩了一个本可以躲开的技能。', description:'接下来？', options:[
    o('selfheal', '没事，自己奶回来，顺便再踩一次', '容错高就是用来浪费的', { gluttony:2 }, { tags:['selfheal'], metrics:{ survivability:8.5 } }),
    o('defensive', '立刻交减伤，绝不能倒', '死在圈里比输统计更丢人', { pride:1 }, { metrics:{ survivability:7, ceiling:8.5 } }),
    o('whatever', '倒了就倒了，伤害已经打满', '治疗会复活我的，对吧？', { wrath:2, greed:1 }, { metrics:{ survivability:4.8, burst:8.5 } }),
    o('distracted', '在看旁边那位血精灵的背影', '失误都是有原因的', { lust:1, sloth:1 }, { tags:['selfheal'], metrics:{ survivability:7.5 } }),
  ]}),
  q({ id:'wipe-cause', slot:8, group:'失误处理', category:'feel', context:'团本', eyebrow:'复盘', title:'灭团了，原因还不清楚。', description:'你第一个念头？', options:[
    o('me', '先看看是不是我的问题', '发现不是，松一口气', {}, { metrics:{ survivability:7, utility:7.5 } }),
    o('not-me', '肯定不是我，我数据很好', '是奶妈，永远是奶妈', { pride:2 }, { metrics:{ burst:8, ceiling:8.5 } }),
    o('again', '骂一句，马上再开', '退团是弱者的选择，骂人是强者的', { wrath:2 }, { metrics:{ pace:8.5 } }),
  ]}),
  q({ id:'low-health', slot:8, group:'失误处理', category:'feel', context:'PvP', eyebrow:'残局', title:'对面残血，但你也只剩三成血。', description:'你会？', options:[
    o('chase', '追！死也要拉他垫背', '同归于尽也算赢', { wrath:2 }, { metrics:{ mobility:8.5, survivability:5, burst:8.5 } }),
    o('reset', '先保自己，下一波再来', '活着才能继续蹭', { gluttony:2 }, { tags:['selfheal'], metrics:{ survivability:8.5 } }),
    o('calc', '算好伤害再决定', '冲动是最贵的失误', { pride:2 }, { metrics:{ ceiling:8.8 } }),
  ]}),

  // 9 · 陪伴方式：一个人还是带着伙伴
  q({ id:'companion', slot:9, group:'陪伴方式', category:'looks', context:'日常', eyebrow:'同行者', title:'你的战斗画面里最好有？', description:'只看画面，不管强弱。', options:[
    o('beast', '一只忠诚的野兽伙伴', '它从不嫌我菜', { sloth:1 }, { tags:['pet','pet-partner'] }),
    o('army', '一群听我号令的仆从', '吃饭也要一桌人', { pride:1, gluttony:2 }, { tags:['pet-army','death','fel'] }),
    o('alone', '只有我自己', '分奖励的人越少越好', { greed:2 }, { tags:['no-pet','martial'] }),
  ]}),
  q({ id:'solo-farm', slot:9, group:'陪伴方式', category:'looks', context:'家园', eyebrow:'独自刷', title:'一个人刷家园材料时，你希望？', description:'想象最顺手的那个画面。', options:[
    o('pet-tank', '宠物扛怪，我在后面挂机', '体力活交给它', { sloth:2 }, { tags:['pet','rangedweapon'] }),
    o('self', '我自己又打又奶，谁也不需要', '组队？来分我的材料？', { greed:2 }, { tags:['selfheal','plate'] }),
    o('blitz', '一路冲过去，顺便抢了别人的怪', '速度就是正义', { wrath:2 }, { tags:['agile','explosive'] }),
  ]}),
  q({ id:'weekend', slot:9, group:'陪伴方式', category:'looks', context:'社交', eyebrow:'周末', title:'周末你更常出现在哪？', description:'不用考虑奖励。', options:[
    o('team', '和固定队一起打本', '一起赢才好玩', {}, { tags:['support','light'] }),
    o('wild', '一个人在野外闲逛', '顺便躲开公会的人', { sloth:1 }, { tags:['nature','life'] }),
    o('duel', '去决斗场找人切磋', '专挑装备比我差的', { wrath:1, envy:1 }, { tags:['shadow','dark','subtle'] }),
  ]}),

  q({ id:'guild-crush', slot:9, group:'陪伴方式', category:'looks', context:'社交', eyebrow:'心动', title:'公会里新来了一位很有魅力的玩家。', description:'你的第一个动作是？', options:[
    o('duo', '立刻邀请双排，职业随对方缺什么', '网恋从一次战复开始', { lust:2 }, { tags:['support','life'] }),
    o('walk-by', '换上最骚的幻化，在对方面前路过三次', '偶遇都是精心安排的', { lust:1, envy:1 }, { tags:['plate','radiant'] }),
    o('carry', '带对方打一把，让数字说话', '顺手把伤害统计私聊过去', { envy:2 }, { tags:['explosive'] }),
  ]}),

  // 10 · 贪多程度：一次想吃下多少
  q({ id:'perfect-pull', slot:10, group:'贪多程度', category:'feel', context:'地下城', eyebrow:'拉怪', title:'你心中完美的一波怪是？', description:'以你最舒服的节奏为准。', options:[
    o('room', '整个房间一起拉，一波清完', '治疗跟不上是治疗的问题', { gluttony:2, wrath:1 }, { roles:['tank'], metrics:{ sustained:8.5, survivability:8 } }),
    o('two', '两三组，稳一点', '量力而行', {}, { metrics:{ sustained:7 } }),
    o('one', '一个一个来，逐个击破', '精准比数量重要', { pride:1 }, { metrics:{ burst:8.5, sustained:5 } }),
    o('backdrop', '拉多少不重要，特效要铺满全屏', '一群怪只是我的背景板', { lust:1, gluttony:2 }, { tags:['explosive','radiant'], metrics:{ sustained:8 } }),
  ]}),
  q({ id:'feast', slot:10, group:'贪多程度', category:'feel', context:'社交', eyebrow:'大餐', title:'公会大餐上桌了。', description:'你会？', options:[
    o('all', '每样都吃，吃不下的装包', '大餐是公会的，也是我的', { gluttony:2 }, { tags:['dot'], metrics:{ sustained:8.5 } }),
    o('best', '只吃最贵的那一份', '好东西就该留给我', { greed:1 }, { metrics:{ burst:8 } }),
    o('nap', '吃完直接躺', '饱了就该暂离', { gluttony:1, sloth:1 }, { metrics:{ difficulty:3, survivability:8 } }),
  ]}),
  q({ id:'damage-shape', slot:10, group:'贪多程度', category:'feel', context:'团本', eyebrow:'伤害方式', title:'你更享受哪种伤害方式？', description:'不考虑强弱。', options:[
    o('stack', '铺满持续伤害，看数字慢慢涨', '利滚利的快感', { greed:1, gluttony:2 }, { tags:['dot'], metrics:{ sustained:9 } }),
    o('spike', '一瞬间把敌人打穿', '要快、要狠', { wrath:2 }, { tags:['explosive'], metrics:{ burst:9 } }),
    o('horde', '召唤物一起上，场面越大越好', '人多吃饭香', { gluttony:2 }, { tags:['pet-army','pet'] }),
  ]}),

  // 11 · 精力分配：愿意投入多少专注
  q({ id:'energy', slot:11, group:'精力分配', category:'feel', context:'日常', eyebrow:'体力', title:'下班后你还剩多少精力玩游戏？', description:'大多数时候。', options:[
    o('full', '满格，今晚要打得很拼', '谁拖后腿我骂谁', { wrath:2 }, { metrics:{ pace:8.8, difficulty:7 } }),
    o('half', '一半，能认真但别太累', '松弛有度', {}, { metrics:{ pace:6.5 } }),
    o('low', '只剩一点，最好能躺着玩', '游戏就是用来躺的', { sloth:2 }, { metrics:{ pace:4.5, difficulty:3 } }),
    o('wardrobe', '精力全花在换幻化上了', '打本？什么打本', { lust:2 }, { metrics:{ pace:5, difficulty:3.5 } }),
  ]}),
  q({ id:'timers', slot:11, group:'精力分配', category:'feel', context:'团本', eyebrow:'计时条', title:'战斗中你能同时盯几个计时条？', description:'持续效果、冷却、触发都算。', options:[
    o('many', '五个以上，再加点也行', '多线程是我的强项', { pride:1, gluttony:1 }, { tags:['dot'], metrics:{ difficulty:7.5 } }),
    o('few', '两三个刚好', '再多就乱了', {}, { metrics:{ difficulty:5 } }),
    o('zero', '一个都不想看', '看血条已经是我的极限', { sloth:2 }, { metrics:{ difficulty:2.8 } }),
  ]}),
  q({ id:'interrupted', slot:11, group:'精力分配', category:'feel', context:'社交', eyebrow:'分心', title:'战斗中有人突然找你聊天。', description:'你会？', options:[
    o('later', '打完再说，谁打扰我谁挨骂', '专注就要彻底', { wrath:1 }, { metrics:{ pace:9 } }),
    o('both', '边打边回，操作不受影响', '两边都要', { gluttony:1 }, { metrics:{ difficulty:4.5, survivability:7 } }),
    o('stop', '直接停手回消息', '宠物会帮我打的，队友也会', { sloth:2 }, { tags:['pet'], metrics:{ pace:4.5 } }),
  ]}),

  // 12 · 高光时刻：希望别人看到什么画面
  q({ id:'finisher', slot:12, group:'高光时刻', category:'looks', context:'团本', eyebrow:'终结一击', title:'终结首领的那一击，画面应该是？', description:'选你最想截图的那一帧。', options:[
    o('light', '一道金光从天而降', '正义就该这么耀眼', { pride:2 }, { tags:['light','radiant'] }),
    o('shadow', '暗影吞没整片区域', '黑暗里才看得清', { envy:2 }, { tags:['shadow','void','dark'] }),
    o('fire', '火焰和爆炸铺满屏幕', '越热闹越好', { wrath:1, gluttony:1 }, { tags:['fire','explosive'] }),
    o('freeze', '特效无所谓，定格姿势要够骚', '截图才是永恒', { lust:2 }, { tags:['agile','dual'] }),
  ]}),
  q({ id:'onlooker', slot:12, group:'高光时刻', category:'looks', context:'地下城', eyebrow:'旁观者', title:'别人看你打本时，你希望他们觉得？', description:'第一印象。', options:[
    o('cool', '这人好帅，想加好友', '好看就是一切', { lust:2 }, { tags:['agile','dual'] }),
    o('solid', '这人好稳，想跟着混', '可靠比花哨重要', { pride:1 }, { tags:['plate','shield'] }),
    o('where', '这人在哪？', '看不见的时候最危险', { envy:2 }, { tags:['subtle','shadow'] }),
  ]}),
  q({ id:'sound', slot:12, group:'高光时刻', category:'looks', context:'PvP', eyebrow:'声音', title:'你最享受哪种战斗声音？', description:'闭上眼听。', options:[
    o('impact', '重击砸在盾上的闷响', '每一下都要有分量', { wrath:1 }, { tags:['twohand','plate'] }),
    o('arcane', '法术吟唱和能量嗡鸣', '秩序感让人安心', { pride:1 }, { tags:['arcane','order','staff'] }),
    o('wild', '野兽咆哮与自然低语', '荒野的声音最真实', { gluttony:2 }, { tags:['nature','pet'] }),
  ]}),

  q({ id:'armor-taste', slot:12, group:'高光时刻', category:'looks', context:'日常', eyebrow:'审美取向', title:'关于幻化，你真实的审美取向是？', description:'这里没有别人，放心说。', options:[
    o('bikini', '布料越少越好，这叫“轻量化护甲”', '防御力？我靠闪避', { lust:2 }, { tags:['agile','dual','martial'] }),
    o('fullplate', '包得严严实实的全身板甲才最性感', '越看不见越想看', { lust:1, pride:1 }, { tags:['plate','shield'] }),
    o('flowing', '飘逸长袍，走路要有裙摆', '风一吹，全场安静', { lust:2 }, { tags:['robe','staff'] }),
  ]}),

  // 13 · 心之所向：最认同的力量
  q({ id:'forbidden', slot:13, group:'心之所向', category:'looks', context:'日常', eyebrow:'禁忌', title:'如果能获得一种禁忌力量，你选？', description:'代价由你承担。', options:[
    o('fel', '邪能：拿命换力量', '命是别人的，力量是我的', { greed:2, wrath:1 }, { tags:['fel','dark'] }),
    o('void', '虚空：知道所有人的秘密', '包括他们的伤害统计', { envy:2 }, { tags:['void','shadow'] }),
    o('death', '死亡：倒下的敌人都归我', '连尸体都不浪费', { gluttony:2 }, { tags:['death','plague','pet-army'] }),
    o('succubus', '魅魔：纯粹为了“深入研究恶魔学”', '学术兴趣，真的', { lust:2, envy:1 }, { tags:['fel','pet','pet-army'] }),
  ]}),
  q({ id:'belief', slot:13, group:'心之所向', category:'looks', context:'社交', eyebrow:'信念', title:'你心底最认同哪种信念？', description:'不需要解释理由。', options:[
    o('justice', '圣光与正义', '对错应该分明', { pride:2 }, { tags:['light','radiant'] }),
    o('balance', '自然平衡', '顺其自然最好', { sloth:1 }, { tags:['nature','life'] }),
    o('storm', '元素的狂野', '力量就该奔放', { wrath:2 }, { tags:['elemental','storm','fire'] }),
    o('beauty', '美即正义：好看的阵营就是对的', '丑的都是反派', { lust:2 }, { tags:['light','radiant','robe'] }),
  ]}),
  q({ id:'legacy', slot:13, group:'心之所向', category:'looks', context:'家园', eyebrow:'传说', title:'你希望被艾泽拉斯记住为？', description:'一百年后的酒馆故事里。', options:[
    o('guardian', '坚不可摧的守护者', '有我在，谁都别想过去', { gluttony:1 }, { tags:['shield','plate','light'] }),
    o('hunter', '走遍世界的猎人', '地图上每个角落都有我的脚印', { greed:1 }, { tags:['rangedweapon','nature','pet'] }),
    o('archmage', '传说中的大法师', '魔法的顶点属于我', { pride:2 }, { tags:['arcane','time','dragon'] }),
    o('illidan', '伊利丹那样的传奇——主要是身材', '你们这是自寻死路……看我腹肌', { lust:1, envy:1 }, { tags:['fel','agile','transform'] }),
  ]}),
]

export function createSinQuestionSet(): SinQuestion[] {
  return Array.from({ length:13 }, (_, index) => {
    const pool = sinQuestions.filter((question) => question.slot === index + 1)
    return pool[Math.floor(Math.random() * pool.length)]
  })
}

export const sinProfiles: SinProfile[] = [
  { key:'pride', name:'傲慢', alias:'追求极致的主导者', verdict:'你想掌控局面，也相信自己能做到最好；复杂的系统不会吓退你，反而是证明自己的舞台。', playstyle:'适合操作上限高、需要规划与判断的专精，以及能主导节奏的坦克位。', taglines:['你享受的不是赢，而是看别人按你的方式输。', '你打本不需要指挥，你本身就是指挥。', '在你眼里，伤害统计只是证明你早就知道答案。', '你最常说的一句话是：“听我的。”', '就算灭团，也是全团配不上你的计划。'] },
  { key:'greed', name:'贪婪', alias:'回报至上的经营者', verdict:'你在意投入能不能换来看得见的收获，愿意为积累和收藏付出耐心。', playstyle:'适合持续伤害逐步滚起、专注个人输出、以及有收藏乐趣的专精。', taglines:['Roll 点之前，你已经想好这件装备卖多少钱了。', '你的背包永远差一格，收藏永远差一个。', '需求按钮是你最熟悉的朋友。', '公会银行对你来说是一种自助餐。', '你不是想要它，你是不能接受它属于别人。'] },
  { key:'lust', name:'色欲', alias:'审美优先的表现者', verdict:'好看是你长期玩下去的理由；动作、光影和幻化必须让你愿意一直看着。', playstyle:'适合不变身、能完整展示幻化，且技能特效华丽的专精。', taglines:['你选职业的第一标准，是这套肩膀配不配那条腰。', '数值会被削，截图会永存。', '你在理发店花的金币比修装备还多。', '别人打本看机制，你打本看队友。', '你的幻化收藏比你的成就点还高。'] },
  { key:'envy', name:'嫉妒', alias:'不服输的比较者', verdict:'别人的表现会点燃你；你会研究差距，也会为了高光时刻全力以赴。', playstyle:'适合爆发窗口鲜明、上限高、个人表现容易被看见的专精。', taglines:['你不在乎第几名，只在乎比“他”高一名。', '你的主职业永远是“别人刚打第一的那个”。', '你查看别人装备的次数，比查看自己的还多。', '别人成了版本之子，你当晚就练小号。', '你的动力来自别人的伤害统计截图。'] },
  { key:'wrath', name:'暴怒', alias:'一刻不停的冲锋者', verdict:'你讨厌等待，手必须一直有事做；先手、速度和直接反馈让你最痛快。', playstyle:'适合节奏快、瞬发多、机动强的近战或爆发型专精。', taglines:['冷静不是你的减伤，骂人才是你的爆发。', '你的键盘比你的角色更需要治疗。', '读条是对你人格的侮辱。', '你退组的速度比你的冲锋还快。', '问号是你最常用的技能。'] },
  { key:'gluttony', name:'暴食', alias:'全都要的承载者', verdict:'你喜欢一次处理更多敌人、叠满增益，也愿意站在人最多的地方扛住一切。', playstyle:'适合群体持续伤害、坦克、高生存或召唤大军的专精。', taglines:['一波怪不够，两波刚好开胃，三波治疗开始哭。', '你对“全都要”的理解比收藏系统更彻底。', '开荒可以没有进度，但不能没有第二桌大餐。', '你拉怪的方式让坦克怀疑自己的职业。', '你的背包里永远有三十种食物。'] },
  { key:'sloth', name:'懒惰', alias:'效率至上的省力派', verdict:'你追求用最少的心力换来稳定的体验；游戏是放松，不该变成第二份工作。', playstyle:'适合上手简单、节奏舒缓、容错高或有宠物代劳的专精。', taglines:['能让宠物、队友或奶妈做的事，为什么要亲自动手？', '你玩的不是游戏，是挂机模拟器。', '你的最佳操作是跟着走。', '攻略很长，你的耐心很短。', '你追求的不是简单，而是躺着也能赢。'] },
]

// 双罪组合标语：并列或第二名接近第一时显示。键为两个罪名按 sinProfiles 顺序连接。
export const sinPairTaglines: Record<string, string> = {
  'pride+greed':'你想赢，也想全都拿走——还要大家夸你赢得漂亮。',
  'pride+lust':'你要当全场最强，也要当全场最帅。',
  'pride+envy':'你看不起所有人，又偷偷研究每个人的装备。',
  'pride+wrath':'你指挥全团，也骂全团。',
  'pride+gluttony':'你要一个人扛下全场，然后告诉所有人是你扛的。',
  'pride+sloth':'你懂所有机制，但懒得亲自去做。',
  'greed+lust':'你收藏的每一件幻化，都是为了截图时更好看。',
  'greed+envy':'别人有的你都要有，别人没有的你更要有。',
  'greed+wrath':'装备没 Roll 到的那一刻，你的怒气条满了。',
  'greed+gluttony':'背包、银行、邮箱，全部塞满才安心。',
  'greed+sloth':'你想要所有奖励，但最好有人帮你刷。',
  'lust+envy':'别人的幻化比你好看，这比输统计还难受。',
  'lust+wrath':'你冲得最快，因为要让所有人看清你的身材。',
  'lust+gluttony':'特效越多越美，怪越多越好看。',
  'lust+sloth':'你愿意花三小时换幻化，但不愿意花三分钟看攻略。',
  'envy+wrath':'被超越的那一刻，你的键盘承受了一切。',
  'envy+gluttony':'别人拉两波，你就要拉三波。',
  'envy+sloth':'你嫉妒大佬，但懒得变成大佬。',
  'wrath+gluttony':'一次拉满，全部打死，打不死就骂。',
  'wrath+sloth':'你想速通，但只想按一个键。',
  'gluttony+sloth':'吃饱了就躺，躺够了再吃。',
}
