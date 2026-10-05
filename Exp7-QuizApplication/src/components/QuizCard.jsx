import ProgressBar from './ProgressBar'
import Question from './Question'

/**
 * QuizCard
 * The main quiz interface: meta row, progress bar, question, and navigation.
 * Props:
 *   question        — current question object { question, options[], answer }
 *   questionNumber  — 1-based index
 *   totalQuestions  — total count
 *   selectedOption  — currently selected answer text (or null)
 *   score           — running correct-answer count
 *   onSelectOption  — callback(optionText)
 *   onNext          — callback fired when Next / Finish is clicked
 */
function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  score,
  onSelectOption,
  onNext,
}) {
  const isLastQuestion = questionNumber === totalQuestions
  const hasSelected = selectedOption !== null

  return (
    <div className="card quiz-card">
      {/* ── Top meta row ── */}
      <div className="quiz-card__meta">
        <span className="quiz-card__counter">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="quiz-card__score-badge">
          Score: {score}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <ProgressBar current={questionNumber} total={totalQuestions} />

      {/* ── Question + options (key forces remount / re-animation on change) ── */}
      <Question
        key={questionNumber}
        questionData={question}
        questionNumber={questionNumber}
        selectedOption={selectedOption}
        onSelectOption={onSelectOption}
      />

      {/* ── Navigation ── */}
      <div className="quiz-card__nav">
        {hasSelected ? (
          <button className="btn-next" onClick={onNext}>
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            <span className="btn-next__arrow" aria-hidden="true">
              {isLastQuestion ? '✓' : '→'}
            </span>
          </button>
        ) : (
          <span className="nav-hint">Select an answer to continue</span>
        )}
      </div>
    </div>
  )
}

export default QuizCard
