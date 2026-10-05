import Option from './Option'

/**
 * Question
 * Renders the question text and its list of answer options.
 * Props:
 *   questionData    — { question, options[], answer }
 *   questionNumber  — 1-based display number
 *   selectedOption  — currently selected option text (or null)
 *   onSelectOption  — callback(optionText)
 */
function Question({ questionData, questionNumber, selectedOption, onSelectOption }) {
  const { question, options } = questionData

  return (
    <div className="question question-enter">
      {/* Small "Question N" label */}
      <span className="question__number">Question {questionNumber}</span>

      {/* Question text */}
      <p className="question__text">{question}</p>

      {/* Answer options */}
      <ul className="options-list" role="list">
        {options.map((option) => (
          <li key={option} role="listitem">
            <Option
              text={option}
              isSelected={selectedOption === option}
              onSelect={onSelectOption}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Question
