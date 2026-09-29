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
    o('instant', '宁可用一串瞬发把伤害打出去', '读条让我坐立不安', { wrath:2 }, { metrics:{ pace:8.5, burst:8 } }),
    o('commit', '稳稳读完，时机对了才有价值', '准备越充分，收获越确定', { pride:1, greed:1 }, { metrics:{ pace:5.5, sustained:8 } }),
    o('handoff', '交给队友，我换个轻松的活', '能省一步就省一步', { sloth:2 }, { metrics:{ pace:4.5, difficulty:3.5 } }),
    o('pose', '读条时欣赏自己的施法姿势', '这个抬手角度我练过', { lust:2 }, { tags:['robe','staff'], metrics:{ pace:5.5 } }),
  ]}),
  q({ id:'queue-wait', slot:1, group:'等待耐心', category:'feel', context:'地下城', eyebrow:'排队', title:'排了二十分钟，还没进本。', description:'这段时间你在做什么？', options:[
    o('requeue', '反复重排、换职责，越等越烦', '等待本身就是一种惩罚', { wrath:2, envy:1 }, { metrics:{ pace:8.5, mobility:8 } }),
    o('stock', '去拍卖行把食物药水囤满', '进本前一样都不能缺', { gluttony:2, greed:1 }, { metrics:{ sustained:8, survivability:7.5 } }),
    o('idle', '挂着去做别的，进了再说', '反正急也没用', { sloth:2 }, { metrics:{ difficulty:3.5, pace:5 } }),
    o('barber', '去理发店把发型和肤色又调了一遍', '排队时间就是化妆时间', { lust:2 }, { tags:['plate','robe','no-pet'] }),
  ]}),
  q({ id:'cooldown-gap', slot:1, group:'等待耐心', category:'feel', context:'PvP', eyebrow:'冷却', title:'你的大招还有 40 秒冷却。', description:'这 40 秒你会怎么过？', options:[
    o('press-all', '能按的全部按一遍，一秒不闲', '手停下来就浑身难受', { wrath:2 }, { metrics:{ pace:9, burst:7.5 } }),
    o('setup', '慢慢铺好伤害，等大招一起爆', '所有准备都为那一刻', { pride:1, greed:1 }, { tags:['dot'], metrics:{ sustained:8.5, ceiling:8.3 } }),
    o('coast', '普通攻击就好，等它转好', '好东西值得等', { sloth:2 }, { metrics:{ pace:4.5, difficulty:3 } }),
  ]}),

  // 2 · 团队担当：愿意为队伍承担什么
  q({ id:'lead-silence', slot:2, group:'团队担当', category:'feel', context:'团本', eyebrow:'指挥', title:'开荒没人指挥，全团沉默了五秒。', description:'你会？', options:[
    o('lead', '我来，拉怪站位都听我的', '节奏在我手里才安心', { pride:2 }, { roles:['tank'] }),
    o('guard', '我盯着血线，谁出事我兜底', '队友倒下我会不舒服', {}, { roles:['healer'] }),
    o('damage', '我只管把伤害打满', '各司其职，我负责输出', { greed:2 }, { roles:['melee','ranged'] }),
    o('follow', '等有人喊了再动', '指挥这种事让别人来', { sloth:2 }, { metrics:{ difficulty:3.5 } }),
    o('voice', '开麦——主要想让大家听听我的声音', '指挥是其次，声线是重点', { lust:2, pride:1 }, { roles:['tank'] }),
  ]}),
  q({ id:'role-swap', slot:2, group:'团队担当', category:'feel', context:'地下城', eyebrow:'补位', title:'队伍缺人，队长问你能不能换职责。', description:'你的回答是？', options:[
    o('fill', '缺什么我补什么', '什么位置我都想试', { greed:1 }, { roles:['healer','support'] }),
    o('dps', '不换，我就是来打输出的', '输出位才是我的位置', { pride:1, greed:1 }, { roles:['melee','ranged'] }),
    o('tank', '我去当坦克，节奏我来定', '与其等别人，不如自己拉', { wrath:1, pride:1 }, { roles:['tank'] }),
    o('crush-heal', '如果那位好看的坦克缺治疗，我马上转', '治疗对象决定职业选择', { lust:2 }, { roles:['healer'] }),
  ]}),
  q({ id:'team-buff', slot:2, group:'团队担当', category:'feel', context:'社交', eyebrow:'取舍', title:'一个技能能让全队变强，但你的个人数字会变小。', description:'你会用吗？', options:[
    o('use', '当然用，队伍赢了就是我赢了', '团队的高光也算我的', {}, { roles:['support','healer'], metrics:{ utility:8.8 } }),
    o('skip', '不用，统计必须好看', '别人记住的是数字', { envy:2, greed:1 }, { metrics:{ utility:5.5, burst:8.5 } }),
    o('forget', '想起来就按，想不起来就算了', '多一个按键多一份负担', { sloth:2 }, { metrics:{ difficulty:3.5, utility:6.5 } }),
  ]}),

  // 3 · 镜中自我：在意别人看见什么样的自己
  q({ id:'screen-focus', slot:3, group:'镜中自我', category:'looks', context:'日常', eyebrow:'视觉焦点', title:'战斗时屏幕上最显眼的应该是？', description:'想象你在看自己的录像。', options:[
    o('outfit', '我精心搭配的那套幻化', '每一件都是我挑的', { lust:2 }, { tags:['plate','robe','no-pet'] }),
    o('form', '一只帅气的变身形态', '变身才是我的样子', { lust:1, pride:1 }, { tags:['shape','transform'] }),
    o('spells', '看不清我没关系，技能炸得漂亮就好', '光影本身就是主角', { pride:1, wrath:1 }, { tags:['explosive','radiant'] }),
  ]}),
  q({ id:'group-photo', slot:3, group:'镜中自我', category:'looks', context:'家园', eyebrow:'合照', title:'公会要在你家拍一张合照。', description:'你会怎么准备？', options:[
    o('center', '换上最好看的一套，站 C 位', '合照也是舞台', { lust:2, pride:1 }, { tags:['plate','shield','light'] }),
    o('mounts', '召出坐骑和宠物一起入镜', '我的收藏也要露脸', { greed:1, lust:1 }, { tags:['pet','pet-partner'] }),
    o('as-is', '随便站，穿着战斗装就行', '好不好看不影响我', { sloth:2 }, { tags:['martial','agile'] }),
  ]}),
  q({ id:'aura', slot:3, group:'镜中自我', category:'looks', context:'社交', eyebrow:'气场', title:'你觉得最有气场的角色外观是？', description:'只选你愿意天天看的那种。', options:[
    o('heavy', '厚重板甲，披风拖地', '一站出来就知道是谁', { pride:2 }, { tags:['plate','shield','twohand'] }),
    o('light', '轻装贴身，动作利落', '好看来自速度感', { lust:1, wrath:1 }, { tags:['agile','dual','martial'] }),
    o('robe', '长袍法杖，光芒环绕', '让魔法替我说话', { lust:2 }, { tags:['robe','staff','radiant'] }),
  ]}),

  q({ id:'character-creator', slot:3, group:'镜中自我', category:'looks', context:'社交', eyebrow:'捏脸', title:'建新角色时，你在捏脸界面停留了多久？', description:'包括反复切换种族的时间。', options:[
    o('hour', '一个小时起步，耳朵长度都要调到完美', '精灵耳的角度决定一切', { lust:2 }, { tags:['robe','staff','radiant'] }),
    o('muscle', '选最壮的，牛头人和狼人的肌肉线条才叫美', '力量本身就是审美', { lust:1, pride:1 }, { tags:['plate','twohand','nature'] }),
    o('random', '随机一张脸，先玩再说', '反正戴着头盔', { sloth:2 }, { tags:['martial'] }),
  ]}),

  // 4 · 钻研态度：愿意花多少力气学
  q({ id:'guide', slot:4, group:'钻研态度', category:'feel', context:'日常', eyebrow:'攻略', title:'换了一个新专精。', description:'你会先看攻略吗？', options:[
    o('study', '读完整篇，再去木桩练一小时', '不搞懂不舒服', { pride:2 }, { metrics:{ difficulty:7, ceiling:8.8 } }),
    o('skim', '看个一分钟速成就上', '边打边学更快', { wrath:1 }, { metrics:{ difficulty:4.5, ceiling:7.2 } }),
    o('none', '不看，哪个键亮了按哪个', '能打就行', { sloth:2 }, { metrics:{ difficulty:2.8, ceiling:6 } }),
    o('model', '先看这个专精的模型帅不帅，再说攻略', '玩法能学，颜值改不了', { lust:2 }, { tags:['radiant'], metrics:{ difficulty:4.5 } }),
  ]}),
  q({ id:'patch-notes', slot:4, group:'钻研态度', category:'feel', context:'社交', eyebrow:'改动', title:'版本更新，职业改动写了三页。', description:'你的处理方式？', options:[
    o('analyze', '逐条研究，顺便算算收益', '改动就是新的谜题', { pride:2, envy:1 }, { metrics:{ ceiling:8.8, difficulty:6.5 } }),
    o('copy', '等高手总结好了照抄', '站在别人肩膀上', { envy:2 }, { metrics:{ ceiling:7.6, difficulty:5 } }),
    o('ignore', '改就改吧，怎么打都差不多', '版本追不上我也不追', { sloth:2 }, { metrics:{ difficulty:3, ceiling:6.2 } }),
  ]}),
  q({ id:'rotation-size', slot:4, group:'钻研态度', category:'feel', context:'团本', eyebrow:'按键数', title:'一个专精的完整循环要记 12 个键。', description:'你觉得？', options:[
    o('more', '越多越好，这才有意思', '复杂是乐趣的一部分', { pride:2 }, { metrics:{ difficulty:7.8, pace:8 } }),
    o('some', '五个左右刚好', '有变化但别太累', {}, { metrics:{ difficulty:4.8 } }),
    o('few', '三个键能解决最好', '脑子留给聊天', { sloth:2 }, { metrics:{ difficulty:2.6, pace:5 } }),
  ]}),

  // 5 · 冲锋本能：先冲还是先看
  q({ id:'pull-distance', slot:5, group:'冲锋本能', category:'feel', context:'地下城', eyebrow:'开怪', title:'坦克还在拉怪，怪离你还有 20 码。', description:'你的第一反应？', options:[
    o('charge', '直接冲进去，先砍再说', '站在后面我手痒', { wrath:2 }, { ranges:['melee'], metrics:{ mobility:8.5 } }),
    o('wait', '站远点，等它们聚好再轰', '一发打满才划算', { pride:1, greed:1 }, { ranges:['ranged'], metrics:{ burst:8 } }),
    o('middle', '站在中间，哪里需要去哪里', '保持灵活', {}, { ranges:['mid'], metrics:{ mobility:7.5 } }),
    o('peek', '站在治疗旁边，方便看清对面的幻化', '战场也是时装周', { lust:2 }, { ranges:['mid'], tags:['radiant'] }),
  ]}),
  q({ id:'gate-open', slot:5, group:'冲锋本能', category:'feel', context:'PvP', eyebrow:'开门', title:'战场开门了。', description:'你会？', options:[
    o('first', '第一个冲到敌人脸上', '先手就是优势', { wrath:2 }, { ranges:['melee'], metrics:{ mobility:9 } }),
    o('high', '找个高处架好位置输出', '距离就是安全感', { envy:1, pride:1 }, { ranges:['ranged'] }),
    o('pack', '跟着大部队，稳稳混进去', '人多的地方最安全', { sloth:2, gluttony:1 }, { metrics:{ survivability:8, mobility:5 } }),
  ]}),
  q({ id:'dodge', slot:5, group:'冲锋本能', category:'feel', context:'团本', eyebrow:'躲技能', title:'地上突然出现一个大圈。', description:'你怎么出去？', options:[
    o('dash', '位移一按就出去，顺便继续打', '跳来跳去才痛快', { wrath:1, lust:1 }, { metrics:{ mobility:9 } }),
    o('walk-cast', '边走边读条，一点不耽误', '走位也是技术', { pride:2 }, { ranges:['ranged','mid'], metrics:{ mobility:7, ceiling:8.5 } }),
    o('tank-it', '站着硬吃，我血厚', '跑来跑去太累了', { gluttony:2, sloth:1 }, { metrics:{ survivability:8.5, mobility:4 } }),
  ]}),

  // 6 · 比较之心：多在意别人的表现
  q({ id:'after-fight', slot:6, group:'比较之心', category:'feel', context:'团本', eyebrow:'统计', title:'战斗结束，你第一件事做什么？', description:'说实话。', options:[
    o('meter', '打开伤害统计看排名', '我想知道自己在哪', { envy:2 }, { metrics:{ burst:8.5, ceiling:8.5 } }),
    o('deaths', '看看这把有没有少死人', '全队活着最重要', {}, { metrics:{ utility:8.5 } }),
    o('next', '直接下一个，统计与我无关', '打完就算', { sloth:2 }, { metrics:{ difficulty:3.5 } }),
    o('inspect', '观察一下刚才那位队友的装备……和脸', '统计哪有人好看', { lust:2, envy:1 }, { metrics:{ utility:7 } }),
  ]}),
  q({ id:'rival', slot:6, group:'比较之心', category:'feel', context:'社交', eyebrow:'对手', title:'同职业的朋友，数字总比你高一点。', description:'你会？', options:[
    o('study', '研究他的每个按键，下次超过他', '差距就是动力', { envy:2, pride:1 }, { metrics:{ ceiling:8.8, difficulty:6.5 } }),
    o('switch', '换个他没玩的专精，重新比', '不在同一条赛道就不算输', { envy:2 }, { metrics:{ burst:9 }, tags:['explosive'] }),
    o('fine', '他高他的，我玩得开心就行', '游戏不是考试', {}, { metrics:{ survivability:7.5, difficulty:4 } }),
  ]}),
  q({ id:'remembered', slot:6, group:'比较之心', category:'feel', context:'地下城', eyebrow:'被记住', title:'你最希望队友记住你的是？', description:'一场好的地下城之后。', options:[
    o('burst', '那一波爆发把怪直接打没了', '高光时刻要够亮', { envy:1, wrath:1 }, { metrics:{ burst:9 }, tags:['explosive'] }),
    o('save', '关键时刻的一个控制或救人', '没人看见也没关系', { pride:1 }, { metrics:{ utility:9 } }),
    o('clean', '从头到尾一次都没出错', '稳定就是实力', { pride:1 }, { metrics:{ survivability:7.5, sustained:8 } }),
  ]}),

  // 7 · 收藏执念：想拥有什么
  q({ id:'rare-pet', slot:7, group:'收藏执念', category:'looks', context:'日常', eyebrow:'稀有', title:'一只稀有野兽刚刚刷新。', description:'你的心动程度？', options:[
    o('tame', '今天必须抓到，收藏栏就差它', '它应该跟我回家', { greed:2 }, { tags:['pet','pet-partner'] }),
    o('weapon', '比起宠物，我更想要它掉的武器', '武器才是真正的收藏', { greed:1, lust:1 }, { tags:['rangedweapon','dual','twohand'] }),
    o('pass', '让别人去抢吧', '收藏不是我的执念', { sloth:1 }, { tags:['no-pet'] }),
  ]}),
  q({ id:'arsenal', slot:7, group:'收藏执念', category:'looks', context:'家园', eyebrow:'收藏柜', title:'你家收藏柜里最多的是？', description:'摆满墙的那种。', options:[
    o('big', '各种大剑大斧', '越大越有安全感', { greed:1, wrath:1 }, { tags:['twohand','plate'] }),
    o('pairs', '成对的匕首和拳刃', '收藏就要成双', { greed:2 }, { tags:['dual','agile'] }),
    o('staves', '法杖和副手法器', '每一根都有故事', { lust:1, pride:1 }, { tags:['staff','robe'] }),
  ]}),
  q({ id:'favorite-mount', slot:7, group:'收藏执念', category:'looks', context:'社交', eyebrow:'坐骑', title:'你最常骑出来的坐骑是？', description:'主城里最常见到你骑的那只。', options:[
    o('dragon', '稀有掉落的巨龙', '难拿的东西才值得炫', { greed:2, pride:1 }, { tags:['dragon','fire'] }),
    o('beast', '陪了你很多年的野兽', '感情比稀有度重要', {}, { tags:['pet','nature','life'] }),
    o('dark', '恶魔战马或亡灵坐骑', '黑暗的东西更迷人', { envy:1, lust:1 }, { tags:['fel','death','dark'] }),
  ]}),

  // 8 · 失误处理：出错后怎么反应
  q({ id:'stood-in-fire', slot:8, group:'失误处理', category:'feel', context:'地下城', eyebrow:'踩圈', title:'你踩了一个本可以躲开的技能。', description:'接下来？', options:[
    o('selfheal', '没事，我能自己奶回来', '容错高的人不怕失误', { gluttony:1, sloth:1 }, { tags:['selfheal'], metrics:{ survivability:8.5 } }),
    o('defensive', '立刻交减伤，绝不能倒', '每个技能都要用在刀刃上', { pride:1 }, { metrics:{ survivability:7, ceiling:8.5 } }),
    o('whatever', '倒了就倒了，反正伤害打满了', '输出比活着重要', { wrath:2, greed:1 }, { metrics:{ survivability:4.8, burst:8.5 } }),
    o('distracted', '因为在看旁边那位血精灵的发型', '失误都是有原因的', { lust:2 }, { tags:['selfheal'], metrics:{ survivability:7.5 } }),
  ]}),
  q({ id:'wipe-cause', slot:8, group:'失误处理', category:'feel', context:'团本', eyebrow:'复盘', title:'灭团了，原因还不清楚。', description:'你第一个念头？', options:[
    o('me', '先看看是不是我的问题', '先查自己最有用', {}, { metrics:{ survivability:7, utility:7.5 } }),
    o('not-me', '肯定不是我，我数据很好', '证据会替我说话', { pride:2 }, { metrics:{ burst:8, ceiling:8.5 } }),
    o('again', '骂一句，马上再开', '想太多不如多打一把', { wrath:2 }, { metrics:{ pace:8.5 } }),
  ]}),
  q({ id:'low-health', slot:8, group:'失误处理', category:'feel', context:'PvP', eyebrow:'残局', title:'对面残血，但你也只剩三成血。', description:'你会？', options:[
    o('chase', '追！先收掉他再说', '赢面在进攻', { wrath:2 }, { metrics:{ mobility:8.5, survivability:5, burst:8.5 } }),
    o('reset', '先保自己，下一波再来', '活着才有下一波', { sloth:1, gluttony:1 }, { tags:['selfheal'], metrics:{ survivability:8.5 } }),
    o('calc', '算好伤害再决定', '冲动是最贵的失误', { pride:2 }, { metrics:{ ceiling:8.8 } }),
  ]}),

  // 9 · 陪伴方式：一个人还是带着伙伴
  q({ id:'companion', slot:9, group:'陪伴方式', category:'looks', context:'日常', eyebrow:'同行者', title:'你的战斗画面里最好有？', description:'只看画面，不管强弱。', options:[
    o('beast', '一只忠诚的野兽伙伴', '有它在就不孤单', { sloth:1 }, { tags:['pet','pet-partner'] }),
    o('army', '一群听我号令的仆从', '越多越有排面', { pride:2, gluttony:1 }, { tags:['pet-army','death','fel'] }),
    o('alone', '只有我自己', '所有功劳都是我的', { pride:1, greed:1 }, { tags:['no-pet','martial'] }),
  ]}),
  q({ id:'solo-farm', slot:9, group:'陪伴方式', category:'looks', context:'家园', eyebrow:'独自刷', title:'一个人刷家园材料时，你希望？', description:'想象最顺手的那个画面。', options:[
    o('pet-tank', '宠物帮我扛怪，我在后面输出', '体力活交给它', { sloth:2 }, { tags:['pet','rangedweapon'] }),
    o('self', '我自己又打又奶，谁也不需要', '一个人就是一支队伍', { greed:1, pride:1 }, { tags:['selfheal','plate'] }),
    o('blitz', '一路冲过去，怪还没反应就死了', '速度就是效率', { wrath:2 }, { tags:['agile','explosive'] }),
  ]}),
  q({ id:'weekend', slot:9, group:'陪伴方式', category:'looks', context:'社交', eyebrow:'周末', title:'周末你更常出现在哪？', description:'不用考虑奖励。', options:[
    o('team', '和固定队一起打本', '一起赢才好玩', {}, { tags:['support','light'] }),
    o('wild', '一个人在野外闲逛', '自然最治愈', { sloth:1 }, { tags:['nature','life'] }),
    o('duel', '去 PvP 找人切磋', '对手让我更清醒', { wrath:1, envy:1 }, { tags:['shadow','dark','subtle'] }),
  ]}),

  q({ id:'guild-crush', slot:9, group:'陪伴方式', category:'looks', context:'社交', eyebrow:'心动', title:'公会里新来了一位很有魅力的玩家。', description:'你的第一个动作是？', options:[
    o('duo', '立刻邀请双排，职业随对方缺什么', '爱情让人变成辅助', { lust:2 }, { tags:['support','life'] }),
    o('walk-by', '换上最帅的幻化，在对方面前路过三次', '偶遇都是精心安排的', { lust:2, pride:1 }, { tags:['plate','radiant'] }),
    o('carry', '带对方打一把地下城，让数字说话', '实力就是最好的搭讪', { envy:1, pride:1 }, { tags:['explosive'] }),
  ]}),

  // 10 · 贪多程度：一次想吃下多少
  q({ id:'perfect-pull', slot:10, group:'贪多程度', category:'feel', context:'地下城', eyebrow:'拉怪', title:'你心中完美的一波怪是？', description:'以你最舒服的节奏为准。', options:[
    o('room', '整个房间一起拉，一波清完', '越多越过瘾', { gluttony:2, wrath:1 }, { roles:['tank'], metrics:{ sustained:8.5, survivability:8 } }),
    o('two', '两三组，稳一点', '量力而行', {}, { metrics:{ sustained:7 } }),
    o('one', '一个一个来，逐个击破', '精准比数量重要', { pride:1 }, { metrics:{ burst:8.5, sustained:5 } }),
    o('backdrop', '拉多少不重要，特效要铺满全屏', '一群怪只是我的背景板', { lust:2, gluttony:1 }, { tags:['explosive','radiant'], metrics:{ sustained:8 } }),
  ]}),
  q({ id:'feast', slot:10, group:'贪多程度', category:'feel', context:'社交', eyebrow:'大餐', title:'公会大餐上桌了。', description:'你会？', options:[
    o('all', '每样都吃，增益能叠就叠', '全都要', { gluttony:2 }, { tags:['dot'], metrics:{ sustained:8.5 } }),
    o('best', '只吃最对口的那一份', '挑最好的就够', { pride:1 }, { metrics:{ burst:8 } }),
    o('nap', '吃完直接躺', '饱了就该休息', { sloth:2 }, { metrics:{ difficulty:3, survivability:8 } }),
  ]}),
  q({ id:'damage-shape', slot:10, group:'贪多程度', category:'feel', context:'团本', eyebrow:'伤害方式', title:'你更享受哪种伤害方式？', description:'不考虑强弱。', options:[
    o('stack', '铺满持续伤害，看数字慢慢涨', '积累带来的满足感', { gluttony:1, greed:1 }, { tags:['dot'], metrics:{ sustained:9 } }),
    o('spike', '一瞬间把敌人打穿', '要快、要狠', { wrath:2 }, { tags:['explosive'], metrics:{ burst:9 } }),
    o('horde', '召唤物一起上，场面越大越好', '人多势众', { gluttony:2 }, { tags:['pet-army','pet'] }),
  ]}),

  // 11 · 精力分配：愿意投入多少专注
  q({ id:'energy', slot:11, group:'精力分配', category:'feel', context:'日常', eyebrow:'体力', title:'下班后你还剩多少精力玩游戏？', description:'大多数时候。', options:[
    o('full', '满格，今晚要打得很拼', '越累越想赢', { wrath:1, pride:1 }, { metrics:{ pace:8.8, difficulty:7 } }),
    o('half', '一半，能认真但别太累', '松弛有度', {}, { metrics:{ pace:6.5 } }),
    o('low', '只剩一点，最好能躺着玩', '游戏是用来放松的', { sloth:2 }, { metrics:{ pace:4.5, difficulty:3 } }),
    o('wardrobe', '精力全花在换幻化上了', '每天出门前的仪式感', { lust:2, sloth:1 }, { metrics:{ pace:5, difficulty:3.5 } }),
  ]}),
  q({ id:'timers', slot:11, group:'精力分配', category:'feel', context:'团本', eyebrow:'计时条', title:'战斗中你能同时盯几个计时条？', description:'持续效果、冷却、触发都算。', options:[
    o('many', '五个以上也没问题', '多线程是我的强项', { pride:2 }, { tags:['dot'], metrics:{ difficulty:7.5 } }),
    o('few', '两三个刚好', '再多就乱了', {}, { metrics:{ difficulty:5 } }),
    o('zero', '一个都不想看', '看血条就够累了', { sloth:2 }, { metrics:{ difficulty:2.8 } }),
  ]}),
  q({ id:'interrupted', slot:11, group:'精力分配', category:'feel', context:'社交', eyebrow:'分心', title:'战斗中有人突然找你聊天。', description:'你会？', options:[
    o('later', '打完再说，我手停不下来', '专注就要彻底', { wrath:1 }, { metrics:{ pace:9 } }),
    o('both', '边打边回，操作不受影响', '一心二用没问题', { pride:1 }, { metrics:{ difficulty:4.5, survivability:7 } }),
    o('stop', '直接停手回消息', '宠物会帮我打的', { sloth:2 }, { tags:['pet'], metrics:{ pace:4.5 } }),
  ]}),

  // 12 · 高光时刻：希望别人看到什么画面
  q({ id:'finisher', slot:12, group:'高光时刻', category:'looks', context:'团本', eyebrow:'终结一击', title:'终结首领的那一击，画面应该是？', description:'选你最想截图的那一帧。', options:[
    o('light', '一道金光从天而降', '正义就该这么耀眼', { pride:2 }, { tags:['light','radiant'] }),
    o('shadow', '暗影吞没整片区域', '黑暗里才看得清', { envy:2 }, { tags:['shadow','void','dark'] }),
    o('fire', '火焰和爆炸铺满屏幕', '越热闹越好', { wrath:2 }, { tags:['fire','explosive'] }),
    o('freeze', '特效无所谓，定格的姿势必须帅', '截图才是永恒', { lust:2 }, { tags:['agile','dual'] }),
  ]}),
  q({ id:'onlooker', slot:12, group:'高光时刻', category:'looks', context:'地下城', eyebrow:'旁观者', title:'别人看你打本时，你希望他们觉得？', description:'第一印象。', options:[
    o('cool', '这人动作好帅', '好看就是一切', { lust:2 }, { tags:['agile','dual'] }),
    o('solid', '这人好稳', '可靠比花哨重要', { pride:1 }, { tags:['plate','shield'] }),
    o('where', '这人在哪？', '看不见才危险', { envy:1, sloth:1 }, { tags:['subtle','shadow'] }),
  ]}),
  q({ id:'sound', slot:12, group:'高光时刻', category:'looks', context:'PvP', eyebrow:'声音', title:'你最享受哪种战斗声音？', description:'闭上眼听。', options:[
    o('impact', '重击砸在盾上的闷响', '每一下都要有分量', { wrath:1 }, { tags:['twohand','plate'] }),
    o('arcane', '法术吟唱和能量嗡鸣', '秩序感让人安心', { pride:1 }, { tags:['arcane','order','staff'] }),
    o('wild', '野兽咆哮与自然低语', '荒野的声音最真实', { gluttony:1 }, { tags:['nature','pet'] }),
  ]}),

  q({ id:'armor-taste', slot:12, group:'高光时刻', category:'looks', context:'日常', eyebrow:'审美取向', title:'关于幻化，你真实的审美取向是？', description:'这里没有别人，放心说。', options:[
    o('bikini', '布料越少越好，这叫“轻量化护甲”', '敏捷职业的职业素养', { lust:2 }, { tags:['agile','dual','martial'] }),
    o('fullplate', '包得严严实实的全身板甲才最性感', '越神秘越迷人', { lust:2, pride:1 }, { tags:['plate','shield'] }),
    o('flowing', '飘逸长袍，走路要有裙摆', '风一吹就是一幅画', { lust:2 }, { tags:['robe','staff'] }),
  ]}),

  // 13 · 心之所向：最认同的力量
  q({ id:'forbidden', slot:13, group:'心之所向', category:'looks', context:'日常', eyebrow:'禁忌', title:'如果能获得一种禁忌力量，你选？', description:'代价由你承担。', options:[
    o('fel', '邪能：以生命换取力量', '强大值得任何代价', { greed:2, wrath:1 }, { tags:['fel','dark'] }),
    o('void', '虚空：知道不该知道的秘密', '知识就是优势', { envy:2, pride:1 }, { tags:['void','shadow'] }),
    o('death', '死亡：让倒下的敌人为我所用', '一切都能再利用', { gluttony:2 }, { tags:['death','plague','pet-army'] }),
    o('succubus', '魅魔：主要是为了深入研究恶魔学', '学术兴趣，真的', { lust:2, envy:1 }, { tags:['fel','pet','pet-army'] }),
  ]}),
  q({ id:'belief', slot:13, group:'心之所向', category:'looks', context:'社交', eyebrow:'信念', title:'你心底最认同哪种信念？', description:'不需要解释理由。', options:[
    o('justice', '圣光与正义', '对错应该分明', { pride:2 }, { tags:['light','radiant'] }),
    o('balance', '自然平衡', '顺其自然最好', { sloth:1 }, { tags:['nature','life'] }),
    o('storm', '元素的狂野', '力量就该奔放', { wrath:2 }, { tags:['elemental','storm','fire'] }),
    o('beauty', '美即正义：好看的阵营就是对的', '颜值就是立场', { lust:2 }, { tags:['light','radiant','robe'] }),
  ]}),
  q({ id:'legacy', slot:13, group:'心之所向', category:'looks', context:'家园', eyebrow:'传说', title:'你希望被艾泽拉斯记住为？', description:'一百年后的酒馆故事里。', options:[
    o('guardian', '坚不可摧的守护者', '有我在，谁都别想过去', { pride:1 }, { tags:['shield','plate','light'] }),
    o('hunter', '走遍世界的猎人', '地图上每个角落都有我的脚印', { greed:1 }, { tags:['rangedweapon','nature','pet'] }),
    o('archmage', '传说中的大法师', '魔法的顶点属于我', { pride:2 }, { tags:['arcane','time','dragon'] }),
    o('illidan', '伊利丹那样的传奇——主要是身材', '你们这是自寻死路……看我', { lust:2, pride:1 }, { tags:['fel','agile','transform'] }),
  ]}),
]

export function createSinQuestionSet(): SinQuestion[] {
  return Array.from({ length:13 }, (_, index) => {
    const pool = sinQuestions.filter((question) => question.slot === index + 1)
    return pool[Math.floor(Math.random() * pool.length)]
  })
}

export const sinProfiles: SinProfile[] = [
  { key:'pride', name:'傲慢', alias:'追求极致的主导者', verdict:'你想掌控局面，也相信自己能做到最好；复杂的系统不会吓退你，反而是证明自己的舞台。', playstyle:'适合操作上限高、需要规划与判断的专精，以及能主导节奏的坦克位。', confession:'你享受的不是赢，而是“按我的方式赢”。' },
  { key:'greed', name:'贪婪', alias:'回报至上的经营者', verdict:'你在意投入能不能换来看得见的收获，愿意为积累和收藏付出耐心。', playstyle:'适合持续伤害逐步滚起、专注个人输出、以及有收藏乐趣的专精。', confession:'每一点进度都要落进你的口袋里才算数。' },
  { key:'lust', name:'色欲', alias:'审美优先的表现者', verdict:'好看是你长期玩下去的理由；动作、光影和幻化必须让你愿意一直看着。', playstyle:'适合不变身、能完整展示幻化，且技能特效华丽的专精。', confession:'你选职业的第一标准，是这套肩膀配不配这个施法动作。' },
  { key:'envy', name:'嫉妒', alias:'不服输的比较者', verdict:'别人的表现会点燃你；你会研究差距，也会为了高光时刻全力以赴。', playstyle:'适合爆发窗口鲜明、上限高、个人表现容易被看见的专精。', confession:'你在意的不是第几名，而是比“他”高一名。' },
  { key:'wrath', name:'暴怒', alias:'一刻不停的冲锋者', verdict:'你讨厌等待，手必须一直有事做；先手、速度和直接反馈让你最痛快。', playstyle:'适合节奏快、瞬发多、机动强的近战或爆发型专精。', confession:'冷静不是你的减伤，冲锋才是。' },
  { key:'gluttony', name:'暴食', alias:'全都要的承载者', verdict:'你喜欢一次处理更多敌人、叠满增益，也愿意站在人最多的地方扛住一切。', playstyle:'适合群体持续伤害、坦克、高生存或召唤大军的专精。', confession:'一波怪不够，两波刚好开胃。' },
  { key:'sloth', name:'懒惰', alias:'效率至上的省力派', verdict:'你追求用最少的心力换来稳定的体验；游戏是放松，不该变成第二份工作。', playstyle:'适合上手简单、节奏舒缓、容错高或有宠物代劳的专精。', confession:'能让宠物或队友做的事，为什么要亲自动手？' },
]
