/**
 * Option
 * Card with colored circle letter badge (A=blue, B=purple, C=green, D=red)
 * and an animated checkmark when selected.
 *
 * Props:
 *   text       — option text
 *   letter     — 'A' | 'B' | 'C' | 'D'
 *   isSelected — boolean
 *   onSelect   — callback(text)
 */
function Option({ text, letter, isSelected, onSelect }) {
  return (
    <button
      className={`option${isSelected ? ' option--selected' : ''}`}
      data-letter={letter}
      onClick={() => onSelect(text)}
      aria-pressed={isSelected}
    >
      {/* Colored circle badge */}
      <span className="option__badge" aria-hidden="true">{letter}</span>

      {/* Answer text */}
      <span className="option__text">{text}</span>

      {/* Animated checkmark — only visible when selected */}
      <span className="option__check" aria-hidden="true">
        <svg viewBox="0 0 13 13">
          <polyline points="2,7 5,10 11,3" />
        </svg>
      </span>
    </button>
  )
}

export default Option
