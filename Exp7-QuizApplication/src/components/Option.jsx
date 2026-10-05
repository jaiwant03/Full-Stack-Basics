/**
 * Option
 * A single answer card with a letter badge (A/B/C/D), text, and checkmark.
 * Props:
 *   text       — option text string
 *   letter     — label letter: 'A', 'B', 'C', or 'D'
 *   isSelected — whether this option is currently chosen
 *   onSelect   — callback(text) fired on click
 */
function Option({ text, letter, isSelected, onSelect }) {
  return (
    <button
      className={`option${isSelected ? ' option--selected' : ''}`}
      onClick={() => onSelect(text)}
      aria-pressed={isSelected}
    >
      {/* Letter badge */}
      <span className="option__badge" aria-hidden="true">{letter}</span>

      {/* Answer text */}
      <span className="option__text">{text}</span>

      {/* Checkmark — visible only when selected */}
      <span className="option__check" aria-hidden="true">
        <svg viewBox="0 0 12 12">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      </span>
    </button>
  )
}

export default Option
