import { useEffect, useRef } from 'react'

/**
 * Returns a performance message and headline based on percentage score.
 */
function getPerformanceData(percentage) {
  if (percentage >= 90) {
    return {
      headline: 'Outstanding! 🎉',
      message: 'Excellent performance! You have a strong grasp of the material.',
    }
  }
  if (percentage >= 70) {
    return {
      headline: 'Great Job! 👏',
      message: "Well done! Keep practicing and you'll keep improving.",
    }
  }
  if (percentage >= 50) {
    return {
      headline: 'Good Effort! 💪',
      message: 'A little more practice will go a long way. Keep at it!',
    }
  }
  return {
    headline: 'Keep Going! 📚',
    message: "Don't give up — review the topics and try again. You've got this!",
  }
}

/**
 * ResultScreen
 * Displays the final score, a circular progress indicator, stats, and restart button.
 * Props:
 *   score          — number of correct answers
 *   totalQuestions — total number of questions
 *   onRestart      — callback to reset the quiz
 */
function ResultScreen({ score, totalQuestions, onRestart }) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const wrong = totalQuestions - score
  const { headline, message } = getPerformanceData(percentage)

  // SVG circle dimensions
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Animate the circle stroke on mount
  const fillRef = useRef(null)

  useEffect(() => {
    // Start from full offset (hidden) then transition to the real offset
    if (fillRef.current) {
      fillRef.current.style.strokeDashoffset = circumference
      // Trigger reflow so the transition fires
      void fillRef.current.getBoundingClientRect()
      fillRef.current.style.strokeDashoffset = offset
    }
  }, [circumference, offset])

  return (
    <div className="card result-screen">
      {/* Eyebrow */}
      <div className="result-screen__eyebrow">
        <span aria-hidden="true">✦</span> Quiz Completed
      </div>

      {/* Circular score indicator */}
      <div className="score-circle-wrapper" aria-label={`Score: ${percentage}%`}>
        <div className="score-circle">
          <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
            {/* Background track */}
            <circle
              className="score-circle__bg"
              cx="80"
              cy="80"
              r={radius}
            />
            {/* Animated fill */}
            <circle
              ref={fillRef}
              className="score-circle__fill"
              cx="80"
              cy="80"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>

          {/* Centred text overlay */}
          <div className="score-circle__text">
            <span className="score-circle__percentage">{percentage}%</span>
            <span className="score-circle__label">Score</span>
          </div>
        </div>
      </div>

      {/* Fraction */}
      <p className="result-screen__fraction">
        <span>{score}</span> / {totalQuestions}
      </p>
      <p className="result-screen__total-label">Questions answered correctly</p>

      {/* Performance headline & message */}
      <h2 className="result-screen__message">{headline}</h2>
      <p className="result-screen__sub-message">{message}</p>

      {/* Correct / Wrong pills */}
      <div className="result-screen__stats">
        <div className="stat-pill stat-pill--correct">
          <span className="stat-pill__dot" aria-hidden="true" />
          {score} Correct
        </div>
        <div className="stat-pill stat-pill--wrong">
          <span className="stat-pill__dot" aria-hidden="true" />
          {wrong} Wrong
        </div>
      </div>

      {/* Restart */}
      <button className="btn-restart" onClick={onRestart}>
        ↺ Restart Quiz
      </button>
    </div>
  )
}

export default ResultScreen
