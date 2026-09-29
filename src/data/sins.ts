import type { SinProfile, SinQuestion } from '../types'

const neutral = { id:'neutral', label:'我无所谓，命运替我选', hint:'本题不积累罪证', scores:{} }

export const sinQuestions: SinQuestion[] = [
  { id:'loot', title:'团本掉出一件全场都想要的装备。', description:'你的第一反应是？', options:[
    { id:'mine', label:'它当然应该属于我', hint:'我的提升就是团队提升', scores:{ pride:2, greed:1 } },
    { id:'roll', label:'先把骰子焊死在 100 点', hint:'需求只是礼貌，拥有才是答案', scores:{ greed:2 } },
    { id:'look', label:'先试穿，幻化不好看就算了', hint:'强不强只有一时，好不好看是一辈子', scores:{ lust:2 } }, neutral,
  ]},
  { id:'meter', title:'队友的伤害数字突然超过了你。', description:'你会如何保持内心平静？', options:[
    { id:'explain', label:'立刻解释职业机制和战斗环境', hint:'不是我输了，是统计口径不完整', scores:{ pride:2 } },
    { id:'copy', label:'悄悄复制他的天赋和饰品', hint:'你的答案很快就是我的答案', scores:{ envy:2 } },
    { id:'pull', label:'下一波我先开，谁也别拦', hint:'用更多目标解决所有问题', scores:{ wrath:2 } }, neutral,
  ]},
  { id:'transmog', title:'出门前发现肩膀和武器不够搭。', description:'距离集合只剩两分钟。', options:[
    { id:'closet', label:'全团等我重做一套幻化', hint:'首杀截图不能留下遗憾', scores:{ lust:2, pride:1 } },
    { id:'mount', label:'顺便再换一只配色坐骑', hint:'既然迟到，就迟到得完整', scores:{ lust:2, sloth:1 } },
    { id:'ignore', label:'随便，反正我会变形', hint:'幻化问题可以从物理层面消失', scores:{ sloth:2 } }, neutral,
  ]},
  { id:'mistake', title:'有人又一次把地板技能带进人群。', description:'你的团队交流方式是？', options:[
    { id:'teach', label:'从机制原理讲到宇宙起源', hint:'必须让所有人知道我早已看穿一切', scores:{ pride:2 } },
    { id:'type', label:'把问号打到聊天框冒烟', hint:'标点符号也是输出技能', scores:{ wrath:2 } },
    { id:'watch', label:'记住他，下次绝不让装备', hint:'复仇最好在分装备时完成', scores:{ envy:1, greed:2 } }, neutral,
  ]},
  { id:'wipe', title:'今晚已经灭了第七次。', description:'现在最需要什么？', options:[
    { id:'food', label:'再吃一桌大餐压压惊', hint:'合剂可以断，零食不能断', scores:{ gluttony:2 } },
    { id:'rage', label:'一个更响亮的战斗怒吼', hint:'音量越大，机制越容易', scores:{ wrath:2 } },
    { id:'break', label:'五分钟休息，半小时后回来', hint:'时间在艾泽拉斯流速不同', scores:{ sloth:2 } }, neutral,
  ]},
  { id:'alts', title:'角色选择界面还有十二个满级小号。', description:'你为什么又建了一个？', options:[
    { id:'collect', label:'这个职业的稀有外观还没拿', hint:'收藏列表不能留一个空格', scores:{ greed:2, lust:1 } },
    { id:'friend', label:'朋友转职了，我也不能落后', hint:'别人有的体验我也要有', scores:{ envy:2 } },
    { id:'easy', label:'听说它按键少，适合挂机', hint:'最高效率是少按一个键', scores:{ sloth:2 } }, neutral,
  ]},
  { id:'feast', title:'史诗钥石开打前，你最在意什么？', description:'诚实回答，泰坦正在记录。', options:[
    { id:'buffs', label:'食物、合剂、符文一个不能少', hint:'增益栏必须像自助餐一样满', scores:{ gluttony:2, greed:1 } },
    { id:'portrait', label:'我的角色在队伍框里最好看', hint:'审美就是第六项主属性', scores:{ lust:2 } },
    { id:'rank', label:'结束时我必须站在第一行', hint:'不一定是输出，也可以是打断次数', scores:{ pride:2, envy:1 } }, neutral,
  ]},
]

export const sinProfiles: SinProfile[] = [
  { key:'pride', name:'傲慢', alias:'首席理论大师', verdict:'你不是在打副本，你是在给全团提供一场未经预约的大师课。', confession:'承认吧：伤害统计只是用来证明你本来就知道答案。', specs:['奥术法师','戒律牧师','敏锐潜行者'] },
  { key:'greed', name:'贪婪', alias:'需求按钮收藏家', verdict:'你的背包永远差一格，收藏进度永远差最后一个。', confession:'你不是真的需要那件装备，你只是不能接受它属于别人。', specs:['狂徒潜行者','恶魔学识术士','兽王猎人'] },
  { key:'lust', name:'色欲', alias:'审美执念化身', verdict:'数值会被热修，幻化截图却会留在公会群里一辈子。', confession:'你选职业的真正标准，是施法动作能不能配上这套肩膀。', specs:['惩戒圣骑士','噬灭恶魔猎手','火焰法师'] },
  { key:'envy', name:'嫉妒', alias:'隔壁专精观察员', verdict:'只要别人打得更高，你就能在十分钟内研究完一个新职业。', confession:'你的主职业不是某个职业，而是“当前队伍第一名”。', specs:['增辉唤魔师','邪恶死亡骑士','生存猎人'] },
  { key:'wrath', name:'暴怒', alias:'问号连发器', verdict:'你相信所有机制都能靠更快的按键和更响的战吼解决。', confession:'冷静不是你的减伤，冲锋才是。', specs:['狂怒战士','浩劫恶魔猎手','增强萨满祭司'] },
  { key:'gluttony', name:'暴食', alias:'团队大餐守护者', verdict:'开荒可以没有进度，但绝不能没有第二桌大餐。', confession:'你对“吃满增益”的理解比攻略作者更彻底。', specs:['鲜血死亡骑士','守护德鲁伊','毁灭术士'] },
  { key:'sloth', name:'懒惰', alias:'单键哲学家', verdict:'你追求的不是简单，而是用最少动作获得最完整的艾泽拉斯体验。', confession:'能让宠物做的事，为什么要亲自动手？', specs:['兽王猎人','惩戒圣骑士','毁灭术士'] },
]
