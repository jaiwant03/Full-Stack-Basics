function Header() {
  return (
    <header className="header">
      {/* Left — brand */}
      <div className="header__logo">
        <div className="header__logo-icon" aria-hidden="true">
          <span>Q</span>
        </div>
        <span className="header__logo-text">QuizMaster</span>
      </div>

      {/* Right — context tag */}
      <div className="header__right">
        <span className="header__tag">React Quiz</span>
      </div>
    </header>
  )
}

export default Header
