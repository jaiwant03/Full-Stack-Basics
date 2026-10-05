/**
 * StartScreen
 * Landing page shown before the quiz begins.
 * Props:
 *   totalQuestions — number of questions in the quiz
 *   onStart        — callback to begin the quiz
 */
function StartScreen({ totalQuestions, onStart }) {
  const infoItems = [
    { icon: '📋', value: `${totalQuestions} Questions`, label: 'Total questions in quiz' },
    { icon: '🔤', value: 'Multiple Choice', label: 'One correct answer each' },
    { icon: '⚡', value: 'Instant Progress', label: 'Live score tracking' },
    { icon: '🏆', value: 'Final Score', label: 'Detailed result at the end' },
  ]

  return (
    <div className="card start-screen">
      {/* Eyebrow tag */}
      <div className="start-screen__eyebrow">
        <span aria-hidden="true">✦</span> Interactive Quiz
      </div>

      {/* Heading */}
      <h1 className="start-screen__title">
        Quiz <span>Application</span>
      </h1>

      {/* Subtitle */}
      <p className="start-screen__subtitle">
        Test your knowledge and see how much you know about React, JavaScript,
        HTML, CSS, and Web Development.
      </p>

      {/* Info grid */}
      <div className="start-screen__info" role="list">
        {infoItems.map((item) => (
          <div className="info-item" key={item.value} role="listitem">
            <div className="info-item__icon" aria-hidden="true">
              {item.icon}
            </div>
            <div className="info-item__content">
              <span className="info-item__value">{item.value}</span>
              <span className="info-item__label">{item.label}</span>
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
  )
}

export default StartScreen
