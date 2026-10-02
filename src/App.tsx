import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { ClassIcon } from './components/ClassIcon'
import { Compass } from './components/Compass'
import { RadarChart } from './components/RadarChart'
import { classProfileMap, classProfiles } from './data/classes'
import { createQuestionSet, questions } from './data/questions'
import { radarMetrics } from './data/radar'
import { createSinQuestionSet, sinPairTaglines, sinProfiles, sinQuestions } from './data/sins'
import { specs } from './data/specs'
import { getClassRadar, getIndifferenceSummary, getRangeLabel, getRoleLabel, getSpecRecommendations, rankClasses } from './engine/scoring'
import { getSinScores, rankSinClasses, rankSinSpecs } from './engine/sinScoring'
import type { Answers, RadarMetricKey, Range, RankedSpec, Role, SinProfile } from './types'

type Screen = 'start' | 'quiz' | 'result' | 'atlas' | 'easter'
type SinStage = 'intro' | 'quiz' | 'result'
type SortDirection = 'desc' | 'asc'
type RankedSin = SinProfile & { share: number }

// 自白按罪名占比加权抽取：第一句出自主罪（并列时每个主罪各一句）；其余从所有上榜罪名中按占比随机抽，
// 占比越高越容易出现，次要罪名偶尔也会冒出来。以答案为种子的伪随机，同一份答案每次结果相同。
function pickSinTaglines(seed: number, leaders: RankedSin[], ranking: RankedSin[]) {
  let state = seed || 1
  const random = () => { state = (state * 1103515245 + 12345) % 2147483648; return state / 2147483648 }
  const used = new Set<string>()
  const pickFrom = (profile: RankedSin) => {
    const pool = profile.taglines.filter((line) => !used.has(line))
    const line = pool[Math.floor(random() * pool.length)]
    used.add(line)
    return line
  }
  const lines = leaders.map(pickFrom)
  const candidates = ranking.filter((profile) => profile.share > 0)
  const extraCount = candidates.filter((profile) => profile.share >= 15).length >= 3 ? 2 : 1
  for (let index = 0; index < extraCount && candidates.length; index += 1) {
    const total = candidates.reduce((sum, profile) => sum + Math.pow(profile.share, 1.3), 0)
    const roll = random() * total
    let cumulative = 0
    let chosen = candidates[0]
    for (const profile of candidates) {
      cumulative += Math.pow(profile.share, 1.3)
      if (roll <= cumulative) { chosen = profile; break }
    }
    lines.push(pickFrom(chosen))
  }
  return lines
}
const formatMetric = (value: number) => value.toFixed(1)
const getSpecIntro = (spec: (typeof specs)[number]) => `${spec.specName}是${getRoleLabel(spec.role)}专精，主要在${getRangeLabel(spec.range)}作战。${spec.fantasy}`
const getClassIntro = (className: string) => {
  const profile = classProfileMap.get(className)
  return profile ? `${profile.name}使用${profile.armor}装备。${profile.intro} ${profile.identity}` : ''
}

function ProsCons({ strengths, weaknesses, scope }: { strengths: string; weaknesses: string; scope?: string }) {
  return <div className="pros-cons"><p><span>{scope}优点</span>{strengths}</p><p><span>{scope}缺点</span>{weaknesses}</p></div>
}

function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [sessionQuestions, setSessionQuestions] = useState(createQuestionSet)
  const [selected, setSelected] = useState<RankedSpec | null>(null)
  const [atlasTab, setAtlasTab] = useState<'specs' | 'classes'>('specs')
  const [atlasClass, setAtlasClass] = useState('全部')
  const [atlasRole, setAtlasRole] = useState<Role | '全部'>('全部')
  const [atlasRange, setAtlasRange] = useState<Range | '全部'>('全部')
  const [atlasSort, setAtlasSort] = useState<{ key: RadarMetricKey; dir: SortDirection }[]>([])
  const [atlasPick, setAtlasPick] = useState(classProfiles[1].name)
  const [sinStage, setSinStage] = useState<SinStage>('intro')
  const [sinStep, setSinStep] = useState(0)
  const [sinAnswers, setSinAnswers] = useState<Answers>({})
  const [sessionSinQuestions, setSessionSinQuestions] = useState(createSinQuestionSet)
  const question = sessionQuestions[step]
  const results = useMemo(() => getSpecRecommendations(answers, sessionQuestions), [answers, sessionQuestions])
  const classResults = useMemo(() => rankClasses(answers, sessionQuestions).slice(0, 5), [answers, sessionQuestions])
  const indifference = useMemo(() => getIndifferenceSummary(answers, sessionQuestions), [answers, sessionQuestions])
  // 组合排序：每个维度按各自方向单独排名，名次相加越小越靠前；同分时按点击顺序逐项比较。
  const { filteredSpecs, atlasRanks } = useMemo(() => {
    const pool = specs
      .filter((spec) => atlasClass === '全部' || spec.className === atlasClass)
      .filter((spec) => atlasRole === '全部' || spec.role === atlasRole)
      .filter((spec) => atlasRange === '全部' || spec.range === atlasRange)
    const ranks = new Map<string, { total: number; overall: number; byMetric: Partial<Record<RadarMetricKey, number>> }>()
    if (!atlasSort.length) return { filteredSpecs: pool, atlasRanks: ranks }
    const oriented = (spec: (typeof specs)[number], key: RadarMetricKey, dir: SortDirection) => dir === 'desc' ? spec.metrics[key] : -spec.metrics[key]
    pool.forEach((spec) => {
      const byMetric: Partial<Record<RadarMetricKey, number>> = {}
      atlasSort.forEach(({ key, dir }) => { byMetric[key] = 1 + pool.filter((other) => oriented(other, key, dir) > oriented(spec, key, dir)).length })
      ranks.set(spec.id, { total: Object.values(byMetric).reduce((sum, rank) => sum + (rank ?? 0), 0), overall: 0, byMetric })
    })
    const sorted = [...pool].sort((a, b) => {
      const diff = ranks.get(a.id)!.total - ranks.get(b.id)!.total
      if (diff) return diff
      for (const { key, dir } of atlasSort) {
        const tie = oriented(b, key, dir) - oriented(a, key, dir)
        if (tie) return tie
      }
      return 0
    })
    sorted.forEach((spec) => { ranks.get(spec.id)!.overall = 1 + sorted.filter((other) => ranks.get(other.id)!.total < ranks.get(spec.id)!.total).length })
    return { filteredSpecs: sorted, atlasRanks: ranks }
  }, [atlasClass, atlasRole, atlasRange, atlasSort])
  const cycleAtlasSort = (key: RadarMetricKey) => setAtlasSort((current) => {
    const found = current.find((item) => item.key === key)
    if (!found) return [...current, { key, dir: 'desc' }]
    if (found.dir === 'desc') return current.map((item) => item.key === key ? { key, dir: 'asc' } : item)
    return current.filter((item) => item.key !== key)
  })
  const pickedProfile = classProfileMap.get(atlasPick) ?? classProfiles[0]
  // 七宗罪：具体题目负责 70% 玩法匹配，七罪人格比例提供 30% 稳定先验；两层都按多选顺序衰减。
  const sinScores = useMemo(() => getSinScores(sinAnswers, sessionSinQuestions), [sinAnswers, sessionSinQuestions])
  const sinRanking = useMemo(() => {
    const total = Object.values(sinScores).reduce((sum, value) => sum + (value ?? 0), 0)
    return [...sinProfiles]
      .map((profile) => ({ ...profile, share: total ? Math.round((sinScores[profile.key] ?? 0) / total * 100) : 0 }))
      .sort((a, b) => b.share - a.share)
  }, [sinScores])
  // 并列第一时同时显示多个罪名；全部选“我无所谓”时归为懒惰。
  const sinLeaders = sinRanking[0].share ? sinRanking.filter((profile) => profile.share === sinRanking[0].share).slice(0, 3) : [sinRanking.find((profile) => profile.key === 'sloth') ?? sinRanking[0]]
  const sinSpecResults = useMemo(() => rankSinSpecs(sinAnswers, sessionSinQuestions).slice(0, 10), [sinAnswers, sessionSinQuestions])
  // 结果标语：同一份答案每次抽到同一句；另按双罪组合、纯度和首选专精追加判词。
  const sinSeed = Object.entries(sinAnswers).flatMap(([id, picks]) => [id, ...picks]).join('|').split('').reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 100003, 7)
  const sinTaglines = pickSinTaglines(sinSeed, sinLeaders, sinRanking)
  const sinExtraLines = (() => {
    const lines: string[] = []
    const [first, second] = sinRanking
    const order = sinProfiles.map((profile) => profile.key)
    if (first.share && second.share && (sinLeaders.length > 1 || second.share >= first.share * .75)) {
      const pair = [first.key, second.key].sort((a, b) => order.indexOf(a) - order.indexOf(b)).join('+')
      if (sinPairTaglines[pair]) lines.push(`${first.name} × ${second.name}：${sinPairTaglines[pair]}`)
    }
    if (first.share >= 45) lines.push(`${first.name}纯度 ${first.share}%，几乎没有别的罪能插得进来。`)
    else if (first.share && first.share <= 22) lines.push('七宗罪你样样都沾一点，是个均衡发展的罪人。')
    const topSpec = sinSpecResults[0]
    if (topSpec) {
      const cell = `${topSpec.specName}${topSpec.className}`
      const templates = [`为你量身定做的牢房：${cell}。`, `建议先去${cell}那里服刑。`, `判决：终身监禁于${cell}。`, `你的罪，${cell}最能承受。`]
      lines.push(templates[sinSeed % templates.length])
    }
    return lines
  })()
  const sinClassResults = useMemo(() => rankSinClasses(sinAnswers, sessionSinQuestions).slice(0, 5), [sinAnswers, sessionSinQuestions])

  const looksDone = sessionQuestions.slice(0, step).filter((item) => item.category === 'looks').length
  const feelDone = sessionQuestions.slice(0, step).filter((item) => item.category === 'feel').length
  const looksTotal = sessionQuestions.filter((item) => item.category === 'looks').length
  const feelTotal = sessionQuestions.filter((item) => item.category === 'feel').length

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [screen, step, atlasTab, sinStage, sinStep])

  const begin = () => { setSessionQuestions(createQuestionSet()); setAnswers({}); setStep(0); setSelected(null); setScreen('quiz') }
  const toggleAnswer = (optionId: string) => {
    setAnswers((current) => {
      const chosen = current[question.id] ?? []
      if (optionId === 'any') return { ...current, [question.id]: chosen.includes('any') ? [] : ['any'] }
      const withoutNeutral = chosen.filter((id) => id !== 'any')
      return { ...current, [question.id]: withoutNeutral.includes(optionId) ? withoutNeutral.filter((id) => id !== optionId) : [...withoutNeutral, optionId] }
    })
  }
  const nextQuestion = () => step === sessionQuestions.length - 1 ? setScreen('result') : setStep((current) => current + 1)
  // 七宗罪回到上一题：答案按题目 id 保存，返回后可继续增减选择，罪名分随之重算。
  const goBackSin = () => sinStep === 0 ? setSinStage('intro') : setSinStep((current) => current - 1)
  const goBack = () => step === 0 ? setScreen('start') : setStep((current) => current - 1)
  const restart = () => { setSelected(null); setAnswers({}); setStep(0); setScreen('start') }
  const openAtlas = () => { setSelected(null); setScreen('atlas') }
  const openEaster = () => { setSinStage('intro'); setSinStep(0); setSinAnswers({}); setScreen('easter') }
  const beginSin = () => { setSessionSinQuestions(createSinQuestionSet()); setSinStage('quiz'); setSinStep(0); setSinAnswers({}) }
  // 七宗罪与正式测试一样可按顺序多选；“我无所谓”会清除其他选择。
  const toggleSin = (optionId: string) => {
    const current = sessionSinQuestions[sinStep]
    setSinAnswers((answered) => {
      const chosen = answered[current.id] ?? []
      if (optionId === 'any') return { ...answered, [current.id]: chosen.includes('any') ? [] : ['any'] }
      const withoutNeutral = chosen.filter((id) => id !== 'any')
      return { ...answered, [current.id]: withoutNeutral.includes(optionId) ? withoutNeutral.filter((id) => id !== optionId) : [...withoutNeutral, optionId] }
    })
  }
  const nextSin = () => sinStep === sessionSinQuestions.length - 1 ? setSinStage('result') : setSinStep((current) => current + 1)

  const classRecommendations = (
    <section className={`class-recommendations ${indifference.isHigh ? 'class-first' : ''}`}>
      <div className="section-heading">
        <div><p className="kicker">职业推荐 · 5 个</p><h2>{indifference.isHigh ? '先从多变的职业开始' : '更适合你的职业方向'}</h2></div>
        <p>{indifference.isHigh ? `你有 ${indifference.count} 题选择了“我无所谓”。比起过早锁定专精，更适合先选能切换多种玩法的职业。` : '职业推荐综合这个职业下表现最接近你的专精，并考虑它能提供多少种职责与玩法。'}</p>
      </div>
      <div className="class-grid">
        {classResults.map((item, index) => (
          <article className="class-card" key={item.name} style={{ '--class-color': item.color } as React.CSSProperties}>
            <div className="class-card-top">
              <div className="class-card-title"><ClassIcon className={item.name} color={item.color} size={48} /><div><span>0{index + 1}</span><h3>{item.name}</h3></div></div>
              <strong>{item.match}<small>%</small></strong>
            </div>
            <RadarChart values={getClassRadar(item.name)} color={item.color} label={`${item.name}职业`} compact />
            <div className="intro-block"><span>职业介绍</span><p>{getClassIntro(item.name)}</p></div>
            <ProsCons strengths={item.strengths} weaknesses={item.weaknesses} />
            <div className="spec-chips">{specs.filter((spec) => spec.className === item.name).map((spec) => <span key={spec.id}><ClassIcon className={spec.className} specId={spec.id} color={item.color} size={22} round />{spec.specName} · {getRoleLabel(spec.role)}</span>)}</div>
            <div className="class-meta"><span>{item.roles.join(' · ')}</span><span>优先体验：{item.recommendedSpecs.join(' / ')}</span></div>
            <p className="class-reason">{item.reason}</p>
          </article>
        ))}
      </div>
    </section>
  )

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={restart} aria-label="返回首页">
          <svg className="brand-mark" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="18" stroke="#e8b75c" strokeOpacity="0.5" /><path d="M20 4.5l4 15.5h-8Z" fill="#e8b75c" /><path d="M16 20h8l-4 15.5Z" fill="#9b7cf2" /><path d="M3 20h5 M32 20h5" stroke="#e8b75c" strokeOpacity="0.6" /></svg>
          <span><strong>职业罗盘</strong><small>艾泽拉斯角色选择器</small></span>
        </button>
        <nav className="top-actions" aria-label="站点导航">
          <button className="header-link" type="button" onClick={screen === 'atlas' ? begin : openAtlas}>{screen === 'atlas' ? '开始测试' : '全专精评分'}</button>
          <span className="version">正式服 · 至暗之夜 12.1</span>
          <button className="egg-button" type="button" onClick={openEaster} aria-label="打开隐藏的七宗罪测试">VII</button>
        </nav>
      </header>

      <main>
        {screen === 'start' && (
          <section className="start-screen">
            <div className="intro-copy">
              <p className="axis-kicker"><span className="looks">颜值</span><i /><b>×</b><i /><span className="feel">手感</span><em>双轴匹配</em></p>
              <h1>坐牢，<br /><em>坐最爱的牢。</em></h1>
              <p className="lede">13 个固定方向分别从自己的题池抽 1 题（共 {questions.length} 题），所有偏好都可按顺序多选；最后给出 10 个专精与 5 个职业方向。</p>
              <div className="hero-actions">
                <button className="hero-button" type="button" onClick={begin}>开始测试 <span>约 2 分钟</span></button>
                <button className="text-button" type="button" onClick={openAtlas}>先看职业图鉴</button>
              </div>
            </div>
            <Compass />
          </section>
        )}

        {screen === 'quiz' && question && (
          <section className="quiz-screen">
            <div className="quiz-meta">
              <button className="text-button" type="button" onClick={goBack}>‹ 上一步</button>
              <span>{indifference.count ? `我无所谓 ${indifference.count} 题` : question.category === 'looks' ? '颜值正在计分' : '手感正在计分'}</span>
              <span>{step + 1} / {sessionQuestions.length}</span>
            </div>

            <div className="dual-progress">
              <div><span><b>颜值</b>{looksDone}/{looksTotal}</span><i><em style={{ width: `${looksDone / looksTotal * 100}%` }} /></i></div>
              <div><span><b>手感</b>{feelDone}/{feelTotal}</span><i><em style={{ width: `${feelDone / feelTotal * 100}%` }} /></i></div>
            </div>

            <div className="question-block">
              <div className="question-copy">
                <p className={`kicker ${question.category}`}>方向 {question.slot}/13 · {question.group}<small>{question.eyebrow}</small></p>
                <h2>{question.title}</h2>
                <p className="question-description">{question.description}</p>
              </div>
              <div className="option-list" role="group" aria-label={question.title}>
                {question.options.map((option, index) => (
                  <button type="button" aria-pressed={answers[question.id]?.includes(option.id) ?? false} className={answers[question.id]?.includes(option.id) ? 'option-card selected' : 'option-card'} onClick={() => toggleAnswer(option.id)} key={option.id} style={option.accent ? { '--option-accent': option.accent } as React.CSSProperties : undefined}>
                    <span className="option-key">{String(index + 1).padStart(2, '0')}</span>
                    <span><strong>{option.accent && <i className="option-dot" />} {option.label}</strong><small>{option.hint}</small>{option.swatches && <span className="option-swatches">{option.swatches.map((swatch) => <i key={swatch.label}><b style={{ background:swatch.color }} />{swatch.label}</i>)}</span>}</span>
                    <span className={answers[question.id]?.includes(option.id) ? 'option-check chosen' : 'option-check'} aria-label={answers[question.id]?.includes(option.id) ? `第 ${(answers[question.id]?.indexOf(option.id) ?? 0) + 1} 优先` : '未选择'}>{answers[question.id]?.includes(option.id) ? (answers[question.id]?.indexOf(option.id) ?? 0) + 1 : ''}</span>
                  </button>
                ))}
              </div>
              <div className="quiz-next"><span>可多选 · 点击顺序就是偏好优先级 · “我无所谓”会清除其他选择</span><button className="primary-button" type="button" disabled={!answers[question.id]?.length} onClick={nextQuestion}>{step === sessionQuestions.length - 1 ? '查看结果' : '下一题'} →</button></div>
            </div>
          </section>
        )}

        {screen === 'result' && results[0] && (
          <section className="result-screen">
            <div className="result-heading">
              <div><p className="kicker">双轴匹配完成</p><h2>你的职业与专精倾向</h2></div>
              <p>专精百分比由颜值与手感各占一半；职业百分比还会考虑玩法跨度。六维图描述体验，不是强度或 DPS 排名。</p>
            </div>

            {indifference.isHigh && <div className="indifference-banner"><strong>你更像一位探索型玩家</strong><span>{indifference.count}/{indifference.total} 题选择了“我无所谓”，因此本次把职业推荐放在专精之前。</span></div>}
            {indifference.isHigh && classRecommendations}

            <div className="section-heading spec-heading">
              <div><p className="kicker">专精推荐 · 10 个</p><h2>{indifference.isHigh ? '可以优先试玩的专精' : '你的专精倾向'}</h2></div>
              <p>所有专精全局按契合百分比排序，同一职业可以出现 0—4 个；不会为了职业多样性打乱名次。</p>
            </div>

            <article className="winner" style={{ '--class-color': results[0].color } as React.CSSProperties}>
              <div className="winner-score">
                <span className="winner-icon"><ClassIcon className={results[0].className} specId={results[0].id} color={results[0].color} size={104} label={`${results[0].className}${results[0].specName}`} /><ClassIcon className={results[0].className} color={results[0].color} size={38} round /></span>
                <div><strong>{results[0].match}</strong><span>%</span></div><small>综合倾向</small>
              </div>
              <div className="winner-copy">
                <span className="class-name">首选 · {results[0].className}</span>
                <h3>{results[0].specName}</h3>
                <div className="intro-block"><span>专精介绍</span><p>{getSpecIntro(results[0])}</p></div>
                <ProsCons scope="专精" strengths={results[0].strengths} weaknesses={results[0].weaknesses} />
                <div className="intro-block class-intro"><span>职业介绍</span><p>{getClassIntro(results[0].className)}</p></div>
                <ProsCons scope="职业" strengths={classProfileMap.get(results[0].className)?.strengths ?? ''} weaknesses={classProfileMap.get(results[0].className)?.weaknesses ?? ''} />
                <div className="split-score"><span>颜值 {results[0].looksMatch}%</span><span>手感 {results[0].feelMatch}%</span></div>
                <ul>{results[0].reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                <button className="detail-button" type="button" onClick={() => setSelected(results[0])}>查看完整玩法档案</button>
              </div>
              <RadarChart values={results[0].metrics} color={results[0].color} label={`${results[0].className}${results[0].specName}`} />
            </article>

            <div className="alternatives-heading"><span>另外 9 个相近专精</span><small>02—10 · 按百分比降序</small></div>
            <div className="alternatives">
              {results.slice(1).map((spec, index) => (
                <button className="alternative-card" type="button" onClick={() => setSelected(spec)} key={spec.id} style={{ '--class-color': spec.color } as React.CSSProperties}>
                  <span className="alt-rank">0{index + 2}</span>
                  <ClassIcon className={spec.className} specId={spec.id} color={spec.color} size={48} />
                  <span className="alt-name"><small>{spec.className}</small><strong>{spec.specName}</strong><span><b>专精介绍</b>{getSpecIntro(spec)}</span><span><b>专精优点</b>{spec.strengths}</span><span><b>专精缺点</b>{spec.weaknesses}</span><span><b>职业介绍</b>{getClassIntro(spec.className)}</span><span><b>职业优点</b>{classProfileMap.get(spec.className)?.strengths}</span><span><b>职业缺点</b>{classProfileMap.get(spec.className)?.weaknesses}</span></span>
                  <span className="alt-bars"><i style={{ width: `${spec.looksMatch}%` }} /><i style={{ width: `${spec.feelMatch}%` }} /></span>
                  <span className="alt-score"><strong>{spec.match}</strong>%</span>
                </button>
              ))}
            </div>

            {!indifference.isHigh && classRecommendations}
            <div className="result-actions"><button className="primary-button" type="button" onClick={begin}>重新测试</button><button className="text-button" type="button" onClick={openAtlas}>查看全专精评分</button><button className="text-button" type="button" onClick={restart}>返回首页</button></div>
          </section>
        )}

        {screen === 'atlas' && (
          <section className="atlas-screen">
            <div className="atlas-heading">
              <div><p className="kicker">至暗之夜 12.1 · 体验档案</p><h1>全天赋六维评分</h1></div>
              <p>数值采用 0.0 至 9.0 的九分制，并细分到 0.1。9.0 表示要求更多、上限更高或能力更强，不代表当前版本输出强度。</p>
            </div>
            <div className="atlas-toolbar">
              <div className="atlas-tabs" role="tablist" aria-label="评分类型">
                <button type="button" role="tab" aria-selected={atlasTab === 'specs'} className={atlasTab === 'specs' ? 'active' : ''} onClick={() => setAtlasTab('specs')}>专精 · 40</button>
                <button type="button" role="tab" aria-selected={atlasTab === 'classes'} className={atlasTab === 'classes' ? 'active' : ''} onClick={() => setAtlasTab('classes')}>职业 · 13</button>
              </div>
              {atlasTab === 'specs' && <span className="atlas-count">当前 {filteredSpecs.length} 个专精</span>}
            </div>
            {atlasTab === 'specs' ? (
              <>
              <div className="atlas-controls">
                <div className="atlas-filter-row">
                  <label className="class-filter">职业<select value={atlasClass} onChange={(event) => setAtlasClass(event.target.value)}><option>全部</option>{classProfiles.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
                  <label className="class-filter">职责<select value={atlasRole} onChange={(event) => setAtlasRole(event.target.value as Role | '全部')}><option>全部</option><option value="tank">坦克</option><option value="healer">治疗</option><option value="melee">近战输出</option><option value="ranged">远程输出</option><option value="support">辅助输出</option></select></label>
                  <label className="class-filter">距离<select value={atlasRange} onChange={(event) => setAtlasRange(event.target.value as Range | '全部')}><option>全部</option><option value="melee">贴身近战</option><option value="mid">中距离</option><option value="ranged">远程</option></select></label>
                </div>
                <div className="metric-sort-row"><span>组合排序</span><div>{radarMetrics.map(({ key, label }) => {
                  const order = atlasSort.findIndex((item) => item.key === key)
                  const dir = order >= 0 ? atlasSort[order].dir : null
                  const state = dir === 'desc' ? '高分优先' : dir === 'asc' ? '低分优先' : '不排序'
                  return <button type="button" className={dir ? `sort-${dir}` : ''} aria-label={`${label}：${state}，点击切换`} title={`${label} · ${state}`} onClick={() => cycleAtlasSort(key)} key={key}>{label}{dir && <b aria-hidden="true">{dir === 'desc' ? '↑' : '↓'}</b>}{dir && atlasSort.length > 1 && <i aria-hidden="true">{order + 1}</i>}</button>
                })}</div><button className="reset-sort" type="button" onClick={() => { setAtlasClass('全部'); setAtlasRole('全部'); setAtlasRange('全部'); setAtlasSort([]) }}>重置</button></div>
                <p className="sort-help" aria-live="polite">{atlasSort.length ? `${atlasSort.map(({ key, dir }) => `${radarMetrics.find((metric) => metric.key === key)?.label}${dir === 'desc' ? '高' : '低'}`).join(' + ')}：每项在当前结果里单独排名，名次相加越小越靠前；名次和相同时按点击顺序比较。` : '点击维度切换：↑ 高分优先 → ↓ 低分优先 → 不排序。可以组合多个维度，每个维度方向独立。'}</p>
              </div>
              <div className="atlas-grid">
                {filteredSpecs.map((spec) => (
                  <article className="atlas-card" key={spec.id} style={{ '--class-color': spec.color } as React.CSSProperties}>
                    <div className="atlas-card-heading"><div className="atlas-title"><ClassIcon className={spec.className} specId={spec.id} color={spec.color} size={52} /><div><span>{spec.className}</span><h2>{spec.specName}</h2></div></div><small>{getRoleLabel(spec.role)} · {getRangeLabel(spec.range)}{atlasRanks.get(spec.id) && <b className="sort-score">综合第 {atlasRanks.get(spec.id)!.overall}</b>}</small></div>
                    {atlasRanks.get(spec.id) && <div className="sort-breakdown">{atlasSort.map(({ key, dir }) => <span className={`sort-${dir}`} key={key}>{radarMetrics.find((metric) => metric.key === key)?.label} {dir === 'desc' ? '↑' : '↓'} {formatMetric(spec.metrics[key])}<em>第 {atlasRanks.get(spec.id)!.byMetric[key]}</em></span>)}</div>}
                    <p>{getSpecIntro(spec)}</p>
                    <ProsCons strengths={spec.strengths} weaknesses={spec.weaknesses} />
                    <RadarChart values={spec.metrics} color={spec.color} label={`${spec.className}${spec.specName}`} />
                    <div className="atlas-numbers">{radarMetrics.map(({ key, label }) => <span key={key}>{label}<b>{formatMetric(spec.metrics[key])}</b></span>)}</div>
                  </article>
                ))}
              </div>
              {!filteredSpecs.length && <p className="empty-atlas">没有同时符合这些筛选条件的专精。</p>}
              </>
            ) : (
              <div className="class-atlas">
                <div className="class-tiles">
                  {classProfiles.map((profile) => (
                    <button type="button" className={profile.name === atlasPick ? 'class-tile active' : 'class-tile'} aria-pressed={profile.name === atlasPick} onClick={() => setAtlasPick(profile.name)} key={profile.name} style={{ '--class-color': profile.color } as React.CSSProperties}>
                      <ClassIcon className={profile.name} color={profile.color} size={48} />
                      <span><strong>{profile.name}</strong><small>{profile.armor} · {specs.filter((spec) => spec.className === profile.name).length} 专精</small></span>
                    </button>
                  ))}
                </div>
                <article className="atlas-card class-detail" style={{ '--class-color': pickedProfile.color } as React.CSSProperties}>
                  <div className="atlas-card-heading"><div className="atlas-title"><ClassIcon className={pickedProfile.name} color={pickedProfile.color} size={72} /><div><span>{pickedProfile.armor}职业 · 玩法跨度 {pickedProfile.versatility} / 5</span><h2>{pickedProfile.name}</h2></div></div><small>{pickedProfile.color.toUpperCase()}</small></div>
                  <p>{getClassIntro(pickedProfile.name)}</p>
                  <ProsCons strengths={pickedProfile.strengths} weaknesses={pickedProfile.weaknesses} />
                  <div className="spec-chips">{specs.filter((spec) => spec.className === pickedProfile.name).map((spec) => <span key={spec.id}><ClassIcon className={spec.className} specId={spec.id} color={pickedProfile.color} size={28} round />{spec.specName} · {getRoleLabel(spec.role)}</span>)}</div>
                  <RadarChart values={getClassRadar(pickedProfile.name)} color={pickedProfile.color} label={`${pickedProfile.name}职业`} />
                  <div className="atlas-numbers">{radarMetrics.map(({ key, label }) => <span key={key}>{label}<b>{formatMetric(getClassRadar(pickedProfile.name)[key])}</b></span>)}</div>
                </article>
              </div>
            )}
            <aside className="source-note"><strong>资料口径</strong><p>2026-09 复核正式服 12.1。六维分数与手感标签综合官方资料、当前专精指南和玩家实战讨论逐项校准；只记录玩法体验，不追随短期数值强弱。背景考据只影响颜值题，发生冲突时以当前游戏体验为准。本页不是 DPS、治疗量或竞技强度排名。</p><div><a href="https://worldofwarcraft.blizzard.com/en-us/news/24293281/curse-of-ulatek-content-update-notes" target="_blank" rel="noreferrer">暴雪：12.1 正式服资料</a><a href="https://www.wowhead.com/news/patch-12-1-guide-compendium-every-guide-you-ll-need-for-season-2-382408" target="_blank" rel="noreferrer">Wowhead：12.1 指南汇总</a><a href="https://www.icy-veins.com/wow/choose-your-main-guide" target="_blank" rel="noreferrer">Icy Veins：12.1 主职业指南</a><a href="https://www.reddit.com/r/wow/comments/1ua1oq4/opinions_of_the_class_changes_in_121/" target="_blank" rel="noreferrer">社区：12.1 职业体验</a></div></aside>
          </section>
        )}

        {screen === 'easter' && (
          <section className="sin-screen">
            {sinStage === 'intro' && <div className="sin-intro"><p className="sin-mark">VII</p><p className="kicker">非官方 · 不留情面 · 不计入主测试</p><h1>艾泽拉斯<br /><em>七宗罪鉴定</em></h1><p className="lede">13 个方向各从题池抽 1 题（共 {sinQuestions.length} 份罪证），每题可按顺序多选。推荐同时参考具体答案（70%）与七罪人格比例（30%），最后给出 10 个专精与 5 个职业。</p><button className="sin-button" type="button" onClick={beginSin}>签下免责声明</button><button className="text-button" type="button" onClick={restart}>我突然良心发现</button></div>}
            {sinStage === 'quiz' && (
              <div className="sin-quiz">
                <div className="sin-meta"><button className="text-button" type="button" onClick={goBackSin}>‹ 上一题</button></div>
                <div className="sin-progress"><span>罪证 {sessionSinQuestions[sinStep].slot} / {sessionSinQuestions.length} · {sessionSinQuestions[sinStep].group}</span><i><em style={{ width:`${(sinStep + 1) / sessionSinQuestions.length * 100}%` }} /></i></div>
                <p className="kicker">七宗罪 · {sessionSinQuestions[sinStep].context} · {sessionSinQuestions[sinStep].eyebrow}</p>
                <h2>{sessionSinQuestions[sinStep].title}</h2><p>{sessionSinQuestions[sinStep].description}</p>
                <div className="option-list" role="group" aria-label={sessionSinQuestions[sinStep].title}>{sessionSinQuestions[sinStep].options.map((option, index) => {
                  const picks = sinAnswers[sessionSinQuestions[sinStep].id] ?? []
                  const order = picks.indexOf(option.id)
                  return <button className={order >= 0 ? 'option-card sin-option selected' : 'option-card sin-option'} type="button" aria-pressed={order >= 0} onClick={() => toggleSin(option.id)} key={option.id}><span className="option-key">{String(index + 1).padStart(2,'0')}</span><span><strong>{option.label}</strong><small>{option.hint}</small></span><span className={order >= 0 ? 'option-check chosen' : 'option-check'} aria-label={order >= 0 ? `第 ${order + 1} 优先` : '未选择'}>{order >= 0 ? order + 1 : ''}</span></button>
                })}</div>
                <div className="quiz-next sin-next"><span>可多选 · 点击顺序就是罪证轻重 · “我无所谓”会清除其他选择</span><button className="sin-button" type="button" disabled={!sinAnswers[sessionSinQuestions[sinStep].id]?.length} onClick={nextSin}>{sinStep === sessionSinQuestions.length - 1 ? '宣判结果' : '下一题'} →</button></div>
              </div>
            )}
            {sinStage === 'result' && (
              <div className="sin-result">
                <p className="sin-mark">VII</p><p className="kicker">罪名成立 · 但不影响进组</p><h1>{sinLeaders.map((profile) => profile.name).join(' × ')}</h1><h2>{sinLeaders.map((profile) => `${profile.alias} ${profile.share}%`).join(' · ')}</h2>
                {sinLeaders.length > 1 && <p className="sin-tie">{sinLeaders.length === 2 ? '两' : '三'}宗罪并列第一，推荐已同时考虑。</p>}
                {sinLeaders.map((profile) => <div className="sin-reading" key={profile.key}>{sinLeaders.length > 1 && <b>{profile.name}</b>}<p className="sin-verdict">{profile.verdict}</p><p className="sin-playstyle">{profile.playstyle}</p></div>)}
                <blockquote className="sin-quote">{sinTaglines.map((line) => <p key={line}>“{line.replace(/“/g, '「').replace(/”/g, '」')}”</p>)}</blockquote>
                {sinExtraLines.length > 0 && <ul className="sin-lines">{sinExtraLines.map((line) => <li key={line}>{line}</li>)}</ul>}
                <div className="sin-bars" aria-label="七宗罪占比">{sinRanking.map((profile) => <div className={sinLeaders.some((leader) => leader.key === profile.key) ? 'lead' : ''} key={profile.key}><span>{profile.name}</span><i><em style={{ width:`${profile.share}%` }} /></i><b>{profile.share}%</b></div>)}</div>
                <section className="sin-picks">
                  <h3>按你的罪性推荐的专精 · 10 个</h3>
                  <div className="sin-spec-grid">{sinSpecResults.map((spec, index) => <button type="button" className="sin-spec" onClick={() => setSelected(spec)} key={spec.id}><b>{String(index + 1).padStart(2, '0')}</b><ClassIcon className={spec.className} specId={spec.id} color={spec.color} size={40} /><span><small>{spec.className}</small><strong>{spec.specName}</strong></span><em>{spec.match}%</em></button>)}</div>
                </section>
                <section className="sin-picks">
                  <h3>按你的罪性推荐的职业 · 5 个</h3>
                  <div className="sin-class-grid">{sinClassResults.map((item, index) => <div className="sin-class" key={item.name}><b>{String(index + 1).padStart(2, '0')}</b><ClassIcon className={item.name} color={item.color} size={44} /><span><strong>{item.name}</strong><small>优先体验：{item.recommendedSpecs.join(' / ')}</small></span><em>{item.match}%</em></div>)}</div>
                </section>
                <p className="sin-disclaimer">罪名是性格画像，不代表职业强度；专精契合度由具体答案 70% 与七罪人格 30% 联合计算，两边测试的答案完全隔离。</p>
                <div className="result-actions"><button className="sin-button" type="button" onClick={beginSin}>重新认罪</button><button className="text-button" type="button" onClick={begin}>回归正经测试</button></div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer><span>职业罗盘 · P2</span><span>资料基于正式服《至暗之夜》12.1 · 2026-09 校准 · 不构成强度排名</span></footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="关闭">×</button>
            <ClassIcon className={selected.className} specId={selected.id} color={selected.color} size={64} />
            <span className="modal-class" style={{ color:selected.color }}>{selected.className} · {getRoleLabel(selected.role)} · {getRangeLabel(selected.range)}</span>
            <h2 id="detail-title">{selected.match}% · {selected.specName}</h2>
            <RadarChart values={selected.metrics} color={selected.color} label={`${selected.className}${selected.specName}`} />
            <div className="modal-copy-block"><span>专精介绍</span><p>{getSpecIntro(selected)}</p></div>
            <ProsCons scope="专精" strengths={selected.strengths} weaknesses={selected.weaknesses} />
            <div className="modal-copy-block class-copy"><span>职业介绍</span><p>{getClassIntro(selected.className)}</p></div>
            <ProsCons scope="职业" strengths={classProfileMap.get(selected.className)?.strengths ?? ''} weaknesses={classProfileMap.get(selected.className)?.weaknesses ?? ''} />
            <div className="modal-axis"><div><span>颜值契合</span><b>{selected.looksMatch}%</b></div><div><span>手感契合</span><b>{selected.feelMatch}%</b></div></div>
            <div className="metric-grid">{radarMetrics.map(({ key, label }) => <div key={key}><span className="metric-value"><span>{label}</span><b>{formatMetric(selected.metrics[key])} / 9</b></span><div className="metric-track" role="meter" aria-label={`${label} ${formatMetric(selected.metrics[key])}/9`} aria-valuenow={selected.metrics[key]} aria-valuemin={0} aria-valuemax={9}><i style={{ width:`${selected.metrics[key] / 9 * 100}%` }} /></div></div>)}</div>
            <button className="primary-button full" type="button" onClick={() => setSelected(null)}>了解了</button>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
