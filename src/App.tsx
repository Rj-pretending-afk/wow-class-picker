import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { ClassIcon } from './components/ClassIcon'
import { Compass } from './components/Compass'
import { RadarChart } from './components/RadarChart'
import { classProfileMap, classProfiles } from './data/classes'
import { questions } from './data/questions'
import { radarMetrics } from './data/radar'
import { sinProfiles, sinQuestions } from './data/sins'
import { specs } from './data/specs'
import { getClassRadar, getIndifferenceSummary, getRangeLabel, getRoleLabel, getSpecRecommendations, rankClasses } from './engine/scoring'
import type { Answers, RankedSpec, SinKey } from './types'

type Screen = 'start' | 'quiz' | 'result' | 'atlas' | 'easter'
type SinStage = 'intro' | 'quiz' | 'result'
const formatMetric = (value: number) => value.toFixed(1)
const findSpecByLabel = (label: string) => specs.find((spec) => spec.specName + spec.className === label)

function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [selected, setSelected] = useState<RankedSpec | null>(null)
  const [atlasTab, setAtlasTab] = useState<'specs' | 'classes'>('specs')
  const [atlasClass, setAtlasClass] = useState('全部')
  const [atlasPick, setAtlasPick] = useState(classProfiles[1].name)
  const [sinStage, setSinStage] = useState<SinStage>('intro')
  const [sinStep, setSinStep] = useState(0)
  const [sinScores, setSinScores] = useState<Partial<Record<SinKey, number>>>({})
  const question = questions[step]
  const results = useMemo(() => getSpecRecommendations(answers), [answers])
  const classResults = useMemo(() => rankClasses(answers).slice(0, 3), [answers])
  const indifference = useMemo(() => getIndifferenceSummary(answers), [answers])
  const filteredSpecs = atlasClass === '全部' ? specs : specs.filter((spec) => spec.className === atlasClass)
  const pickedProfile = classProfileMap.get(atlasPick) ?? classProfiles[0]
  const sinResult = useMemo(() => [...sinProfiles].sort((a, b) => (sinScores[b.key] ?? 0) - (sinScores[a.key] ?? 0))[0], [sinScores])

  const looksDone = questions.slice(0, step).filter((item) => item.category === 'looks').length
  const feelDone = questions.slice(0, step).filter((item) => item.category === 'feel').length
  const looksTotal = questions.filter((item) => item.category === 'looks').length
  const feelTotal = questions.filter((item) => item.category === 'feel').length

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [screen, step, atlasTab, sinStage, sinStep])

  const begin = () => { setAnswers({}); setStep(0); setSelected(null); setScreen('quiz') }
  const answerQuestion = (optionId: string) => {
    setAnswers((current) => ({ ...current, [question.id]: optionId }))
    if (step === questions.length - 1) setScreen('result')
    else setStep((current) => current + 1)
  }
  const goBack = () => step === 0 ? setScreen('start') : setStep((current) => current - 1)
  const restart = () => { setSelected(null); setAnswers({}); setStep(0); setScreen('start') }
  const openAtlas = () => { setSelected(null); setScreen('atlas') }
  const openEaster = () => { setSinStage('intro'); setSinStep(0); setSinScores({}); setScreen('easter') }
  const beginSin = () => { setSinStage('quiz'); setSinStep(0); setSinScores({}) }
  const answerSin = (scores: Partial<Record<SinKey, number>>) => {
    setSinScores((current) => {
      const next = { ...current }
      Object.entries(scores).forEach(([key, value]) => { next[key as SinKey] = (next[key as SinKey] ?? 0) + Number(value) })
      return next
    })
    if (sinStep === sinQuestions.length - 1) setSinStage('result')
    else setSinStep((current) => current + 1)
  }

  const classRecommendations = (
    <section className={`class-recommendations ${indifference.isHigh ? 'class-first' : ''}`}>
      <div className="section-heading">
        <div><p className="kicker">职业推荐 · 3 个</p><h2>{indifference.isHigh ? '先从多变的职业开始' : '更适合你的职业方向'}</h2></div>
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
            <div className="intro-block"><span>职业介绍</span><p>{item.intro}</p></div>
            <p className="class-identity">{item.identity}</p>
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
          <span className="version">正式服 · 至暗之夜 12.x</span>
          <button className="egg-button" type="button" onClick={openEaster} aria-label="打开隐藏的七宗罪测试">VII</button>
        </nav>
      </header>

      <main>
        {screen === 'start' && (
          <section className="start-screen">
            <div className="intro-copy">
              <p className="axis-kicker"><span className="looks">颜值</span><i /><b>×</b><i /><span className="feel">手感</span><em>双轴匹配</em></p>
              <h1>坐牢，<br /><em>坐最爱的牢。</em></h1>
              <p className="lede">{questions.length} 道问题选择你最爱的牢房(天赋)，并行计算颜值与手感评分，最后给出 6 个专精与 3 个职业方向。</p>
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
              <span>{step + 1} / {questions.length}</span>
            </div>

            <div className="dual-progress">
              <div><span><b>颜值</b>{looksDone}/{looksTotal}</span><i><em style={{ width: `${looksDone / looksTotal * 100}%` }} /></i></div>
              <div><span><b>手感</b>{feelDone}/{feelTotal}</span><i><em style={{ width: `${feelDone / feelTotal * 100}%` }} /></i></div>
            </div>

            <div className="question-block">
              <div className="question-copy">
                <p className={`kicker ${question.category}`}>{question.eyebrow}</p>
                <h2>{question.title}</h2>
                <p className="question-description">{question.description}</p>
              </div>
              <div className="option-list" role="group" aria-label={question.title}>
                {question.options.map((option, index) => (
                  <button type="button" className={answers[question.id] === option.id ? 'option-card selected' : 'option-card'} onClick={() => answerQuestion(option.id)} key={option.id}>
                    <span className="option-key">{String(index + 1).padStart(2, '0')}</span>
                    <span><strong>{option.label}</strong><small>{option.hint}</small></span>
                    <span className="option-chevron" aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
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
              <div><p className="kicker">专精推荐 · 6 个</p><h2>{indifference.isHigh ? '可以优先试玩的专精' : '你的专精倾向'}</h2></div>
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
                <div className="intro-block"><span>专精介绍</span><p>{results[0].fantasy} {results[0].summary}</p></div>
                <div className="intro-block class-intro"><span>职业介绍</span><p>{classProfileMap.get(results[0].className)?.intro}</p></div>
                <div className="split-score"><span>颜值 {results[0].looksMatch}%</span><span>手感 {results[0].feelMatch}%</span></div>
                <ul>{results[0].reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                <button className="detail-button" type="button" onClick={() => setSelected(results[0])}>查看完整玩法档案</button>
              </div>
              <RadarChart values={results[0].metrics} color={results[0].color} label={`${results[0].className}${results[0].specName}`} />
            </article>

            <div className="alternatives-heading"><span>另外 5 个相近专精</span><small>02—06 · 按百分比降序</small></div>
            <div className="alternatives">
              {results.slice(1).map((spec, index) => (
                <button className="alternative-card" type="button" onClick={() => setSelected(spec)} key={spec.id} style={{ '--class-color': spec.color } as React.CSSProperties}>
                  <span className="alt-rank">0{index + 2}</span>
                  <ClassIcon className={spec.className} specId={spec.id} color={spec.color} size={48} />
                  <span className="alt-name"><small>{spec.className}</small><strong>{spec.specName}</strong><span><b>专精介绍</b>{spec.summary}</span><span><b>职业介绍</b>{classProfileMap.get(spec.className)?.intro}</span></span>
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
              <div><p className="kicker">至暗之夜 12.x · 体验档案</p><h1>全天赋六维评分</h1></div>
              <p>数值采用 0.0—9.0 的九分制，并细分到 0.1：9.0 表示要求更多、上限更高或能力更强，不代表当前版本输出强度。</p>
            </div>
            <div className="atlas-toolbar">
              <div className="atlas-tabs" role="tablist" aria-label="评分类型">
                <button type="button" role="tab" aria-selected={atlasTab === 'specs'} className={atlasTab === 'specs' ? 'active' : ''} onClick={() => setAtlasTab('specs')}>专精 · 40</button>
                <button type="button" role="tab" aria-selected={atlasTab === 'classes'} className={atlasTab === 'classes' ? 'active' : ''} onClick={() => setAtlasTab('classes')}>职业 · 13</button>
              </div>
              {atlasTab === 'specs' && <label className="class-filter">筛选职业<select value={atlasClass} onChange={(event) => setAtlasClass(event.target.value)}><option>全部</option>{classProfiles.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>}
            </div>
            {atlasTab === 'specs' ? (
              <div className="atlas-grid">
                {filteredSpecs.map((spec) => (
                  <article className="atlas-card" key={spec.id} style={{ '--class-color': spec.color } as React.CSSProperties}>
                    <div className="atlas-card-heading"><div className="atlas-title"><ClassIcon className={spec.className} specId={spec.id} color={spec.color} size={52} /><div><span>{spec.className}</span><h2>{spec.specName}</h2></div></div><small>{getRoleLabel(spec.role)} · {getRangeLabel(spec.range)}</small></div>
                    <p>{spec.summary}</p>
                    <RadarChart values={spec.metrics} color={spec.color} label={`${spec.className}${spec.specName}`} />
                    <div className="atlas-numbers">{radarMetrics.map(({ key, label }) => <span key={key}>{label}<b>{formatMetric(spec.metrics[key])}</b></span>)}</div>
                  </article>
                ))}
              </div>
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
                  <p>{pickedProfile.intro} {pickedProfile.identity}</p>
                  <div className="spec-chips">{specs.filter((spec) => spec.className === pickedProfile.name).map((spec) => <span key={spec.id}><ClassIcon className={spec.className} specId={spec.id} color={pickedProfile.color} size={28} round />{spec.specName} · {getRoleLabel(spec.role)}</span>)}</div>
                  <RadarChart values={getClassRadar(pickedProfile.name)} color={pickedProfile.color} label={`${pickedProfile.name}职业`} />
                  <div className="atlas-numbers">{radarMetrics.map(({ key, label }) => <span key={key}>{label}<b>{formatMetric(getClassRadar(pickedProfile.name)[key])}</b></span>)}</div>
                </article>
              </div>
            )}
            <aside className="source-note"><strong>资料口径</strong><p>2026-09 复核正式服 12.x。上手难度与操作上限参考暴雪的 Midnight 重做目标、12.x 更新说明，以及 Wowhead / Icy Veins 当前专精指南后统一校准；属于面向选角的相对评分。</p><div><a href="https://worldofwarcraft.blizzard.com/en-us/news/24229031" target="_blank" rel="noreferrer">暴雪：Midnight 战斗与天赋更新</a><a href="https://www.icy-veins.com/wow/class-guides" target="_blank" rel="noreferrer">Icy Veins：Midnight 职业指南</a><a href="https://www.wowhead.com/guides/classes" target="_blank" rel="noreferrer">Wowhead：Midnight 职业指南</a></div></aside>
          </section>
        )}

        {screen === 'easter' && (
          <section className="sin-screen">
            {sinStage === 'intro' && <div className="sin-intro"><p className="sin-mark">VII</p><p className="kicker">非官方 · 不正经 · 不计入主测试</p><h1>艾泽拉斯<br /><em>七宗罪鉴定</em></h1><p className="lede">七个问题，判断你在团本、幻化与伤害统计面前最难抵抗哪一种诱惑。结果纯属恶搞。</p><button className="sin-button" type="button" onClick={beginSin}>签下免责声明</button><button className="text-button" type="button" onClick={restart}>我突然良心发现</button></div>}
            {sinStage === 'quiz' && (
              <div className="sin-quiz">
                <div className="sin-progress"><span>罪证 {sinStep + 1} / {sinQuestions.length}</span><i><em style={{ width:`${(sinStep + 1) / sinQuestions.length * 100}%` }} /></i></div>
                <p className="kicker">七宗罪 · 第 {sinStep + 1} 份口供</p>
                <h2>{sinQuestions[sinStep].title}</h2><p>{sinQuestions[sinStep].description}</p>
                <div className="option-list">{sinQuestions[sinStep].options.map((option, index) => <button className="option-card sin-option" type="button" onClick={() => answerSin(option.scores)} key={option.id}><span className="option-key">{String(index + 1).padStart(2,'0')}</span><span><strong>{option.label}</strong><small>{option.hint}</small></span><span className="option-chevron">›</span></button>)}</div>
              </div>
            )}
            {sinStage === 'result' && (
              <div className="sin-result">
                <p className="sin-mark">VII</p><p className="kicker">罪名成立 · 但不影响进组</p><h1>{sinResult.name}</h1><h2>{sinResult.alias}</h2><p className="sin-verdict">{sinResult.verdict}</p><blockquote>“{sinResult.confession}”</blockquote>
                <div className="sin-specs"><span>恶搞推荐专精</span>{sinResult.specs.map((label, index) => { const spec = findSpecByLabel(label); return <div key={label}><b>0{index + 1}</b>{spec ? <ClassIcon className={spec.className} specId={spec.id} color={spec.color} size={40} /> : <span />}<strong>{label}</strong></div> })}</div>
                <p className="sin-disclaimer">这份结果不使用正式评分、不代表职业强度，也不会污染你的主测试答案。</p>
                <div className="result-actions"><button className="sin-button" type="button" onClick={beginSin}>重新认罪</button><button className="text-button" type="button" onClick={begin}>回归正经测试</button></div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer><span>职业罗盘 · P2</span><span>资料基于正式服《至暗之夜》12.x · 2026-09 校准 · 不构成强度排名</span></footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="关闭">×</button>
            <ClassIcon className={selected.className} specId={selected.id} color={selected.color} size={64} />
            <span className="modal-class" style={{ color:selected.color }}>{selected.className} · {getRoleLabel(selected.role)} · {getRangeLabel(selected.range)}</span>
            <h2 id="detail-title">{selected.match}% · {selected.specName}</h2>
            <RadarChart values={selected.metrics} color={selected.color} label={`${selected.className}${selected.specName}`} />
            <div className="modal-copy-block"><span>专精介绍</span><p>{selected.fantasy} {selected.summary}</p></div>
            <div className="modal-copy-block class-copy"><span>职业介绍</span><p>{classProfileMap.get(selected.className)?.intro} {classProfileMap.get(selected.className)?.identity}</p></div>
            <div className="modal-axis"><div><span>颜值契合</span><b>{selected.looksMatch}%</b></div><div><span>手感契合</span><b>{selected.feelMatch}%</b></div></div>
            <div className="caution-box"><span>选择前留意</span><p>{selected.caution}</p></div>
            <div className="metric-grid">{radarMetrics.map(({ key, label }) => <div key={key}><span className="metric-value"><span>{label}</span><b>{formatMetric(selected.metrics[key])} / 9</b></span><div className="metric-track" role="meter" aria-label={`${label} ${formatMetric(selected.metrics[key])}/9`} aria-valuenow={selected.metrics[key]} aria-valuemin={0} aria-valuemax={9}><i style={{ width:`${selected.metrics[key] / 9 * 100}%` }} /></div></div>)}</div>
            <button className="primary-button full" type="button" onClick={() => setSelected(null)}>了解了</button>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
