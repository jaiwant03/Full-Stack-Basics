import { useEffect, useRef } from 'react'

/**
 * Returns performance headline and message — no emoji.
 */
function getPerformanceData(percentage) {
  if (percentage >= 90) {
    return {
      headline: 'Outstanding Performance',
      message: "You nailed it. A near-perfect score shows a strong command of the material.",
    }
  }
  if (percentage >= 70) {
    return {
      headline: 'Great Job',
      message: "Solid work. Keep practicing and you'll reach the top.",
    }
  }
  if (percentage >= 50) {
    return {
      headline: 'Good Effort',
      message: "You're on the right track. A little more practice will make a big difference.",
    }
  }
  return {
    headline: 'Keep Going',
    message: "Don't give up — review the topics and try again. Every attempt counts.",
  }
}

/**
 * ResultScreen
 * Premium centered result layout with animated SVG circle.
 * Props — unchanged:
 *   score          — number of correct answers
 *   totalQuestions — total number of questions
 *   onRestart      — callback to reset the quiz
 */
function ResultScreen({ score, totalQuestions, onRestart }) {
  const percentage   = Math.round((score / totalQuestions) * 100)
  const wrong        = totalQuestions - score
  const { headline, message } = getPerformanceData(percentage)

  // SVG circle math
  const radius       = 62
  const circumference = 2 * Math.PI * radius
  const targetOffset  = circumference - (percentage / 100) * circumference

  const fillRef = useRef(null)

  useEffect(() => {
    if (!fillRef.current) return
    // Start fully hidden, then animate to the real offset
    fillRef.current.style.strokeDashoffset = circumference
    void fillRef.current.getBoundingClientRect() // force reflow
    fillRef.current.style.strokeDashoffset = targetOffset
  }, [circumference, targetOffset])

  return (
    <div className="result-screen">
      <div className="result-inner">
        {/* Tag */}
        <div className="result-screen__tag">
          <span className="result-screen__tag-dot" aria-hidden="true" />
          Quiz Completed
        </div>

        {/* Circular progress */}
        <div
          className="score-circle-wrapper"
          aria-label={`Your score is ${percentage} percent`}
        >
          <div className="score-circle">
            <svg
              width="168"
              height="168"
              viewBox="0 0 168 168"
              aria-hidden="true"
            >
              {/* Gradient definition */}
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#007C83" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>

              {/* Track */}
              <circle
                className="score-circle__track"
                cx="84"
                cy="84"
                r={radius}
              />

              {/* Animated fill */}
              <circle
                ref={fillRef}
                className="score-circle__fill"
                cx="84"
                cy="84"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
              />
            </svg>

            {/* Centred label */}
            <div className="score-circle__text">
              <span className="score-circle__pct">{percentage}%</span>
              <span className="score-circle__sublabel">Score</span>
            </div>
          </div>
        </div>

        {/* Fraction */}
        <p className="result-screen__fraction">
          <em>{score}</em> / {totalQuestions}
        </p>
        <p className="result-screen__fraction-label">Questions answered correctly</p>

        {/* Performance message */}
        <h2 className="result-screen__headline">{headline}</h2>
        <p className="result-screen__message">{message}</p>

        {/* Stat cards */}
        <div className="result-screen__stats">
          <div className="stat-card stat-card--correct">
            <span className="stat-card__value">{score}</span>
            <span className="stat-card__label">Correct</span>
          </div>
          <div className="stat-card stat-card--wrong">
            <span className="stat-card__value">{wrong}</span>
            <span className="stat-card__label">Wrong</span>
          </div>
        </div>

        {/* Restart */}
        <button className="btn-restart" onClick={onRestart}>
          ↺ Restart Quiz
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
