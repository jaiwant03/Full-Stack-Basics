/**
 * StartScreen
 * Two-column hero layout.
 * Left: heading, description, info strip, CTA.
 * Right: CSS-only mock quiz card illustration.
 *
 * Props:
 *   totalQuestions — number of questions
 *   onStart        — callback to begin the quiz
 */
function StartScreen({ totalQuestions, onStart }) {
  const stripItems = [
    {
      cls: 'strip-item--blue',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      ),
      value: `${totalQuestions} Questions`,
      label: 'Total to answer',
    },
    {
      cls: 'strip-item--purple',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
      value: 'Multiple Choice',
      label: 'One correct each',
    },
    {
      cls: 'strip-item--green',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      value: 'Live Progress',
      label: 'Track every step',
    },
    {
      cls: 'strip-item--orange',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
      value: 'Final Score',
      label: 'Detailed result',
    },
  ]

  return (
    <div className="start-screen">
      {/* ── Left column ── */}
      <div className="start-screen__left">
        {/* Badge */}
        <div className="start-screen__badge">
          <span className="start-screen__badge-dot" aria-hidden="true" />
          Interactive Quiz
        </div>

        {/* Heading */}
        <h1 className="start-screen__heading">Test Your</h1>
        <span className="start-screen__heading-line2">Knowledge.</span>

        {/* Description */}
        <p className="start-screen__desc">
          Answer questions, track your progress in real time, and discover
          your final score across React, JavaScript, HTML and CSS.
        </p>

        {/* Info strip */}
        <div className="start-screen__strip" role="list">
          {stripItems.map((item) => (
            <div
              key={item.value}
              className={`strip-item ${item.cls}`}
              role="listitem"
            >
              <div className="strip-item__icon">{item.icon}</div>
              <div className="strip-item__body">
                <span className="strip-item__value">{item.value}</span>
                <span className="strip-item__label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-start" onClick={onStart}>
          Start Quiz
          <span className="btn-start__arrow" aria-hidden="true">→</span>
        </button>
      </div>

      {/* ── Right column — CSS quiz illustration ── */}
      <div className="start-screen__right" aria-hidden="true">
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />

        {/* Floating score badge */}
        <div className="hero-score-badge">
          <span className="hero-score-badge__value">8/12</span>
          <span className="hero-score-badge__label">Score</span>
        </div>

        {/* Mock quiz card */}
        <div className="hero-card">
          <div className="hero-card__top">
            <span className="hero-card__counter">Question 5 of 12</span>
            <span className="hero-card__score">Score: 4</span>
          </div>

          <div className="hero-card__progress">
            <div className="hero-card__progress-fill" />
          </div>

          <p className="hero-card__question">
            Which hook manages state in a React functional component?
          </p>

          <div className="hero-card__options">
            {[
              { letter: 'A', text: 'useEffect', selected: false },
              { letter: 'B', text: 'useContext', selected: false },
              { letter: 'C', text: 'useState',  selected: true  },
              { letter: 'D', text: 'useRef',    selected: false },
            ].map((opt) => (
              <div
                key={opt.letter}
                className={`hero-option${opt.selected ? ' hero-option--selected' : ''}`}
              >
                <span className="hero-option__badge">{opt.letter}</span>
                <span className="hero-option__text">{opt.text}</span>
                <span className="hero-option__check">✓</span>
              </div>
            ))}
          </div>

          <div className="hero-card__btn">
            <span>Next Question</span>
            <span>→</span>
          </div>
        </div>

        {/* Floating streak badge */}
        <div className="hero-streak-badge">
          <div className="hero-streak-badge__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
            </svg>
          </div>
          <div className="hero-streak-badge__text">
            <span className="hero-streak-badge__val">4 Correct</span>
            <span className="hero-streak-badge__sub">Keep going!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartScreen
