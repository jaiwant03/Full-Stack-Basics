# App.jsx
```jsx
import { useState } from 'react'
import Header from './components/Header'
import QuizCard from './components/QuizCard'
import ResultScreen from './components/ResultScreen'
import questions from './data/questions'
function App() {
  const [index, setIndex] = useState(0), [score, setScore] = useState(0), [selected, setSelected] = useState(null)
  const next = () => { if (selected === questions[index].answer) setScore(score + 1); setSelected(null); setIndex(index + 1) }
  const restart = () => { setIndex(0); setScore(0); setSelected(null) }
  return <div className="app"><Header />{index < questions.length ? <QuizCard question={questions[index]} questionNumber={index + 1} totalQuestions={questions.length} selectedOption={selected} score={score} onSelectOption={setSelected} onNext={next} /> : <ResultScreen score={score} totalQuestions={questions.length} onRestart={restart} />}</div>
}
export default App
```

# main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

# index.html
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="QuizMaster — Test your knowledge with this interactive React quiz application">
  <title>QuizMaster</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

# React Application Commands
```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```