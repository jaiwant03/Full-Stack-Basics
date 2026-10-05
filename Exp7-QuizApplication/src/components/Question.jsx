import Option from './Option'

// Maps option index → letter label
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * Question
 * Two-column layout: large number on left, question text + 2×2 option grid on right.
 * Props:
 *   questionData    — { question, options[], answer }
 *   questionNumber  — 1-based display number
 *   selectedOption  — currently selected option text (or null)
 *   onSelectOption  — callback(optionText)
 */
function Question({ questionData, questionNumber, selectedOption, onSelectOption }) {
  const { question, options } = questionData
  // Zero-pad the question number for the large decorative numeral
  const numDisplay = String(questionNumber).padStart(2, '0')

  return (
    <div className="question question-enter">
      {/* Large decorative number column */}
      <div className="question__num-col" aria-hidden="true">
        <span className="question__num">{numDisplay}</span>
        <span className="question__num-label">Q</span>
      </div>

      {/* Question text + options */}
      <div className="question__content">
        <span className="question__tag">Question {questionNumber}</span>
        <p className="question__text">{question}</p>
      </div>

      {/* Options span full width below the two columns — use grid area trick */}
      <div style={{ gridColumn: '1 / -1' }}>
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
    </div>
  )
}

export default Question
