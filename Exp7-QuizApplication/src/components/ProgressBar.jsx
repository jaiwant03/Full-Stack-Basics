/**
 * ProgressBar — thin green bar used in the quiz top bar.
 * Props:
 *   current — 1-based question number
 *   total   — total questions
 */
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Question ${current} of ${total}`}
    >
      <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default ProgressBar
