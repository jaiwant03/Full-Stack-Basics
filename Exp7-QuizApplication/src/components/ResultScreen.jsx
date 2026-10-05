import { useEffect, useRef } from 'react'

function getPerformanceData(percentage) {
  if (percentage >= 90) return {
    headline: 'Outstanding Performance',
    message: "Near-perfect! You've demonstrated exceptional knowledge of the subject.",
  }
  if (percentage >= 70) return {
    headline: 'Great Job',
    message: "Solid performance. Keep studying and you'll reach the top.",
  }
  if (percentage >= 50) return {
    headline: 'Good Effort',
    message: "You're on the right track. A little more practice will make a big difference.",
  }
  return {
    headline: 'Keep Going',
    message: "Don't give up — review the topics and try again. Every attempt counts.",
  }
}

/**
 * ResultScreen
 * Props — unchanged:
 *   score, totalQuestions, onRestart
 */
function ResultScreen({ score, totalQuestions, onRestart }) {
  const percentage    = Math.round((score / totalQuestions) * 100)
  const wrong         = totalQuestions - score
  const { headline, message } = getPerformanceData(percentage)

  const radius        = 62
  const circumference = 2 * Math.PI * radius
  const targetOffset  = circumference - (percentage / 100) * circumference
  const fillRef       = useRef(null)

  useEffect(() => {
    if (!fillRef.current) return
    fillRef.current.style.strokeDashoffset = circumference
    void fillRef.current.getBoundingClientRect()
    fillRef.current.style.strokeDashoffset = targetOffset
  }, [circumference, targetOffset])

  return (
    <div className="result-screen">
      {/* Background blobs */}
      <div className="page-blob page-blob--1" aria-hidden="true" />
      <div className="page-blob page-blob--2" aria-hidden="true" />

      <div className="result-inner">
        {/* Tag */}
        <div className="result-screen__tag">
          <span className="result-screen__tag-dot" aria-hidden="true" />
          Quiz Completed
        </div>

        {/* Circular score */}
        <div className="score-circle-wrapper" aria-label={`Your score: ${percentage}%`}>
          <div className="score-circle">
            <svg width="164" height="164" viewBox="0 0 164 164" aria-hidden="true">
              <circle className="score-circle__track" cx="82" cy="82" r={radius} />
              <circle
                ref={fillRef}
                className="score-circle__fill"
                cx="82"
                cy="82"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
              />
            </svg>
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

        {/* Performance */}
        <h2 className="result-screen__headline">{headline}</h2>
        <p className="result-screen__message">{message}</p>

        {/* Stats */}
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
          ↺ &nbsp;Restart Quiz
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
