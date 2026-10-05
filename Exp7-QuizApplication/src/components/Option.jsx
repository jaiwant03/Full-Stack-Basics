/**
 * Option
 * A single answer choice button.
 * Props:
 *   text         — option label string
 *   isSelected   — boolean, whether this option is currently chosen
 *   onSelect     — callback fired when the user clicks this option
 */
function Option({ text, isSelected, onSelect }) {
  return (
    <button
      className={`option${isSelected ? ' option--selected' : ''}`}
      onClick={() => onSelect(text)}
      aria-pressed={isSelected}
    >
      {/* Radio-style indicator circle */}
      <span className="option__indicator" aria-hidden="true">
        <span className="option__indicator-dot" />
      </span>

      <span className="option__text">{text}</span>
    </button>
  )
}

export default Option
