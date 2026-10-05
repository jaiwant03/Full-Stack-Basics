/**
 * StartScreen
 * Left: badge + heading + description + CTA button
 * Right: floating quiz card illustration (CSS only, no images)
 * Bottom: 4-column info strip with icons
 *
 * Props:
 *   totalQuestions — number of questions
 *   onStart        — callback to begin the quiz
 */
function StartScreen({ totalQuestions, onStart }) {
  const stripCards = [
    {
      cls: 'strip-card--blue',
      icon: (
        <svg viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="1"/>
          <path d="M9 12h6M9 16h4"/>
        </svg>
      ),
      title: `${totalQuestions} Questions`,
      desc: 'Total questions\nin quiz',
    },
    {
      cls: 'strip-card--purple',
      icon: (
        <svg viewBox="0 0 24 24" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
      title: 'Multiple Choice',
      desc: 'One correct\nanswer each',
    },
    {
      cls: 'strip-card--green',
      icon: (
        <svg viewBox="0 0 24 24" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6"  y1="20" x2="6"  y2="14"/>
        </svg>
      ),
      title: 'Live Progress',
      desc: 'Track your\nperformance',
    },
    {
      cls: 'strip-card--orange',
      icon: (
        <svg viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      ),
      title: 'Final Score',
      desc: 'Detailed result\nat the end',
    },
  ]

  return (
    <div className="start-screen">
      {/* ── Left column ── */}
      <div className="start-left">
        <div className="start-badge">
          <span className="start-badge__star" aria-hidden="true">✦</span>
          Interactive Quiz
        </div>

        <h1 className="start-heading">Test Your</h1>
        <span className="start-heading--green">Knowledge.</span>

        <p className="start-desc">
          Answer questions, track your progress and discover how much you know about
          React, JavaScript, HTML, CSS and Web Development.
        </p>

        <button className="btn-start" onClick={onStart}>
          Start Quiz
          <span className="btn-start__arrow" aria-hidden="true">→</span>
        </button>
      </div>

      {/* ── Right column — CSS quiz card illustration ── */}
      <div className="start-right" aria-hidden="true">
        {/* Big decorative green circle */}
        <div className="hero-circle" />

        {/* Floating quiz card */}
        <div className="hero-card">
          <div className="hero-card__top">
            <span className="hero-card__counter">Question 1 of {totalQuestions}</span>
            <span className="hero-card__bulb">💡</span>
          </div>

          <div className="hero-card__progress">
            <div className="hero-card__progress-fill" />
          </div>

          <div className="hero-options">
            {[
              { letter: 'A', selected: false },
              { letter: 'B', selected: false },
              { letter: 'C', selected: true  },
              { letter: 'D', selected: false },
            ].map((opt) => (
              <div
                key={opt.letter}
                className={`hero-opt${opt.selected ? ' hero-opt--selected' : ''}`}
              >
                <span className="hero-opt__badge">{opt.letter}</span>
                <div className="hero-opt__bar">
                  <div
                    className="hero-opt__bar-fill"
                    style={{ width: opt.selected ? '70%' : `${20 + Math.random() * 30}%` }}
                  />
                </div>
                <span className="hero-opt__check">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating trophy badge */}
        <div className="hero-trophy">
          <span className="hero-trophy__icon">🏆</span>
          <div className="hero-trophy__text">
            <span className="hero-trophy__val">Top Score!</span>
            <span className="hero-trophy__sub">Keep it up</span>
          </div>
        </div>
      </div>

      {/* ── Bottom info strip — spans full width ── */}
      <div className="start-strip" role="list">
        {stripCards.map((card) => (
          <div key={card.title} className={`strip-card ${card.cls}`} role="listitem">
            <div className="strip-card__icon-wrap">{card.icon}</div>
            <div className="strip-card__title">{card.title}</div>
            <div className="strip-card__desc" style={{ whiteSpace: 'pre-line' }}>{card.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StartScreen
