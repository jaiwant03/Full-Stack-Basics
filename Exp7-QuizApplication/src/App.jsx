import { useState } from 'react'
import Header from './components/Header'
import StartScreen from './components/StartScreen'
import QuizCard from './components/QuizCard'
import ResultScreen from './components/ResultScreen'
import questions from './data/questions'

// Three application states
const SCREEN = {
  START: 'start',
  QUIZ: 'quiz',
  RESULT: 'result',
}

function App() {
  // Which screen is currently visible
  const [screen, setScreen] = useState(SCREEN.START)

  // Index of the current question (0-based)
  const [currentIndex, setCurrentIndex] = useState(0)

  // The option text the user has selected for the current question
  const [selectedOption, setSelectedOption] = useState(null)

  // Running tally of correct answers
  const [score, setScore] = useState(0)

  // --- Handlers ---

  function handleStart() {
    setScreen(SCREEN.QUIZ)
  }

  function handleSelectOption(option) {
    // Prevent re-selection once an answer is chosen
    if (selectedOption !== null) return
    setSelectedOption(option)
  }

  function handleNext() {
    // Award a point if the selected answer is correct
    if (selectedOption === questions[currentIndex].answer) {
      setScore((prev) => prev + 1)
    }

    const nextIndex = currentIndex + 1

    if (nextIndex < questions.length) {
      // Move to the next question and clear selection
      setCurrentIndex(nextIndex)
      setSelectedOption(null)
    } else {
      // All questions answered — show results
      setScreen(SCREEN.RESULT)
    }
  }

  function handleRestart() {
    // Reset everything back to the initial state
    setScreen(SCREEN.START)
    setCurrentIndex(0)
    setSelectedOption(null)
    setScore(0)
  }

  // Calculate final score including the last answer when going to results
  // Score is updated in handleNext before switching screen, so we use `score`
  // directly on the result screen.

  return (
    <div className="app">
      <Header />

      <main className="main">
        {screen === SCREEN.START && (
          <StartScreen
            totalQuestions={questions.length}
            onStart={handleStart}
          />
        )}

        {screen === SCREEN.QUIZ && (
          <QuizCard
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedOption={selectedOption}
            score={score}
            onSelectOption={handleSelectOption}
            onNext={handleNext}
          />
        )}

        {screen === SCREEN.RESULT && (
          <ResultScreen
            score={score}
            totalQuestions={questions.length}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  )
}

export default App
