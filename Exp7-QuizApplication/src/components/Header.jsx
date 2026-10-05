function Header() {
  return (
    <header className="header">
      {/* Left — brand logo */}
      <div className="header__logo">
        <div className="header__logo-icon" aria-hidden="true">
          <span>Q</span>
        </div>
        <span className="header__logo-text">QuizMaster</span>
      </div>

      {/* Right — context badge */}
      <span className="header__badge">React Quiz</span>
    </header>
  )
}

export default Header
