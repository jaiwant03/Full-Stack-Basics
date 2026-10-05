import Option from './Option'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * Question
 * Header: large zero-padded number | vertical divider | question text
 * Body: 2×2 options grid
 *
 * Props:
 *   questionData    — { question, options[], answer }
 *   questionNumber  — 1-based
 *   selectedOption  — currently chosen text or null
 *   onSelectOption  — callback(text)
 */
function Question({ questionData, questionNumber, selectedOption, onSelectOption }) {
  const { question, options } = questionData
  const numDisplay = String(questionNumber).padStart(2, '0')

  return (
    <div className="question-card question-enter">
      {/* ── Question header row ── */}
      <div className="question__header">
        {/* Large decorative number */}
        <div className="question__num-block">
          <span className="question__num-label">QUESTION</span>
          <span className="question__num">{numDisplay}</span>
        </div>

        {/* Vertical divider */}
        <div className="question__divider" aria-hidden="true" />

        {/* Question text */}
        <p className="question__text">{question}</p>
      </div>

      {/* ── 2×2 Options grid ── */}
      <div className="options-grid" role="list">
        {options.map((option, index) => (
          <div key={option} role="listitem">
            <Option
              text={option}
              letter={LETTERS[index] ?? String(index + 1)}
              isSelected={selectedOption === option}
              onSelect={onSelectOption}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Question
