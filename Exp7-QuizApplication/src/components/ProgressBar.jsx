/**
 * ProgressBar
 * Thin animated bar used inside the quiz top bar.
 * Props:
 *   current — 1-based question number
 *   total   — total number of questions
 */
function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Question ${current} of ${total}`}
    >
      <div
        className="progress-bar__fill"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default ProgressBar
