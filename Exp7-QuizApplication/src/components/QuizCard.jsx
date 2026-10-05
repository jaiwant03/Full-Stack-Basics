import ProgressBar from './ProgressBar'
import Question from './Question'

/**
 * QuizCard
 * Full quiz screen matching the reference image:
 *   – Top bar: "Question N of 12" | progress bar | trophy score badge
 *   – Question card (large number + question text + 2×2 options)
 *   – Yellow tip card
 *   – Bottom nav: dot pagination + "X of Y Questions" | Next button
 *
 * All props/logic unchanged:
 *   question, questionNumber, totalQuestions, selectedOption,
 *   score, onSelectOption, onNext
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
      {/* ── Decorative background blobs ── */}
      <div className="page-blob page-blob--1" aria-hidden="true" />
      <div className="page-blob page-blob--2" aria-hidden="true" />

      {/* ── Top progress bar ── */}
      <div className="quiz-topbar">
        <div className="quiz-topbar__inner">
          <span className="quiz-topbar__counter">
            Question {questionNumber} of {totalQuestions}
          </span>

          <div className="quiz-topbar__bar-wrap">
            <ProgressBar current={questionNumber} total={totalQuestions} />
          </div>

          {/* Trophy score badge */}
          <div className="quiz-topbar__score">
            <span className="quiz-topbar__score-icon" aria-hidden="true">🏆</span>
            <span className="quiz-topbar__score-label">Score</span>
            <span className="quiz-topbar__score-val">{score} / {totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="quiz-body">
        {/* Question card — key forces re-animation on each new question */}
        <Question
          key={questionNumber}
          questionData={question}
          questionNumber={questionNumber}
          selectedOption={selectedOption}
          onSelectOption={onSelectOption}
        />

        {/* Yellow tip card */}
        <div className="tip-card">
          <div className="tip-card__icon" aria-hidden="true">💡</div>
          <div className="tip-card__body">
            <p className="tip-card__title">Take your time!</p>
            <p className="tip-card__desc">
              Read the question carefully and choose the best answer.
            </p>
          </div>
        </div>

        {/* ── Bottom navigation ── */}
        <div className="quiz-nav">
          {/* Left — dot pagination */}
          <div className="quiz-nav__left">
            <p className="quiz-nav__label">{questionNumber} of {totalQuestions} Questions</p>
            <div className="quiz-nav__dots" aria-hidden="true">
              {Array.from({ length: totalQuestions }, (_, i) => {
                let cls = 'quiz-nav__dot'
                if (i + 1 === questionNumber) cls += ' quiz-nav__dot--active'
                else if (i + 1 < questionNumber)  cls += ' quiz-nav__dot--done'
                return <span key={i} className={cls} />
              })}
            </div>
          </div>

          {/* Right — Next / Finish or hint */}
          {hasSelected ? (
            <button className="btn-next" onClick={onNext}>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              <span className="btn-next__arrow" aria-hidden="true">→</span>
            </button>
          ) : (
            <span className="nav-hint">Select an answer to continue</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizCard
