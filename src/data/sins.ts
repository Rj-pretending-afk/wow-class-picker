import type { SinProfile, SinQuestion } from '../types'

const neutral = { id:'neutral', label:'我无所谓，命运替我选', hint:'本题不积累罪证', scores:{} }
const withNeutral = (question: Omit<SinQuestion, 'options'> & { options: SinQuestion['options'] }): SinQuestion => ({ ...question, options:[...question.options, neutral] })

export const sinQuestions: SinQuestion[] = [
  withNeutral({ id:'raid-loot', context:'团本', title:'团本掉出一件全场都想要的装备。', description:'你的第一反应是？', options:[
    { id:'mine', label:'它当然应该属于我', hint:'我的提升就是团队提升', scores:{ pride:2, greed:1 } },
    { id:'roll', label:'先把骰子焊死在 100 点', hint:'需求只是礼貌，拥有才是答案', scores:{ greed:2 } },
    { id:'look', label:'先试穿，幻化不好看就算了', hint:'强不强只有一时，好不好看是一辈子', scores:{ lust:2 } },
  ]}),
  withNeutral({ id:'raid-meter', context:'团本', title:'队友的伤害数字突然超过了你。', description:'你会如何保持内心平静？', options:[
    { id:'explain', label:'立刻解释职业机制和战斗环境', hint:'不是我输了，是统计口径不完整', scores:{ pride:2 } },
    { id:'copy', label:'悄悄复制他的天赋和饰品', hint:'你的答案很快就是我的答案', scores:{ envy:2 } },
    { id:'pull', label:'下一把我先开爆发，谁也别拦', hint:'用更大的数字恢复世界秩序', scores:{ wrath:2 } },
  ]}),
  withNeutral({ id:'raid-wipe', context:'团本', title:'今晚已经灭了第七次。', description:'现在最需要什么？', options:[
    { id:'lecture', label:'一场十五分钟复盘演讲', hint:'没有白板，但我可以口述四个阶段', scores:{ pride:2 } },
    { id:'rage', label:'一个更响亮的战斗怒吼', hint:'音量越大，机制越容易', scores:{ wrath:2 } },
    { id:'break', label:'五分钟休息，半小时后回来', hint:'时间在艾泽拉斯流速不同', scores:{ sloth:2 } },
  ]}),
  withNeutral({ id:'dungeon-route', context:'地下城', title:'队友走了一条和攻略不同的路线。', description:'你会怎么处理？', options:[
    { id:'correct', label:'立刻标出他少拉了 0.6%', hint:'路线精度就是人格精度', scores:{ pride:2 } },
    { id:'pullmore', label:'把隔壁两组一起带回来', hint:'路线错误可以用更多怪修正', scores:{ wrath:2, gluttony:1 } },
    { id:'follow', label:'跟着走，省得自己带路', hint:'责任越少，地下城越轻', scores:{ sloth:2 } },
  ]}),
  withNeutral({ id:'dungeon-key', context:'地下城', title:'你刚打完一把完美的大秘境。', description:'下一步是什么？', options:[
    { id:'higher', label:'马上开更高一层', hint:'停下来就等于倒退', scores:{ greed:2, pride:1 } },
    { id:'inspect', label:'检查第一名到底穿了什么', hint:'研究竞争对手也是研究自己', scores:{ envy:2 } },
    { id:'food', label:'先补一桌大餐再说', hint:'钥匙可以降，饱食不能断', scores:{ gluttony:2 } },
  ]}),
  withNeutral({ id:'dungeon-kick', context:'地下城', title:'有人三次忘记打断同一个技能。', description:'第四次读条出现了。', options:[
    { id:'type', label:'先打三个问号再打断', hint:'标点符号也是控制技能', scores:{ wrath:2 } },
    { id:'solo', label:'我全包了，再发打断统计', hint:'必须让大家看见是谁在工作', scores:{ pride:2 } },
    { id:'leave', label:'假装没看见，反正不是我的钥匙', hint:'最低能耗策略启动', scores:{ sloth:2 } },
  ]}),
  withNeutral({ id:'pvp-loss', context:'PvP', title:'竞技场最后一秒输掉了。', description:'你最先怪什么？', options:[
    { id:'balance', label:'职业平衡与匹配系统', hint:'总之不可能是我按慢了', scores:{ pride:2 } },
    { id:'enemy', label:'对面那个职业怎么什么都有', hint:'他有的工具我也应该有', scores:{ envy:2 } },
    { id:'keyboard', label:'键盘承受了不该承受的怒火', hint:'耐久度也是 PvP 数值', scores:{ wrath:2 } },
  ]}),
  withNeutral({ id:'pvp-title', context:'PvP', title:'你看见一位顶级头衔玩家站在主城。', description:'你会？', options:[
    { id:'duel', label:'申请决斗，输赢都说延迟', hint:'尊严必须由红字证明', scores:{ pride:2, wrath:1 } },
    { id:'gear', label:'从头到脚检查他的装备', hint:'我缺的只是同一套配置', scores:{ envy:2, greed:1 } },
    { id:'mog', label:'只关心他的幻化搭不搭头衔', hint:'竞技等级不能挽救配色', scores:{ lust:2 } },
  ]}),
  withNeutral({ id:'pvp-objective', context:'PvP', title:'战场旗子旁边一个人都没有。', description:'而中场正在打得很热闹。', options:[
    { id:'guard', label:'坐在旗边，顺便切出去看视频', hint:'战略性懒惰也是战略', scores:{ sloth:2 } },
    { id:'fight', label:'冲中场，荣誉击杀才是目标', hint:'地图目标只是建议', scores:{ wrath:2, gluttony:1 } },
    { id:'command', label:'在聊天里指挥所有人回来', hint:'真正的领袖通常不亲自跑腿', scores:{ pride:2 } },
  ]}),
  withNeutral({ id:'daily-alts', context:'日常', title:'角色列表已经有十二个满级小号。', description:'你为什么又建了一个？', options:[
    { id:'collect', label:'这个职业的稀有外观还没拿', hint:'收藏列表不能留一个空格', scores:{ greed:2, lust:1 } },
    { id:'friend', label:'朋友转职了，我也不能落后', hint:'别人有的体验我也要有', scores:{ envy:2 } },
    { id:'easy', label:'听说它按键少，适合挂机', hint:'最高效率是少按一个键', scores:{ sloth:2 } },
  ]}),
  withNeutral({ id:'daily-map', context:'日常', title:'地图上同时亮起二十个活动图标。', description:'你会先清哪一个？', options:[
    { id:'all', label:'全部，今天不能留下感叹号', hint:'奖励的价值不重要，拥有才重要', scores:{ greed:2, gluttony:1 } },
    { id:'rare', label:'别人正在刷的稀有', hint:'他能拿到，我也必须拿到', scores:{ envy:2 } },
    { id:'none', label:'先在主城站一会儿再决定', hint:'决定本身已经消耗今日体力', scores:{ sloth:2 } },
  ]}),
  withNeutral({ id:'daily-transmog', context:'日常', title:'出门前发现肩膀和武器不够搭。', description:'距离集合只剩两分钟。', options:[
    { id:'closet', label:'全团等我重做一套幻化', hint:'截图不能留下遗憾', scores:{ lust:2, pride:1 } },
    { id:'mount', label:'顺便再换一只配色坐骑', hint:'既然迟到，就迟到得完整', scores:{ lust:2, sloth:1 } },
    { id:'farm', label:'临时去刷最合适的那把武器', hint:'收藏缺口现在就必须填上', scores:{ greed:2 } },
  ]}),
  withNeutral({ id:'housing-plot', context:'家园', title:'邻居抢先选走了你最喜欢的地块。', description:'你准备如何融入社区？', options:[
    { id:'better', label:'在隔壁造一栋更大的', hint:'窗户必须正对他的自尊', scores:{ envy:2, pride:1 } },
    { id:'buy', label:'开始囤所有可能用到的装饰', hint:'风格以后再定，库存必须先满', scores:{ greed:2 } },
    { id:'dark', label:'把外墙灯照到他家窗户上', hint:'邻里关系需要一点热度', scores:{ wrath:2 } },
  ]}),
  withNeutral({ id:'housing-decor', context:'家园', title:'一件完美装饰要刷旧副本才能拿。', description:'掉率看起来不太友善。', options:[
    { id:'farm', label:'今晚刷到它出现为止', hint:'房子不能接受近似替代品', scores:{ lust:2, greed:1 } },
    { id:'copy', label:'先导入别人同款布局', hint:'灵感和成品只差一个按钮', scores:{ envy:2 } },
    { id:'chair', label:'放一把椅子，宣布极简主义完工', hint:'空白也是一种高级设计', scores:{ sloth:2 } },
  ]}),
  withNeutral({ id:'housing-endeavor', context:'家园', title:'本月社区 Endeavor 还差最后一点进度。', description:'邻居都在等人完成任务。', options:[
    { id:'lead', label:'开麦安排每个人的任务', hint:'社区终于需要我的领导力', scores:{ pride:2 } },
    { id:'rewards', label:'先确认奖励能不能全部拿走', hint:'公共事业也要讲个人回报', scores:{ greed:2 } },
    { id:'later', label:'等别人做完再上线领奖', hint:'合理分工：他们劳动，我验收', scores:{ sloth:2 } },
  ]}),
  withNeutral({ id:'social-mount', context:'社交', title:'朋友骑出一只你没有的稀有坐骑。', description:'你最诚实的反应是？', options:[
    { id:'ugly', label:'先说这配色其实一般', hint:'审美批评是嫉妒的礼服', scores:{ envy:2, lust:1 } },
    { id:'farm', label:'立刻问掉落来源', hint:'明天它也会出现在我的收藏里', scores:{ greed:2 } },
    { id:'own', label:'骑出更稀有的停在旁边', hint:'交流需要一个明确的高下', scores:{ pride:2 } },
  ]}),
  withNeutral({ id:'social-food', context:'社交', title:'公会活动桌上摆满了食物。', description:'距离开打还有十分钟。', options:[
    { id:'taste', label:'每一种都吃一次', hint:'增益不叠加，快乐可以', scores:{ gluttony:2 } },
    { id:'bag', label:'把剩下的都塞进背包', hint:'浪费比贪婪更不可原谅', scores:{ greed:2 } },
    { id:'afk', label:'吃完宣布暂离', hint:'饱腹感需要安静消化', scores:{ sloth:2 } },
  ]}),
  withNeutral({ id:'social-advice', context:'社交', title:'新玩家问了一个很基础的问题。', description:'你打算怎么回答？', options:[
    { id:'essay', label:'写一篇从宇宙观开始的长文', hint:'不能让知识失去展示机会', scores:{ pride:2 } },
    { id:'link', label:'丢一个链接，让他自己研究', hint:'授人以鱼不如节省时间', scores:{ sloth:2 } },
    { id:'compare', label:'顺便说明另一个职业其实更好', hint:'任何问题都能转成职业比较', scores:{ envy:2 } },
  ]}),
]

const shuffle = <T,>(items: T[]) => {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }
  return next
}

export function createSinQuestionSet(): SinQuestion[] {
  const contexts: SinQuestion['context'][] = ['团本','地下城','PvP','日常','家园','社交']
  return shuffle(contexts.flatMap((context) => shuffle(sinQuestions.filter((question) => question.context === context)).slice(0, 2)))
}

export const sinProfiles: SinProfile[] = [
  { key:'pride', name:'傲慢', alias:'首席理论大师', verdict:'你不是在打副本，你是在给全团提供一场未经预约的大师课。', confession:'承认吧：伤害统计只是用来证明你本来就知道答案。', specs:['奥术法师','戒律牧师','敏锐潜行者'] },
  { key:'greed', name:'贪婪', alias:'需求按钮收藏家', verdict:'你的背包永远差一格，收藏进度永远差最后一个。', confession:'你不是真的需要那件装备，你只是不能接受它属于别人。', specs:['狂徒潜行者','恶魔学识术士','兽王猎人'] },
  { key:'lust', name:'色欲', alias:'审美执念化身', verdict:'数值会被热修，幻化与家园截图却会留在群里一辈子。', confession:'你选职业的真正标准，是施法动作能不能配上这套肩膀。', specs:['惩戒圣骑士','噬灭恶魔猎手','火焰法师'] },
  { key:'envy', name:'嫉妒', alias:'隔壁专精观察员', verdict:'只要别人打得更高、住得更美，你就能在十分钟内研究完同款。', confession:'你的主职业不是某个职业，而是“别人刚刚展示的那个”。', specs:['增辉唤魔师','邪恶死亡骑士','生存猎人'] },
  { key:'wrath', name:'暴怒', alias:'问号连发器', verdict:'你相信所有机制都能靠更快的按键和更响的战吼解决。', confession:'冷静不是你的减伤，冲锋才是。', specs:['狂怒战士','浩劫恶魔猎手','增强萨满祭司'] },
  { key:'gluttony', name:'暴食', alias:'团队大餐守护者', verdict:'开荒可以没有进度，但绝不能没有第二桌大餐。', confession:'你对“全部都要”的理解比收藏系统更彻底。', specs:['鲜血死亡骑士','守护德鲁伊','毁灭术士'] },
  { key:'sloth', name:'懒惰', alias:'最低能耗哲学家', verdict:'你追求的不是简单，而是用最少动作获得最完整的艾泽拉斯体验。', confession:'能让宠物、邻居或队友做的事，为什么要亲自动手？', specs:['兽王猎人','惩戒圣骑士','毁灭术士'] },
]
