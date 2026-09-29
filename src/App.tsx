import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { classProfileMap } from './data/classes'
import { questions } from './data/questions'
import { getIndifferenceSummary, getRangeLabel, getRoleLabel, getSpecRecommendations, rankClasses } from './engine/scoring'
import type { Answers, RankedSpec } from './types'

type Screen = 'start' | 'quiz' | 'result'

function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [selected, setSelected] = useState<RankedSpec | null>(null)
  const question = questions[step]
  const results = useMemo(() => getSpecRecommendations(answers), [answers])
  const classResults = useMemo(() => rankClasses(answers).slice(0, 3), [answers])
  const indifference = useMemo(() => getIndifferenceSummary(answers), [answers])

  const looksDone = questions.slice(0, step).filter((item) => item.category === 'looks').length
  const feelDone = questions.slice(0, step).filter((item) => item.category === 'feel').length
  const looksTotal = questions.filter((item) => item.category === 'looks').length
  const feelTotal = questions.filter((item) => item.category === 'feel').length

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [screen, step])

  const begin = () => { setAnswers({}); setStep(0); setSelected(null); setScreen('quiz') }
  const answerQuestion = (optionId: string) => {
    setAnswers((current) => ({ ...current, [question.id]: optionId }))
    if (step === questions.length - 1) setScreen('result')
    else setStep((current) => current + 1)
  }
  const goBack = () => step === 0 ? setScreen('start') : setStep((current) => current - 1)
  const restart = () => { setSelected(null); setAnswers({}); setStep(0); setScreen('start') }

  const classRecommendations = (
    <section className={`class-recommendations ${indifference.isHigh ? 'class-first' : ''}`}>
      <div className="section-heading">
        <div><p className="kicker">职业推荐 · 3 个</p><h2>{indifference.isHigh ? '先从多变的职业开始' : '更适合你的职业方向'}</h2></div>
        <p>{indifference.isHigh ? `你有 ${indifference.count} 题选择了“我无所谓”。比起过早锁定专精，更适合先选能切换多种玩法的职业。` : '职业推荐综合这个职业下表现最接近你的专精，并考虑它能提供多少种职责与玩法。'}</p>
      </div>
      <div className="class-grid">
        {classResults.map((item, index) => (
          <article className="class-card" key={item.name} style={{ '--class-color': item.color } as React.CSSProperties}>
            <div className="class-card-top"><span>0{index + 1}</span><strong>{item.match}%</strong></div>
            <span className="content-label">职业推荐</span>
            <h3>{item.name}</h3>
            <div className="intro-block"><span>职业介绍</span><p>{item.intro}</p></div>
            <p className="class-identity">{item.identity}</p>
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
          <span className="brand-mark"><i>A</i></span>
          <span><strong>职业罗盘</strong><small>艾泽拉斯角色选择器</small></span>
        </button>
        <span className="version">正式服 · 至暗之夜</span>
      </header>

      <main>
        {screen === 'start' && (
          <section className="start-screen">
            <div className="intro-copy">
              <p className="kicker">颜值 × 手感 · 双轴匹配</p>
              <h1>你喜欢的样子，<br /><em>也应该玩得顺手。</em></h1>
              <p className="lede">颜值与手感不再二选一。回答 11 道简单问题，我们会并行计算两条偏好线，给出 6 个专精推荐与 3 个职业推荐；没有明确偏好也没关系。</p>
              <button className="hero-button" type="button" onClick={begin}>开始测试 <span>约 1 分钟</span></button>
            </div>

            <div className="axis-preview" aria-label="两条评分轴">
              <div className="axis-card looks-axis"><span>01</span><strong>颜值偏好</strong><p>幻想、轮廓、武器、特效与角色呈现</p><i /></div>
              <div className="axis-link"><span>并行</span><b>×</b><span>计分</span></div>
              <div className="axis-card feel-axis"><span>02</span><strong>手感偏好</strong><p>职责、距离、节奏、深度、机动与反馈</p><i /></div>
            </div>

            <div className="start-note"><span>13 个职业</span><span>40 个专精</span><span>6 个专精 + 3 个职业</span><span>无需登录</span></div>
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
              <p className={`kicker ${question.category}`}>{question.eyebrow}</p>
              <h2>{question.title}</h2>
              <p className="question-description">{question.description}</p>
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

        {screen === 'result' && (
          <section className="result-screen">
            <div className="result-heading">
              <div><p className="kicker">双轴匹配完成</p><h2>你的职业与专精倾向</h2></div>
              <p>专精百分比由颜值与手感各占一半；职业百分比还会考虑玩法跨度。它们都不是版本强度排名。</p>
            </div>

            {indifference.isHigh && <div className="indifference-banner"><strong>你更像一位探索型玩家</strong><span>{indifference.count}/{indifference.total} 题选择了“我无所谓”，因此本次把职业推荐放在专精之前。</span></div>}

            {indifference.isHigh && classRecommendations}

            <div className="section-heading spec-heading">
              <div><p className="kicker">专精推荐 · 6 个</p><h2>{indifference.isHigh ? '可以优先试玩的专精' : '你的专精倾向'}</h2></div>
              <p>专精介绍只描述该专精本身；职业背景会放在独立的“职业介绍”区域。</p>
            </div>

            <article className="winner" style={{ '--class-color': results[0].color } as React.CSSProperties}>
              <div className="winner-score"><strong>{results[0].match}</strong><span>%</span><small>综合倾向</small></div>
              <div className="winner-copy">
                <span className="class-name">首选 · {results[0].className}</span>
                <h3>{results[0].specName}</h3>
                <div className="intro-block"><span>专精介绍</span><p>{results[0].fantasy} {results[0].summary}</p></div>
                <div className="intro-block class-intro"><span>职业介绍</span><p>{classProfileMap.get(results[0].className)?.intro}</p></div>
                <div className="split-score"><span>颜值 {results[0].looksMatch}%</span><span>手感 {results[0].feelMatch}%</span></div>
                <ul>{results[0].reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                <button className="detail-button" type="button" onClick={() => setSelected(results[0])}>查看玩法提醒</button>
              </div>
            </article>

            <div className="alternatives-heading"><span>另外 5 个相近专精</span><small>02—06</small></div>
            <div className="alternatives">
              {results.slice(1).map((spec, index) => (
                <button className="alternative-card" type="button" onClick={() => setSelected(spec)} key={spec.id} style={{ '--class-color': spec.color } as React.CSSProperties}>
                  <span className="alt-rank">0{index + 2}</span>
                  <span className="alt-name"><small>{spec.className}</small><strong>{spec.specName}</strong><span><b>专精介绍</b>{spec.summary}</span><span><b>职业介绍</b>{classProfileMap.get(spec.className)?.intro}</span></span>
                  <span className="alt-bars"><i style={{ width: `${spec.looksMatch}%` }} /><i style={{ width: `${spec.feelMatch}%` }} /></span>
                  <span className="alt-score"><strong>{spec.match}</strong>%</span>
                </button>
              ))}
            </div>

            {!indifference.isHigh && classRecommendations}

            <div className="result-actions"><button className="primary-button" type="button" onClick={begin}>重新测试</button><button className="text-button" type="button" onClick={restart}>返回首页</button></div>
          </section>
        )}
      </main>

      <footer><span>职业罗盘 · P1.1</span><span>资料基于正式服《至暗之夜》，不构成强度排名</span></footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="关闭">×</button>
            <span className="modal-class" style={{ color:selected.color }}>{selected.className} · {getRoleLabel(selected.role)} · {getRangeLabel(selected.range)}</span>
            <h2 id="detail-title">{selected.match}% · {selected.specName}</h2>
            <div className="modal-copy-block"><span>专精介绍</span><p>{selected.fantasy} {selected.summary}</p></div>
            <div className="modal-copy-block class-copy"><span>职业介绍</span><p>{classProfileMap.get(selected.className)?.intro} {classProfileMap.get(selected.className)?.identity}</p></div>
            <div className="modal-axis"><div><span>颜值契合</span><b>{selected.looksMatch}%</b></div><div><span>手感契合</span><b>{selected.feelMatch}%</b></div></div>
            <div className="caution-box"><span>选择前留意</span><p>{selected.caution}</p></div>
            <div className="metric-grid">
              {([['节奏',selected.metrics.pace],['复杂度',selected.metrics.complexity],['机动',selected.metrics.mobility],['生存',selected.metrics.survivability]] as const).map(([label,value]) => (
                <div key={label}><span>{label}</span><div className="metric-dots" aria-label={`${label} ${value}/5`}>{[1,2,3,4,5].map((dot) => <i className={dot <= value ? 'active' : ''} key={dot} />)}</div></div>
              ))}
            </div>
            <button className="primary-button full" type="button" onClick={() => setSelected(null)}>了解了</button>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
