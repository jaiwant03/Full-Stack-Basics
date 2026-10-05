import ProgressBar from './ProgressBar'
import Question from './Question'

/**
 * QuizCard
 * Full-screen quiz layout:
 *   – Sticky top bar: counter | progress bar | score
 *   – Scrollable body: question + options
 *   – Bottom nav: left info + right Next/Finish button
 *
 * Props — unchanged from original, no logic changes:
 *   question        — { question, options[], answer }
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
  const hasSelected    = selectedOption !== null

  return (
    <div className="quiz-screen">
      {/* ── Top progress bar ── */}
      <div className="quiz-topbar">
        <div className="quiz-topbar__inner">
          <span className="quiz-topbar__counter">
            Question <span>{questionNumber}</span> of {totalQuestions}
          </span>

          <div className="quiz-topbar__progress">
            <ProgressBar current={questionNumber} total={totalQuestions} />
          </div>

          <span className="quiz-topbar__score">
            Score <span>{score}</span> / {totalQuestions}
          </span>
        </div>
      </div>

      {/* ── Question + options ── */}
      <div className="quiz-body">
        {/* key forces re-mount (and re-animation) on each new question */}
        <Question
          key={questionNumber}
          questionData={question}
          questionNumber={questionNumber}
          selectedOption={selectedOption}
          onSelectOption={onSelectOption}
        />

        {/* ── Bottom navigation ── */}
        <div className="quiz-nav">
          {/* Left — context info */}
          <div className="quiz-nav__info">
            <span className="quiz-nav__info-label">Current score</span>
            <span className="quiz-nav__info-value">
              {score} correct out of {questionNumber - 1} answered
            </span>
          </div>

          {/* Right — action */}
          {hasSelected ? (
            <button className="btn-next" onClick={onNext}>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              <span className="btn-next__icon" aria-hidden="true">
                {isLastQuestion ? '✓' : '→'}
              </span>
            </button>
          ) : (
            <span className="nav-hint">
              <span className="nav-hint-icon" aria-hidden="true">?</span>
              Select an answer to continue
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizCard
